"""
Recorder Pipeline: Dispatches live frames to circular pre-roll buffer and video container writer.
"""

from typing import Optional
import numpy as np

from app.services.recording.buffer import PreRollBuffer
from app.services.recording.writer import VideoContainerWriter


class RecorderPipeline:
    """Coordinates frame flow between the circular pre-roll buffer and active video writer."""

    def __init__(self, buffer: PreRollBuffer, writer: VideoContainerWriter):
        self._buffer = buffer
        self._writer = writer

    def dispatch_frame(self, frame: np.ndarray, view_mode: str, is_recording: bool) -> None:
        """Feed rolling buffer and write to disk if an active session is in progress."""
        if frame is None:
            return

        # 1. Circular pre-roll buffer (in-memory)
        self._buffer.append(frame, view_mode)

        # 2. Disk writer container
        if is_recording and self._writer.is_active:
            self._writer.write_frame(frame)

    def flush_preroll_to_writer(self) -> int:
        """Write historical pre-roll frames to the container writer for lead-up context."""
        pre_frames = self._buffer.get_frames()
        for idx, (pre_frame, _) in enumerate(pre_frames):
            self._writer.write_frame(pre_frame, capture_thumbnail=(idx == 0))
        return len(pre_frames)
