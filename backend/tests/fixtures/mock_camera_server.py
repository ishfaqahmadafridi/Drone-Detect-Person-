"""
Reusable Mock Camera Socket Server Fixture for Testing Network Streams.
Simulates TCP connectivity, RTSP 1.0 handshake (200/401/404), and HTTP IP Webcam responses.
"""

import socket
import threading
import time


def find_free_port() -> int:
    """Find an available ephemeral TCP port on localhost."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


class MockCameraSocketServer:
    """Ephemeral TCP/Application socket listener simulating live RTSP or HTTP camera feeds."""

    def __init__(self, port: int, response_mode: str = "ok"):
        self.port = port
        self.response_mode = response_mode  # "ok", "unauthorized", "not_found", "tcp_only"
        self.running = False
        self.sock = None
        self.thread = None

    def start(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.sock.bind(("127.0.0.1", self.port))
        self.sock.listen(5)
        self.sock.settimeout(0.5)
        self.running = True

        def accept_loop():
            while self.running:
                try:
                    conn, _ = self.sock.accept()
                    conn.settimeout(0.5)
                    data = conn.recv(512)
                    if data and self.response_mode != "tcp_only":
                        if b"RTSP" in data:
                            if self.response_mode == "unauthorized":
                                conn.sendall(b"RTSP/1.0 401 Unauthorized\r\nCSeq: 1\r\n\r\n")
                            elif self.response_mode == "not_found":
                                conn.sendall(b"RTSP/1.0 404 Not Found\r\nCSeq: 1\r\n\r\n")
                            else:
                                conn.sendall(b"RTSP/1.0 200 OK\r\nCSeq: 1\r\nContent-Type: application/sdp\r\n\r\n")
                        elif b"HTTP" in data:
                            if self.response_mode == "unauthorized":
                                conn.sendall(b"HTTP/1.1 401 Unauthorized\r\n\r\n")
                            elif self.response_mode == "not_found":
                                conn.sendall(b"HTTP/1.1 404 Not Found\r\n\r\n")
                            else:
                                conn.sendall(b"HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n")
                    conn.close()
                except socket.timeout:
                    continue
                except Exception:
                    break

        self.thread = threading.Thread(target=accept_loop, daemon=True)
        self.thread.start()
        time.sleep(0.05)

    def stop(self):
        self.running = False
        if self.sock:
            try:
                self.sock.close()
            except Exception:
                pass
        if self.thread and self.thread.is_alive():
            self.thread.join(timeout=1.0)
