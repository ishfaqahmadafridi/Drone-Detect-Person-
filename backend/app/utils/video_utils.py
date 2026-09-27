"""
Video Utilities: Video validation and synthetic generator proxy.
"""

import os
from typing import Tuple
import cv2
from app.simulator.generator import create_synthetic_drone_video

def validate_video_source(source: str) -> Tuple[bool, str]:
    """
    Validates if the provided video source string exists or is a valid stream URL / index.
    """
    if source.isdigit():
        return True, "webcam"
    if source.startswith(("rtsp://", "http://", "https://")):
        return True, "stream"
    if os.path.exists(source):
        return True, "file"
    return False, "invalid"

__all__ = ["create_synthetic_drone_video", "validate_video_source"]
