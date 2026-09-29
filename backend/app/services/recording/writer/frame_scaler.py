"""
Frame Scaler: Ensures incoming frames conform strictly to target video container resolution.
"""

from typing import Tuple
import cv2
import numpy as np


class FrameScaler:
    """
    Validates and dynamically resizes video frames to match target container dimensions.
    """

    @staticmethod
    def scale_to_resolution(frame: np.ndarray, target_resolution: Tuple[int, int]) -> np.ndarray:
        """
        Check if frame dimensions (width, height) match target resolution;
        resize with OpenCV interpolation if dimensions differ.
        """
        if frame is None:
            return frame

        target_width, target_height = target_resolution
        current_height, current_width = frame.shape[:2]

        if (current_width, current_height) != (target_width, target_height):
            return cv2.resize(frame, (target_width, target_height), interpolation=cv2.INTER_LINEAR)

        return frame
