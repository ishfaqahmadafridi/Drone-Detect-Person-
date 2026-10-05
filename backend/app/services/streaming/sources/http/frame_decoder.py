"""
HTTP Frame Decoder: Decodes binary frame payloads and handles image scaling.
"""

from typing import Optional
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None


class HttpFrameDecoder:
    """
    Decodes binary image bytes into OpenCV BGR numpy arrays and downscales large resolution frames.
    """

    @staticmethod
    def decode_bytes(payload: bytes) -> Optional[np.ndarray]:
        """Decodes raw JPEG / PNG image bytes to an OpenCV image array."""
        if cv2 is None or not payload:
            return None
        try:
            arr = np.frombuffer(payload, dtype=np.uint8)
            return cv2.imdecode(arr, cv2.IMREAD_COLOR)
        except Exception:
            return None

    @staticmethod
    def resize_max_width(frame: np.ndarray, max_width: int = 1280) -> np.ndarray:
        """Resizes the frame preserving aspect ratio if the width exceeds max_width."""
        if cv2 is None or frame is None:
            return frame

        h, w = frame.shape[:2]
        if w > max_width:
            new_h = int(h * max_width / w)
            return cv2.resize(frame, (max_width, new_h), interpolation=cv2.INTER_AREA)
        return frame
