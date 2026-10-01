"""
Source Resolver: Acquires and validates CLI video capture sources.
"""

import os
import sys
from typing import Union
import cv2

from app.core.config import SYNTHETIC_VIDEO_PATH
from app.utils.video_utils import create_synthetic_drone_video


class VideoSourceMetadata:
    """
    Encapsulates resolved capture object and stream dimensions.
    """
    def __init__(
        self,
        raw_source: str,
        resolved_source: Union[str, int],
        cap: cv2.VideoCapture,
        width: int,
        height: int,
        fps: float
    ):
        self.raw_source = raw_source
        self.resolved_source = resolved_source
        self.cap = cap
        self.width = width
        self.height = height
        self.fps = fps


def resolve_video_source(source: str) -> VideoSourceMetadata:
    """
    Resolves video source (synthetic procedural simulation, webcam index, local file, or RTSP stream)
    and initializes OpenCV VideoCapture.
    """
    if (
        source == "synthetic"
        or (
            not os.path.exists(source)
            and not source.isdigit()
            and not source.startswith(("rtsp://", "http://", "https://"))
        )
    ):
        if not os.path.exists(SYNTHETIC_VIDEO_PATH):
            print("[INFO] Generating synthetic test video...")
            create_synthetic_drone_video(SYNTHETIC_VIDEO_PATH, duration_sec=30, fps=25)
        video_src: Union[str, int] = SYNTHETIC_VIDEO_PATH
    elif source.isdigit():
        video_src = int(source)
    else:
        video_src = source

    cap = cv2.VideoCapture(video_src)
    if not cap.isOpened():
        print(f"[FATAL] Unable to open video source: {source}")
        sys.exit(1)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1280
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 720
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0

    print(f"[INFO] Video Feed Opened: {width}x{height} @ {fps:.1f} FPS")

    return VideoSourceMetadata(
        raw_source=source,
        resolved_source=video_src,
        cap=cap,
        width=width,
        height=height,
        fps=fps,
    )
