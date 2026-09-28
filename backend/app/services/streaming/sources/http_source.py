"""
HTTP Stream Source: Acquires frames from network endpoints, IP webcams, and mobile phones.
Uses urllib with configurable timeouts, URL normalization, and downsampling.
"""

from urllib.parse import urlparse
import urllib.request
from typing import Tuple, Optional
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.services.streaming.sources.base import BaseFrameSource


class HttpFrameSource(BaseFrameSource):
    """
    Acquires frames over HTTP/HTTPS from smartphone IP cameras and remote webcams.
    """
    def __init__(
        self,
        url: str,
        timeout_seconds: float = 2.5,
        max_width: int = 1280
    ):
        self.raw_url = url
        self.timeout_seconds = timeout_seconds
        self.max_width = max_width
        self.shot_url = self._normalize_endpoint(url)

    @staticmethod
    def _normalize_endpoint(url: str) -> str:
        """
        Normalizes Android IP Webcam, DroidCam, and standard MJPEG stream endpoints.
        """
        parsed = urlparse(url)
        clean_base = f"{parsed.scheme}://{parsed.netloc}"
        if parsed.path and parsed.path.endswith((".jpg", ".jpeg")):
            return url
        if "/video" in parsed.path:
            return f"{clean_base}/shot.jpg"
        return f"{url.rstrip('/')}/shot.jpg"

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        if cv2 is None:
            return False, None

        try:
            req = urllib.request.Request(
                self.shot_url,
                headers={"User-Agent": "AERO-GUARD-Vision/2.0"}
            )
            with urllib.request.urlopen(req, timeout=self.timeout_seconds) as response:
                payload = response.read()
                if not payload:
                    return False, None
                
                arr = np.frombuffer(payload, dtype=np.uint8)
                frame = cv2.imdecode(arr, cv2.IMREAD_COLOR)
                if frame is None:
                    return False, None

                # Scale down if exceeds max width while preserving aspect ratio
                h, w = frame.shape[:2]
                if w > self.max_width:
                    new_h = int(h * self.max_width / w)
                    frame = cv2.resize(frame, (self.max_width, new_h), interpolation=cv2.INTER_AREA)

                return True, frame
        except Exception:
            return False, None

    def release(self) -> None:
        pass
