"""
Frame Normalizer Stage: Validates frame buffer integrity and normalizes color channels.
"""

from typing import Optional, Tuple
import numpy as np
from app.core.config import PREVIEW_MAX_EDGE


class FrameNormalizer:
    """
    Guards the vision pipeline against invalid frame buffers and converts 2D grayscale to 3-channel BGR.
    """

    @staticmethod
    def validate_and_normalize(frame: np.ndarray) -> Tuple[bool, Optional[np.ndarray], int, int]:
        """
        Returns (is_valid, normalized_frame, height, width).
        """
        if (
            frame is None
            or not isinstance(frame, np.ndarray)
            or getattr(frame, "size", 0) == 0
            or len(frame.shape) < 2
        ):
            return False, None, 0, 0

        # Standardize 2D grayscale frames to 3-channel BGR for uniform inference & HUD annotation
        if len(frame.shape) == 2:
            import cv2
            frame = cv2.cvtColor(frame, cv2.COLOR_GRAY2BGR)

        h, w = frame.shape[:2]
        if max(h, w) > PREVIEW_MAX_EDGE:
            import cv2
            scale = PREVIEW_MAX_EDGE / max(h, w)
            frame = cv2.resize(frame, (round(w * scale), round(h * scale)), interpolation=cv2.INTER_AREA)
            h, w = frame.shape[:2]
        return True, frame, h, w
