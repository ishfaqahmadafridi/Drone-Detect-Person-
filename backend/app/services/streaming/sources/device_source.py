"""
Hardware & File Stream Source: Acquires frames via OpenCV VideoCapture (webcam, RTSP, mp4).
Handles automatic video looping and hardware handle lifecycle.
"""

import time
from typing import Tuple, Optional, Union
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.services.streaming.sources.base import BaseFrameSource


class DeviceFrameSource(BaseFrameSource):
    """
    Acquires frames from local USB webcams, video files, or RTSP network streams.
    """
    def __init__(self, source_path: Union[str, int], transport: str = "tcp"):
        self.source_path = source_path
        self.transport = "udp" if str(transport).lower() == "udp" else "tcp"
        self._cap: Optional[cv2.VideoCapture] = None
        self._is_network_rtsp = isinstance(source_path, str) and source_path.startswith("rtsp://")
        self._is_video_file = isinstance(source_path, str) and not self._is_network_rtsp and not source_path.isdigit()
        self._open()

    def _open(self):
        if cv2 is None:
            return
        
        cap_arg = int(self.source_path) if isinstance(self.source_path, str) and self.source_path.isdigit() else self.source_path
        try:
            if self._is_network_rtsp:
                import os
                # Configure user-selected transport (tcp or udp) with 5s timeout
                os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = f"rtsp_transport;{self.transport}|timeout;5000000"
                cap = cv2.VideoCapture(cap_arg, cv2.CAP_FFMPEG)
                if cap.isOpened():
                    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                    self._cap = cap
                else:
                    self._cap = None
            else:
                cap = cv2.VideoCapture(cap_arg)
                if cap.isOpened():
                    self._cap = cap
                else:
                    self._cap = None
        except Exception:
            self._cap = None

    @property
    def is_active(self) -> bool:
        return self._cap is not None and self._cap.isOpened()

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        if self._cap is None or not self._cap.isOpened():
            return False, None

        ret, frame = self._cap.read()
        if not ret:
            # Auto-loop video files indefinitely for surveillance simulation
            if self._is_video_file:
                self._cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                ret, frame = self._cap.read()
            if not ret:
                time.sleep(0.04)
                return False, None

        return True, frame

    def release(self) -> None:
        if self._cap is not None:
            try:
                self._cap.release()
            except Exception:
                pass
            self._cap = None
