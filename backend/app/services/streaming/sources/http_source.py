"""
HTTP Stream Source: Acquires frames from network endpoints, IP webcams, and mobile phones.
Uses urllib with configurable timeouts, URL normalization, and downsampling.
"""

import urllib.request
from typing import Tuple, Optional
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.services.streaming.sources.base import BaseFrameSource
from app.services.streaming.sources.http.endpoint_normalizer import HttpEndpointNormalizer
from app.services.streaming.sources.http.frame_decoder import HttpFrameDecoder


class HttpFrameSource(BaseFrameSource):
    """
    Acquires frames over HTTP/HTTPS from smartphone IP cameras and remote webcams.
    Supports Basic Authentication and multiple endpoint paths (/shot.jpg, /video, etc.).
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
        self.shot_url = HttpEndpointNormalizer.normalize_snapshot_url(url)
        self._auth_header = HttpEndpointNormalizer.extract_auth_header(url)
        self._video_cap: Optional[cv2.VideoCapture] = None

    @staticmethod
    def _extract_auth_header(url: str) -> Optional[str]:
        """Backward compatibility static method."""
        return HttpEndpointNormalizer.extract_auth_header(url)

    @staticmethod
    def _normalize_endpoint(url: str) -> str:
        """Backward compatibility static method."""
        return HttpEndpointNormalizer.normalize_snapshot_url(url)

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        if cv2 is None:
            return False, None

        # 1. Primary path: Fetch snapshot from normalized /shot.jpg endpoint
        try:
            headers = {"User-Agent": "AERO-GUARD-Vision/2.0"}
            if self._auth_header:
                headers["Authorization"] = self._auth_header

            req = urllib.request.Request(self.shot_url, headers=headers)
            with urllib.request.urlopen(req, timeout=self.timeout_seconds) as response:
                payload = response.read()
                if payload:
                    frame = HttpFrameDecoder.decode_bytes(payload)
                    if frame is not None:
                        return True, HttpFrameDecoder.resize_max_width(frame, self.max_width)
        except Exception:
            pass

        # 2. Secondary fallback: Stream via cv2.VideoCapture on raw URL
        try:
            if self._video_cap is None or not self._video_cap.isOpened():
                self._video_cap = cv2.VideoCapture(self.raw_url)

            if self._video_cap and self._video_cap.isOpened():
                ret, frame = self._video_cap.read()
                if ret and frame is not None:
                    return True, HttpFrameDecoder.resize_max_width(frame, self.max_width)
        except Exception:
            pass

        return False, None

    def release(self) -> None:
        if self._video_cap is not None:
            try:
                self._video_cap.release()
            except Exception:
                pass
            self._video_cap = None
