"""Receiver for the Tello SDK state broadcast.

Once in SDK mode the aircraft sends ``key:value;key:value;...`` text to UDP 8890
on the controlling host at roughly 10 Hz. Telemetry is advisory: failing to
bind or parse it never blocks flight control.
"""
import logging
import socket
import threading
import time

from app.core.constants import TELLO_RECV_BUFFER_BYTES
from app.schemas.drone import DroneTelemetry

_FIELDS = {
    "battery_percent": "bat",
    "height_cm": "h",
    "temperature_high_c": "temph",
}


def parse_state(packet):
    """Parse one state datagram into a dict; malformed pairs are skipped."""
    try:
        text = packet.decode("ascii").strip()
    except UnicodeDecodeError:
        return {}
    state = {}
    for pair in text.split(";"):
        key, sep, value = pair.partition(":")
        if sep and key.strip():
            state[key.strip()] = value.strip()
    return state


def _as_int(value):
    try:
        return int(float(value))
    except (TypeError, ValueError, OverflowError):
        return None


class TelloStateReceiver:
    def __init__(self, config, clock=time.monotonic):
        self.config = config
        self.clock = clock
        self._lock = threading.Lock()
        self._state = {}
        self._received_at = None
        self._socket = None
        self._stop = threading.Event()
        self._thread = None

    @property
    def port(self):
        return self._socket.getsockname()[1] if self._socket else None

    def start(self):
        self.stop()
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(("", self.config.state_port))
            sock.settimeout(self.config.state_poll_interval)
        except OSError as exc:
            sock.close()
            logging.warning("Tello telemetry unavailable on UDP %s: %s", self.config.state_port, exc)
            return False
        self._socket = sock
        self._stop.clear()
        self._thread = threading.Thread(target=self._run, args=(sock,), name="tello-state", daemon=True)
        self._thread.start()
        return True

    def _run(self, sock):
        while not self._stop.is_set():
            try:
                packet = sock.recv(TELLO_RECV_BUFFER_BYTES)
            except socket.timeout:
                continue
            except OSError:
                return  # Socket closed by stop().
            state = parse_state(packet)
            if state:
                with self._lock:
                    self._state, self._received_at = state, self.clock()

    def snapshot(self):
        with self._lock:
            if self._received_at is None:
                return None
            state, age = dict(self._state), self.clock() - self._received_at
        return DroneTelemetry(
            **{field: _as_int(state.get(key)) for field, key in _FIELDS.items()},
            age_s=round(age, 2),
            fresh=age < self.config.state_stale,
        )

    def stop(self):
        self._stop.set()
        if self._socket is not None:
            self._socket.close()
            self._socket = None
        if self._thread is not None and self._thread is not threading.current_thread():
            self._thread.join(timeout=self.config.state_join_timeout)
        self._thread = None
        with self._lock:
            self._state, self._received_at = {}, None
