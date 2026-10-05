"""
HTTP Endpoint Normalizer: Sanitizes camera stream URLs and extracts Basic Auth headers.
"""

from urllib.parse import urlparse
import base64
from typing import Optional


class HttpEndpointNormalizer:
    """
    Handles URI parsing, credentials extraction, and IP Webcam / DroidCam / MJPEG endpoint routing.
    """

    @staticmethod
    def extract_auth_header(url: str) -> Optional[str]:
        """Extract HTTP Basic Auth header if username and password are embedded in the URL."""
        try:
            parsed = urlparse(url)
            if parsed.username:
                user = parsed.username
                pwd = parsed.password or ""
                token = base64.b64encode(f"{user}:{pwd}".encode("utf-8")).decode("ascii")
                return f"Basic {token}"
        except Exception:
            pass
        return None

    @staticmethod
    def normalize_snapshot_url(url: str) -> str:
        """
        Normalizes Android IP Webcam, DroidCam, and standard MJPEG stream endpoints to snapshot endpoints.
        """
        parsed = urlparse(url)
        netloc = parsed.netloc
        clean_base = f"{parsed.scheme}://{netloc}"
        if parsed.path and parsed.path.endswith((".jpg", ".jpeg")):
            return url
        if "/video" in parsed.path:
            return f"{clean_base}/shot.jpg"
        return f"{url.rstrip('/')}/shot.jpg"
