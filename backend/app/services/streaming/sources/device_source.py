"""Frame source facade for OpenCV webcams, network streams, and video files."""
import time
from typing import Optional, Tuple, Union
import numpy as np

from app.core.config import DEVICE_READ_RETRY_SECONDS, VIDEO_END_BEHAVIOR
from app.services.streaming.sources.base import BaseFrameSource
from app.services.streaming.sources.device.capture import (
    is_rtsp_source, is_video_file, open_capture, release_capture,
)
from app.services.streaming.sources.device.file_playback import FilePlayback


class DeviceFrameSource(BaseFrameSource):
    """Compose capture lifecycle with optional clock-driven file playback."""

    def __init__(self, source_path: Union[str, int], transport: str = "tcp",
                 end_behavior: str = VIDEO_END_BEHAVIOR):
        self.source_path = source_path
        self.transport = "udp" if str(transport).lower() == "udp" else "tcp"
        self.end_behavior = end_behavior
        self._cap = None
        self._is_network_rtsp = is_rtsp_source(source_path)
        self._is_video_file = is_video_file(source_path)
        self._playback = FilePlayback(end_behavior)
        self._open()
        if self._is_video_file and self.is_active:
            self._playback.attach(self._cap)

    def _open(self):
        self.release()
        self._cap = open_capture(self.source_path, self.transport)

    @property
    def is_active(self) -> bool:
        return self._cap is not None and self._cap.isOpened()

    @property
    def finished(self) -> bool:
        return self._playback.finished

    @property
    def playback_epoch(self) -> int:
        return self._playback.epoch

    @property
    def _playback_clock(self):
        return self._playback.clock

    @_playback_clock.setter
    def _playback_clock(self, clock):
        self._playback.clock = clock

    def pause_playback(self):
        self._playback.pause()

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        try:
            if not self.is_active:
                return False, None
            if self._is_video_file:
                ok, frame = self._playback.read_frame(self._cap)
            else:
                ok, frame = self._cap.read()
            if ok and frame is not None:
                return True, frame
        except Exception:
            # The provider owns simulation fallback for unavailable captures.
            pass
        time.sleep(DEVICE_READ_RETRY_SECONDS)
        return False, None

    def release(self) -> None:
        capture, self._cap = self._cap, None
        release_capture(capture)
