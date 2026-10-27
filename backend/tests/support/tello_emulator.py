"""Loopback-only UDP peer for testing the real SDK transport without aircraft."""
import socket
import threading


class TelloEmulator:
    def __init__(self):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.bind(("127.0.0.1", 0))
        self.socket.settimeout(0.05)
        self.port = self.socket.getsockname()[1]
        self.packets = []
        self.reject = None
        self.drop = None
        self.lock = threading.Lock()
        self.stop = threading.Event()
        self.thread = threading.Thread(target=self._run, daemon=True)
        self.thread.start()

    def _run(self):
        while not self.stop.is_set():
            try:
                data, address = self.socket.recvfrom(1024)
            except socket.timeout:
                continue
            except OSError:
                break
            command = data.decode("ascii")
            with self.lock:
                self.packets.append(command)
                reject, drop = self.reject == command, self.drop == command
                if reject:
                    self.reject = None
                if drop:
                    self.drop = None
            if command.startswith("rc ") or drop:
                continue
            self.socket.sendto(b"error" if reject else b"ok", address)

    def snapshot(self):
        with self.lock:
            return list(self.packets)

    def close(self):
        self.stop.set()
        self.socket.close()
        self.thread.join(timeout=1)
