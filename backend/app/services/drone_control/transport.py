"""Documented Tello UDP SDK transport; no automatic flight-command retries."""
import socket


class SimulatedTransport:
    def connect(self):
        pass

    def command(self, command):
        pass

    def send_rc(self, axes):
        pass

    def close(self):
        pass


class TelloTransport:
    def __init__(self, config):
        self.config = config
        self.socket = None

    def connect(self):
        self.close()
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            self.socket.bind(("", self.config.local_port))
            self.socket.connect((self.config.host, self.config.port))
            self.command("command")
        except Exception:
            self.close()
            raise

    def command(self, command):
        if self.socket is None:
            raise ConnectionError("Tello is disconnected")
        # Discard RC acknowledgements before an acknowledged SDK command.
        self.socket.setblocking(False)
        try:
            while True:
                self.socket.recv(1024)
        except BlockingIOError:
            pass
        self.socket.settimeout(self.config.command_timeout)
        self.socket.send(command.encode("ascii"))
        response = self.socket.recv(1024).decode("ascii", errors="replace").strip()
        if response.lower() != "ok":
            raise ConnectionError(f"Tello rejected {command}: {response}")

    def send_rc(self, axes):
        if self.socket is None:
            raise ConnectionError("Tello is disconnected")
        values = (axes.left_right, axes.forward_back, axes.up_down, axes.yaw)
        self.socket.send(("rc " + " ".join(str(value) for value in values)).encode("ascii"))

    def close(self):
        if self.socket is not None:
            self.socket.close()
            self.socket = None
