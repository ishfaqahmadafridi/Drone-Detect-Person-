"""
Video Container Writer: Facade coordinating path resolution, codec negotiation,
frame scaling, thumbnail creation, and metric calculation.
"""

import time
from typing import Optional, Tuple
import cv2
import numpy as np

from app.services.recording.writer.codec import VideoCodecNegotiator
from app.services.recording.writer.thumbnail import CompanionThumbnailGenerator
from app.services.recording.writer.path_resolver import VideoFilePathResolver
from app.services.recording.writer.frame_scaler import FrameScaler
from app.services.recording.writer.metrics import RecordingMetricsCalculator


class VideoContainerWriter:
    """
    Manages OpenCV VideoWriter lifecycle, frame encoding, companion thumbnail creation,
    and container finalization.
    """

    def __init__(
        self,
        recordings_dir: str,
        snapshots_dir: str,
        fps: float = 25.0,
    ):
        self.recordings_dir = recordings_dir
        self.snapshots_dir = snapshots_dir
        self.fps = fps
        self._thumbnail_generator = CompanionThumbnailGenerator(snapshots_dir)

        self._writer: Optional[cv2.VideoWriter] = None
        self._filename: Optional[str] = None
        self._filepath: Optional[str] = None
        self._thumbnail_path: Optional[str] = None
        self._resolution: Tuple[int, int] = (1280, 720)
        self._frame_count: int = 0
        self._start_time: float = 0.0

    @property
    def is_active(self) -> bool:
        return self._writer is not None

    @property
    def filename(self) -> Optional[str]:
        return self._filename

    @property
    def filepath(self) -> Optional[str]:
        return self._filepath

    @property
    def thumbnail_path(self) -> Optional[str]:
        return self._thumbnail_path

    @property
    def frame_count(self) -> int:
        return self._frame_count

    @property
    def resolution(self) -> Tuple[int, int]:
        return self._resolution

    def open(
        self,
        view_mode: str = "aerial",
        width: int = 1280,
        height: int = 720,
    ) -> str:
        """Initialize an MP4 container and prepare for writing."""
        filename, filepath = VideoFilePathResolver.resolve_recording_path(
            self.recordings_dir, view_mode
        )
        resolution = (width, height)
        writer, _ = VideoCodecNegotiator.create_writer(filepath, self.fps, resolution)

        self._writer = writer
        self._filename = filename
        self._filepath = filepath
        self._thumbnail_path = None
        self._resolution = resolution
        self._frame_count = 0
        self._start_time = time.time()

        return filename

    def write_frame(self, frame: np.ndarray, capture_thumbnail: bool = False) -> bool:
        """Write frame to active container, scaling dimensions if necessary."""
        if self._writer is None or frame is None:
            return False

        try:
            frame_to_write = FrameScaler.scale_to_resolution(frame, self._resolution)
            self._writer.write(frame_to_write)
            self._frame_count += 1

            if capture_thumbnail or self._thumbnail_path is None:
                view_mode = "aerial" if "_aerial_" in (self._filename or "") else "ground"
                thumb = self._thumbnail_generator.generate(frame_to_write, view_mode)
                if thumb:
                    self._thumbnail_path = thumb

            return True
        except Exception as exc:
            print(f"[CONTAINER_WRITER] Frame write failed: {exc}")
            return False

    def close(self) -> Tuple[float, float]:
        """Finalize container, release OpenCV writer, and return (duration_sec, size_kb)."""
        if self._writer is not None:
            self._writer.release()
            self._writer = None

        return RecordingMetricsCalculator.calculate(self._start_time, self._filepath)
