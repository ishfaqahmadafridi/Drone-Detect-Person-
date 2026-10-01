"""
Stream Connection Prober Service: Validates link reachability and formats stream paths.

Decoupled service layer for probing wired/wireless CCTV and mobile phone RTSP/HTTP endpoints
without interfering with the primary computer vision processing loop.
"""

import time
import socket
import urllib.parse
from typing import Optional
from app.schemas.config import StreamSourceRequest, StreamTestConnectionResponse


class StreamConnectionProberService:
    """
    Handles URI synthesis and non-blocking TCP socket diagnostics for external stream sources.
    """

    def __init__(self, default_timeout_s: float = 2.0) -> None:
        self.default_timeout_s = default_timeout_s

    def build_effective_stream_path(self, req: StreamSourceRequest) -> str:
        """
        Synthesize full authenticated RTSP or HTTP URI from structured or raw request fields.
        """
        if req.source_path and req.source_path.strip():
            return req.source_path.strip()

        if req.host and req.host.strip():
            proto = "http" if req.source_type == "http" or (req.device_type == "mobile_phone" and req.port != 554) else "rtsp"
            auth = ""
            if req.username and req.username.strip():
                u = req.username.strip()
                auth = f"{u}:{req.password}@" if req.password else f"{u}@"
            port = f":{req.port}" if req.port else ""
            path = f"/{req.stream_path.lstrip('/')}" if req.stream_path else ""
            return f"{proto}://{auth}{req.host.strip()}{port}{path}"

        return ""

    def probe_connection(self, req: StreamSourceRequest) -> StreamTestConnectionResponse:
        """
        Probe TCP link connectivity and report roundtrip socket latency.
        """
        effective_url = self.build_effective_stream_path(req)

        # Synthetic source is always local and ready
        if not effective_url and req.source_type == "synthetic":
            return StreamTestConnectionResponse(
                success=True,
                latency_ms=1.2,
                message="Synthetic Procedural UAV/CCTV simulation engine ready",
                effective_url="synthetic://procedural",
            )

        # Extract host and port
        host = req.host
        port = req.port
        if not host and effective_url:
            try:
                parsed = urllib.parse.urlparse(effective_url)
                host = parsed.hostname
                port = parsed.port or (554 if parsed.scheme == "rtsp" else 80)
            except Exception:
                host = None

        if not host:
            return StreamTestConnectionResponse(
                success=False,
                message="No valid target host or IP provided for stream verification",
                effective_url=effective_url,
            )

        target_port = port if port else (554 if req.source_type == "rtsp" else 8080)
        start_time = time.time()

        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(self.default_timeout_s)
            result = sock.connect_ex((host, target_port))
            latency = round((time.time() - start_time) * 1000, 1)

            if result == 0:
                # Perform application-layer protocol validation (RTSP / HTTP)
                proto = "http" if req.source_type == "http" or (req.device_type == "mobile_phone" and target_port != 554) else "rtsp"
                app_message = f"Verified link to {host}:{target_port} ({latency}ms)"
                app_success = True

                try:
                    sock.settimeout(1.0)
                    if proto == "rtsp":
                        clean_url = effective_url or f"rtsp://{host}:{target_port}/live"
                        describe_cmd = (
                            f"DESCRIBE {clean_url} RTSP/1.0\r\n"
                            f"CSeq: 1\r\n"
                            f"User-Agent: AERO-GUARD-PROBER\r\n"
                            f"Accept: application/sdp\r\n\r\n"
                        )
                        sock.sendall(describe_cmd.encode("utf-8"))
                        resp_chunk = sock.recv(512)
                        if resp_chunk:
                            if b"RTSP/1.0 200" in resp_chunk:
                                app_message = f"RTSP stream verified & online ({latency}ms)"
                            elif b"RTSP/1.0 401" in resp_chunk:
                                app_success = False
                                app_message = f"Camera reached at {host}:{target_port}, but RTSP authentication failed (401 Unauthorized). Check credentials."
                            elif b"RTSP/1.0 404" in resp_chunk:
                                app_success = False
                                app_message = f"Camera reached at {host}:{target_port}, but stream path not found (404 Not Found)."
                    elif proto == "http":
                        path = f"/{req.stream_path.lstrip('/')}" if req.stream_path else "/"
                        head_cmd = (
                            f"HEAD {path} HTTP/1.1\r\n"
                            f"Host: {host}:{target_port}\r\n"
                            f"User-Agent: AERO-GUARD-PROBER\r\n"
                            f"Connection: close\r\n\r\n"
                        )
                        sock.sendall(head_cmd.encode("utf-8"))
                        resp_chunk = sock.recv(512)
                        if resp_chunk:
                            if b"HTTP/1.1 200" in resp_chunk or b"HTTP/1.0 200" in resp_chunk:
                                app_message = f"HTTP phone camera feed verified ({latency}ms)"
                            elif b"HTTP/1.1 401" in resp_chunk or b"HTTP/1.0 401" in resp_chunk:
                                app_success = False
                                app_message = f"HTTP server reached, but authentication required (401 Unauthorized)."
                            elif b"HTTP/1.1 404" in resp_chunk or b"HTTP/1.0 404" in resp_chunk:
                                app_success = False
                                app_message = f"HTTP server reached, but path '{path}' returned 404 Not Found."
                except Exception:
                    # Device accepts TCP connection but does not respond to raw text handshake immediately
                    pass
                finally:
                    sock.close()

                return StreamTestConnectionResponse(
                    success=app_success,
                    latency_ms=latency,
                    message=app_message,
                    effective_url=effective_url,
                )
            else:
                sock.close()
                return StreamTestConnectionResponse(
                    success=False,
                    latency_ms=latency,
                    message=f"Target {host}:{target_port} unreachable or port closed (error code {result})",
                    effective_url=effective_url,
                )
        except Exception as exc:
            latency = round((time.time() - start_time) * 1000, 1)
            return StreamTestConnectionResponse(
                success=False,
                latency_ms=latency,
                message=f"Network error probing {host}:{target_port}: {str(exc)}",
                effective_url=effective_url,
            )


# Singleton service instance
stream_connection_service = StreamConnectionProberService()
