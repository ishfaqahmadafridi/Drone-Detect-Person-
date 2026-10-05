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
from app.services.streaming.sources.playback_clock import VideoPlaybackClock
from app.core.config import VIDEO_END_BEHAVIOR


class DeviceFrameSource(BaseFrameSource):
    """
    Acquires frames from local USB webcams, video files, or RTSP network streams.
    """
    def __init__(self, source_path: Union[str, int], transport: str = "tcp", end_behavior: str = VIDEO_END_BEHAVIOR):
        self.source_path = source_path
        self.transport = "udp" if str(transport).lower() == "udp" else "tcp"
        self._cap: Optional[cv2.VideoCapture] = None
        self._is_network_rtsp = isinstance(source_path, str) and source_path.startswith("rtsp://")
        self._is_video_file = (isinstance(source_path, str) and
                               not source_path.startswith(("rtsp://", "rtsps://", "http://", "https://")) and
                               not source_path.isdigit())
        self._playback_clock = None
        self.playback_epoch = 0
        self._clock_cycle = 0
        self.end_behavior = end_behavior
        if end_behavior not in {"hold", "loop"}:
            raise ValueError("Video end behavior must be hold or loop")
        self.finished = False
        self._last_frame = None
        self._open()
        if self._is_video_file and self.is_active:
            self._playback_clock = VideoPlaybackClock(self._cap.get(cv2.CAP_PROP_FPS), self._cap.get(cv2.CAP_PROP_FRAME_COUNT))

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

    def pause_playback(self):
        if self._playback_clock is not None:
            self._playback_clock.pause()

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        if self._cap is None or not self._cap.isOpened():
            return False, None
        if self.finished:
            return self._last_frame is not None, self._last_frame

        if self._playback_clock is not None:
            target_index = self._playback_clock.next_index()
            if self.end_behavior == "hold":
                target_index = min(self._playback_clock.last_index, self._playback_clock.frame_count - 1)
            cycle = self._playback_clock.last_index // self._playback_clock.frame_count
            if self.end_behavior == "loop" and cycle != self._clock_cycle:
                self.playback_epoch += 1
                self._clock_cycle = cycle
            current_index = int(self._cap.get(cv2.CAP_PROP_POS_FRAMES))
            if target_index < current_index:
                self._cap.set(cv2.CAP_PROP_POS_FRAMES, target_index)
            else:
                for _ in range(target_index - current_index):
                    if not self._cap.grab():
                        break
        ret, frame = self._cap.read()
        if not ret:
            # Auto-loop video files indefinitely for surveillance simulation
            if self._is_video_file:
                if self.end_behavior == "hold" and self._last_frame is not None:
                    self.finished = True
                    return True, self._last_frame
                else:
                    self.playback_epoch += 1
                    self._cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    ret, frame = self._cap.read()
            if not ret:
                time.sleep(0.04)
                return False, None

        if self._is_video_file:
            self._last_frame = frame
            if self.end_behavior == "hold" and self._playback_clock is not None:
                self.finished = self._playback_clock.last_index >= self._playback_clock.frame_count - 1
        return True, frame

    def release(self) -> None:
        if self._cap is not None:
            try:
                self._cap.release()
            except Exception:
                pass
            self._cap = None
