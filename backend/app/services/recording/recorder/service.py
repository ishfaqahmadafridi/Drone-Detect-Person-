"""
Video Clip Recorder Service: High-level orchestrator coordinating pre-roll buffer,
container writer, and SQLite persistence.
"""

import threading
from typing import Optional

import numpy as np

from app.core.config import RECORDINGS_DIR, SNAPSHOTS_DIR
from app.schemas.evidence import EvidenceRecord
from app.services.recording.buffer import PreRollBuffer
from app.services.recording.writer import VideoContainerWriter
from app.services.recording.recorder.session import RecordingSession
from app.services.recording.recorder.pipeline import RecorderPipeline
from app.services.recording.recorder.persistence import RecordingFinalizer
from app.services.recording.recorder.clip_worker import ClipCaptureWorker


class VideoClipRecorder:
    """
    Manages real-time video evidence clip capture.

    Orchestrates:
      - Circular in-memory pre-roll buffer (~3s lead-up context).
      - Thread-safe start / stop manual and autonomous clip recording.
      - Disk writing via VideoContainerWriter with HTML5-compliant H.264 container.
      - Automatic indexing into SQLite evidence database.
    """

    def __init__(
        self,
        recordings_dir: str = RECORDINGS_DIR,
        snapshots_dir: str = SNAPSHOTS_DIR,
        fps: float = 25.0,
        pre_roll_seconds: float = 3.0,
    ):
        self.recordings_dir = recordings_dir
        self.snapshots_dir = snapshots_dir
        self.fps = fps

        self._lock = threading.Lock()
        self._buffer = PreRollBuffer(fps=fps, pre_roll_seconds=pre_roll_seconds)
        self._writer = VideoContainerWriter(
            recordings_dir=recordings_dir,
            snapshots_dir=snapshots_dir,
            fps=fps,
        )
        self._session = RecordingSession()
        self._pipeline = RecorderPipeline(buffer=self._buffer, writer=self._writer)

    @property
    def is_recording(self) -> bool:
        with self._lock:
            return self._session.is_recording

    def push_frame(self, frame: np.ndarray, view_mode: str = "aerial") -> None:
        """Feed current processed video frame into the buffer and writer pipeline."""
        with self._lock:
            self._pipeline.dispatch_frame(frame, view_mode, self._session.is_recording)

    def start_recording(
        self,
        view_mode: str = "aerial",
        threat_level: str = "MANUAL",
        width: int = 1280,
        height: int = 720,
    ) -> str:
        """Start recording frames into a new MP4 container with pre-roll lead-up."""
        with self._lock:
            if self._session.is_recording:
                return self._writer.filename or ""

            clean_view = str(view_mode).lower().strip()
            filename = self._writer.open(view_mode=clean_view, width=width, height=height)
            self._session.start(view_mode=clean_view, threat_level=threat_level, filename=filename)

            pre_count = self._pipeline.flush_preroll_to_writer()
            print(f"[RECORDER] Started recording: {filename} with {pre_count} pre-roll frames")
            return filename

    def stop_recording(self) -> Optional[EvidenceRecord]:
        """Finalize video container, extract stats, and commit record to SQLite."""
        with self._lock:
            if not self._session.is_recording or not self._writer.is_active:
                return None

            filename = self._writer.filename
            filepath = self._writer.filepath
            thumbnail_path = self._writer.thumbnail_path
            frame_count = self._writer.frame_count
            resolution = self._writer.resolution
            view_mode = self._session.active_view_mode
            threat_level = self._session.active_threat_level

            duration, file_size_kb = self._writer.close()
            self._session.stop()

        # Finalize and persist evidence record outside lock
        return RecordingFinalizer.commit_evidence_record(
            filename=filename,
            filepath=filepath,
            thumbnail_path=thumbnail_path,
            duration=duration,
            file_size_kb=file_size_kb,
            resolution=resolution,
            fps=self.fps,
            frame_count=frame_count,
            view_mode=view_mode,
            threat_level=threat_level,
        )

    def record_clip(
        self,
        view_mode: str = "aerial",
        threat_level: str = "INTRUSION",
        duration_seconds: float = 4.0,
        width: int = 1280,
        height: int = 720,
    ) -> Optional[EvidenceRecord]:
        """Record fixed-duration evidence clip asynchronously in a background thread."""
        ClipCaptureWorker.spawn_clip_task(
            start_fn=lambda: self.start_recording(
                view_mode=view_mode,
                threat_level=threat_level,
                width=width,
                height=height,
            ),
            stop_fn=lambda: self.stop_recording(),
            duration_seconds=duration_seconds,
        )
        return None
