"""Single-owner latest-input controller with a bounded movement lease."""
import logging
import threading
import time
from fastapi import HTTPException
from app.core.config import TelloControlConfig
from app.core.constants import TELLO_CMD_STREAM_ON, TELLO_CMD_TAKEOFF
from app.schemas.drone import DroneControlAxes, DroneControlStatus
from app.services.drone_control.transport import SimulatedTransport, TelloTransport


class DroneMovementController:
    def __init__(self, config=None, transport=None, clock=time.monotonic):
        self.config = config or TelloControlConfig()
        self.transport = transport or (TelloTransport(self.config) if self.config.mode == "tello" else SimulatedTransport())
        self.clock = clock
        self.lock = threading.RLock()
        self.owner = None
        self.sequence = -1
        self.axes = DroneControlAxes()
        self.updated = None
        self.connected = False
        self.flight_state = "landed"
        self.error = ""
        self._stop = threading.Event()
        self._thread = None
        self._expiry_sent = False

    def _require_owner(self, session_id):
        if not self.connected or self.owner != session_id:
            raise HTTPException(409, "Connect this control session first.")

    def connect(self, session_id, confirmed_landed=False):
        with self.lock:
            if self.flight_state == "unknown" and not confirmed_landed:
                raise HTTPException(409, "Confirm the drone is physically on the ground before reconnecting.")
            if self.connected:
                if self.owner != session_id:
                    if not self._expired():
                        raise HTTPException(409, "Another operator is controlling this drone.")
                    self.owner, self.sequence = session_id, -1
                    self.axes = DroneControlAxes()
                    self.updated = self.clock()
                    self._expiry_sent = False
                if confirmed_landed and self.flight_state == "unknown":
                    self.flight_state, self.error = "landed", ""
                return self.status()
            try:
                self.transport.connect()
            except Exception as exc:
                self.error = str(exc)
                raise HTTPException(503, f"Tello connection failed: {exc}") from exc
            if confirmed_landed and self.flight_state == "unknown":
                self.flight_state = "landed"
            self.owner, self.sequence = session_id, -1
            self.connected, self.error = True, ""
            self.updated = self.clock()
            self.axes = DroneControlAxes()
            self._expiry_sent = False
            self._stop.clear()
            if self._thread is None or not self._thread.is_alive():
                self._thread = threading.Thread(target=self._run, name="drone-rc", daemon=True)
                self._thread.start()
            return self.status()

    def start_video(self, session_id):
        with self.lock:
            self._require_owner(session_id)
            if self.config.mode != "tello":
                raise HTTPException(409, "Real Tello video is unavailable in simulation mode.")
            if self.flight_state != "landed":
                raise HTTPException(409, "Start the camera while the drone is on the ground.")
            try:
                self.transport.command(TELLO_CMD_STREAM_ON)
                self.updated = self.clock()
                self._expiry_sent = False
            except Exception as exc:
                # A camera failure does not establish any change in flight state.
                raise HTTPException(503, f"Tello camera start failed: {exc}") from exc

    def input(self, request):
        with self.lock:
            self._require_owner(request.session_id)
            if request.sequence <= self.sequence:
                raise HTTPException(409, "Outdated control input rejected.")
            self.sequence = request.sequence
            if self.flight_state != "airborne" and any(request.axes.model_dump().values()):
                raise HTTPException(409, "Take off before sending movement input.")
            self.axes = request.axes.model_copy()
            self.updated = self.clock()
            self._expiry_sent = False
            return self.status()

    def _expired(self):
        return self.updated is None or self.clock() - self.updated >= self.config.input_timeout

    def tick(self):
        with self.lock:
            if not self.connected:
                return
            expired = self._expired()
            if expired and self._expiry_sent:
                return  # Do not indefinitely suppress the aircraft's own link-loss behavior.
            self.transport.send_rc(DroneControlAxes() if expired else self.axes)
            self._expiry_sent = expired

    def _run(self):
        while not self._stop.wait(self.config.send_interval):
            try:
                self.tick()
            except Exception as exc:
                with self.lock:
                    self._fail(exc)

    def _fail(self, exc):
        self.error = str(exc)
        self.connected = False
        self.flight_state = "unknown"
        self.axes = DroneControlAxes()
        self.transport.close()
        logging.warning("Drone control connection lost: %s", exc)

    def _preflight_check(self):
        """Refuse takeoff locally so a predictable rejection never makes state unknown."""
        if self.flight_state != "landed":
            raise HTTPException(409, "Aircraft state must be confirmed landed before takeoff.")
        telemetry = self.transport.telemetry()
        battery = telemetry.battery_percent if telemetry and telemetry.fresh else None
        if battery is not None and battery < self.config.min_takeoff_battery:
            raise HTTPException(409, f"Battery {battery}% is below the {self.config.min_takeoff_battery}% takeoff minimum.")

    def action(self, session_id, action):
        with self.lock:
            self._require_owner(session_id)
            if action == TELLO_CMD_TAKEOFF:
                self._preflight_check()
            self.axes = DroneControlAxes()
            self.updated = None
            try:
                self.transport.send_rc(self.axes)
                if action != "hover":
                    self.transport.command(action)
                    self.flight_state = "airborne" if action == "takeoff" else "landed"
            except Exception as exc:
                self._fail(exc)
                raise HTTPException(
                    503,
                    f"{exc}. Aircraft state is unknown; movement is disabled. "
                    "Confirm the aircraft is safely on the ground before recovery. "
                    "Do not retry flight commands blindly.",
                ) from exc
            self.updated = self.clock()
            self._expiry_sent = False
            return self.status()

    def emergency(self, session_id):
        """Kill the motors. The datagram is sent before taking the lock so it never
        queues behind a takeoff/land that is still waiting for its acknowledgement."""
        if not self.connected or self.owner != session_id:
            raise HTTPException(409, "Connect this control session first.")
        try:
            self.transport.emergency()
        except Exception as exc:
            raise HTTPException(503, f"Emergency stop could not be sent: {exc}") from exc
        with self.lock:
            self.axes = DroneControlAxes()
            self.updated = None
            self.flight_state = "unknown"
            self.error = "Emergency motor stop sent. Confirm the aircraft is on the ground before reconnecting."
            logging.warning("Drone emergency motor stop sent by session %s", session_id)
            return self.status()

    def status(self):
        with self.lock:
            expired = self._expired()
            return DroneControlStatus(
                mode=self.config.mode, connected=self.connected, flight_state=self.flight_state,
                axes=DroneControlAxes() if expired else self.axes, input_expired=expired, error=self.error,
                telemetry=self.transport.telemetry() if self.connected else None,
            )

    def disconnect(self, session_id):
        with self.lock:
            self._require_owner(session_id)
            if self.flight_state != "landed":
                raise HTTPException(409, "Land and confirm the aircraft state before disconnecting.")
            try:
                self.transport.send_rc(DroneControlAxes())
            finally:
                self.connected = False
                self.updated = None
                self.transport.close()
            return self.status()

    def close(self):
        self._stop.set()
        with self.lock:
            try:
                if self.connected:
                    self.transport.send_rc(DroneControlAxes())
            except Exception:
                logging.exception("Could not send neutral input while closing drone control")
            finally:
                self.connected = False
                self.updated = None
                self.transport.close()


drone_movement_controller = DroneMovementController()
