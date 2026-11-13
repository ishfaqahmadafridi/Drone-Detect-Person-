"""Ryze Tello SDK (1.3 / 2.0) text protocol over UDP.

Threading contract: the controller serialises every call through its lock,
except ``emergency()``, which only sends one datagram and is safe to call while
another thread waits for an acknowledgement.

Retry policy: only the SDK-mode handshake (``command``) is retried, because it
never moves the aircraft. Flight commands are sent exactly once; an unanswered
takeoff or land leaves the aircraft state unknown and is reported, not repeated.
"""
import socket
import time

from app.core.constants import (
    TELLO_ACK_OK,
    TELLO_CMD_EMERGENCY,
    TELLO_CMD_RC,
    TELLO_CMD_SDK_MODE,
    TELLO_FLIGHT_COMMANDS,
    TELLO_MAX_DRAIN_PACKETS,
    TELLO_RECV_BUFFER_BYTES,
)
from app.services.drone_control.telemetry import TelloStateReceiver

_LINK_HINT = "check the TELLO Wi-Fi connection and close other Tello apps"


class SimulatedTransport:
    def connect(self):
        pass

    def command(self, command):
        pass

    def send_rc(self, axes):
        pass

    def emergency(self):
        pass

    def telemetry(self):
        return None

    def close(self):
        pass


class TelloTransport:
    def __init__(self, config, state_receiver=None, clock=time.monotonic, sleep=time.sleep):
        self.config = config
        self.socket = None
        self.state = state_receiver or TelloStateReceiver(config)
        self._clock = clock
        self._sleep = sleep
        self._last_send = 0.0

    # -- lifecycle -----------------------------------------------------------

    def connect(self):
        self.close()
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            # Lets a restarted backend rebind while the old socket is in teardown.
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            sock.bind(("", self.config.local_port))
            sock.connect((self.config.host, self.config.port))
        except OSError as exc:
            sock.close()
            raise ConnectionError(
                f"Cannot open Tello control socket (local UDP {self.config.local_port} -> "
                f"{self.config.host}:{self.config.port}): {exc}; {_LINK_HINT}"
            ) from exc
        self.socket = sock
        # Start listening before the handshake so the first state packets are kept.
        self.state.start()
        try:
            self._enter_sdk_mode()
        except Exception:
            self.close()
            raise

    def _enter_sdk_mode(self):
        last_timeout = None
        for _ in range(self.config.connect_attempts):
            try:
                self.command(TELLO_CMD_SDK_MODE)
                return
            except TimeoutError as exc:
                last_timeout = exc
        raise TimeoutError(
            f"Tello did not acknowledge SDK mode after {self.config.connect_attempts} attempt(s). "
            f"Last error: {last_timeout}"
        ) from last_timeout

    def close(self):
        self.state.stop()
        if self.socket is not None:
            self.socket.close()
            self.socket = None

    # -- commands ------------------------------------------------------------

    def command(self, command):
        """Send an acknowledged SDK command; raise unless the aircraft answers ``ok``."""
        sock = self._require_socket()
        timeout = (self.config.flight_command_timeout if command in TELLO_FLIGHT_COMMANDS
                   else self.config.command_timeout)
        self._drain(sock)
        self._respect_command_gap()
        self._send(sock, command)
        self._await_ack(sock, command, timeout)

    def send_rc(self, axes):
        values = (axes.left_right, axes.forward_back, axes.up_down, axes.yaw)
        self._send(self._require_socket(), " ".join([TELLO_CMD_RC, *map(str, values)]))

    def emergency(self):
        """Stop motors immediately. Fire-and-forget: waiting for an ack would delay it."""
        self._require_socket().send(TELLO_CMD_EMERGENCY.encode("ascii"))

    def telemetry(self):
        return self.state.snapshot() if self.socket is not None else None

    # -- internals -----------------------------------------------------------

    def _require_socket(self):
        if self.socket is None:
            raise ConnectionError("Tello is disconnected")
        return self.socket

    def _send(self, sock, text):
        sock.send(text.encode("ascii"))
        self._last_send = self._clock()

    def _respect_command_gap(self):
        wait = self._last_send + self.config.command_gap - self._clock()
        if wait > 0:
            self._sleep(wait)

    @staticmethod
    def _drain(sock):
        """Discard stale replies (late acks, rc replies on older firmware) so they
        cannot be mistaken for the next command's acknowledgement."""
        sock.setblocking(False)
        try:
            for _ in range(TELLO_MAX_DRAIN_PACKETS):
                try:
                    sock.recv(TELLO_RECV_BUFFER_BYTES)
                except (BlockingIOError, InterruptedError):
                    return
                except ConnectionRefusedError:
                    continue  # A queued ICMP error from an earlier datagram; it is cleared on read.
        finally:
            sock.setblocking(True)

    def _await_ack(self, sock, command, timeout):
        deadline = self._clock() + timeout
        skipped_binary = False
        while True:
            remaining = deadline - self._clock()
            if remaining <= 0:
                raise self._timeout(command, skipped_binary)
            sock.settimeout(remaining)
            try:
                packet = sock.recv(TELLO_RECV_BUFFER_BYTES)
            except socket.timeout as exc:
                raise self._timeout(command, skipped_binary) from exc
            except ConnectionRefusedError as exc:
                raise ConnectionError(
                    f"Tello unreachable at {self.config.host}:{self.config.port} while sending {command}; {_LINK_HINT}"
                ) from exc
            response = self._decode(packet)
            if response is None:
                skipped_binary = True
                continue
            if response.lower() == TELLO_ACK_OK:
                return
            raise ConnectionError(f"Tello rejected {command}: {response}")

    @staticmethod
    def _decode(packet):
        try:
            response = packet.decode("ascii").strip()
        except UnicodeDecodeError:
            return None
        return response if response and response.isprintable() else None

    @staticmethod
    def _timeout(command, skipped_binary):
        reason = " (received non-SDK binary packets)" if skipped_binary else ""
        return TimeoutError(f"No SDK text acknowledgment for {command}{reason}; {_LINK_HINT}")
