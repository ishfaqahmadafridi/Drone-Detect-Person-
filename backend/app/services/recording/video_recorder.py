"""
VideoClipRecorder: Threat-triggered and manual video evidence recording engine.
Produces compressed .mp4 evidentiary video clips and indexes them directly into SQLite.
"""

import os
import time
import threading
from collections import deque
from datetime import datetime
from typing import Optional, Tuple, Any

import cv2
import numpy as np

from app.core.config import RECORDINGS_DIR, SNAPSHOTS_DIR
from app.db import evidence_repository, EvidenceRecordCreate, EvidenceRecord


class VideoClipRecorder:
    """
    Manages real-time video evidence clip capture.

    Features:
      - Circular in-memory pre-roll buffer (~3 seconds at 25 fps).
      - Thread-safe start / stop manual recording.
      - Automatic indexing into SQLite evidence database.
      - Generates companion JPEG thumbnail for video preview.
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
        self.max_buffer_len = int(fps * pre_roll_seconds)

        self._lock = threading.Lock()
        self._frame_buffer: deque = deque(maxlen=self.max_buffer_len)

        # Active manual recording state
        self._is_recording = False
        self._writer: Optional[cv2.VideoWriter] = None
        self._active_filename: Optional[str] = None
        self._active_filepath: Optional[str] = None
        self._active_thumbnail_path: Optional[str] = None
        self._active_view_mode: str = "aerial"
        self._active_threat_level: str = "MANUAL"
        self._record_start_time: float = 0.0
        self._frame_count: int = 0
        self._resolution: Tuple[int, int] = (1280, 720)

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def is_recording(self) -> bool:
        with self._lock:
            return self._is_recording

    # ------------------------------------------------------------------
    # Frame Ingestion
    # ------------------------------------------------------------------

    def push_frame(self, frame: np.ndarray, view_mode: str = "aerial") -> None:
        """Feed current processed video frame into the recorder."""
        if frame is None:
            return

        with self._lock:
            # Store in pre-roll circular buffer
            self._frame_buffer.append((frame.copy(), view_mode))

            # If actively recording to an MP4 container, write frame
            if self._is_recording and self._writer is not None:
                try:
                    self._writer.write(frame)
                    self._frame_count += 1
                except Exception as exc:
                    print(f"[RECORDER] Write frame error: {exc}")

    # ------------------------------------------------------------------
    # Manual Recording Lifecycle
    # ------------------------------------------------------------------

    def start_recording(
        self,
        view_mode: str = "aerial",
        threat_level: str = "MANUAL",
        width: int = 1280,
        height: int = 720,
    ) -> str:
        """Start recording frames into a new MP4 container."""
        with self._lock:
            if self._is_recording:
                return self._active_filename or ""

            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            clean_view = str(view_mode).lower().strip()
            filename = f"video_{clean_view}_{timestamp_str}.mp4"
            filepath = os.path.join(self.recordings_dir, filename)

            # Set up video writer (using mp4v codec for broad compatibility)
            fourcc = cv2.VideoWriter_fourcc(*"mp4v")
            writer = cv2.VideoWriter(filepath, fourcc, self.fps, (width, height))

            if not writer.isOpened():
                # Fallback to avc1 or MJPG
                fourcc = cv2.VideoWriter_fourcc(*"MJPG")
                writer = cv2.VideoWriter(filepath, fourcc, self.fps, (width, height))

            self._writer = writer
            self._is_recording = True
            self._active_filename = filename
            self._active_filepath = filepath
            self._active_view_mode = clean_view
            self._active_threat_level = threat_level
            self._record_start_time = time.time()
            self._frame_count = 0
            self._resolution = (width, height)

            # Write pre-roll buffer frames for immediate context
            if self._frame_buffer:
                for pre_frame, _ in list(self._frame_buffer):
                    try:
                        self._writer.write(pre_frame)
                        self._frame_count += 1
                    except Exception:
                        pass

                # Save companion thumbnail from the first frame
                first_frame = self._frame_buffer[0][0]
                thumb_filename = f"thumb_{clean_view}_{timestamp_str}.jpg"
                thumb_filepath = os.path.join(self.snapshots_dir, thumb_filename)
                try:
                    cv2.imwrite(thumb_filepath, first_frame)
                    self._active_thumbnail_path = thumb_filepath
                except Exception:
                    self._active_thumbnail_path = None

            print(f"[RECORDER] Started video recording: {filename}")
            return filename

    def stop_recording(self) -> Optional[EvidenceRecord]:
        """Finalize video container, compute duration and size, and commit to SQLite."""
        with self._lock:
            if not self._is_recording or self._writer is None:
                return None

            self._writer.release()
            self._writer = None
            self._is_recording = False

            duration = max(0.1, time.time() - self._record_start_time)
            filepath = self._active_filepath
            filename = self._active_filename
            view_mode = self._active_view_mode
            threat_level = self._active_threat_level
            width, height = self._resolution

            if not filepath or not os.path.exists(filepath):
                return None

            file_size_kb = round(os.path.getsize(filepath) / 1024, 1)
            thumb_url = None
            if self._active_thumbnail_path and os.path.exists(self._active_thumbnail_path):
                thumb_url = f"/snapshots/{os.path.basename(self._active_thumbnail_path)}"

            created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            dto = EvidenceRecordCreate(
                media_type="video",
                filename=filename,
                file_path=filepath,
                url=f"/recordings/{filename}",
                thumbnail_url=thumb_url,
                view_mode=view_mode,
                threat_level=threat_level,
                threat_type="MANUAL RECORDING" if threat_level == "MANUAL" else "EVIDENTIARY VIDEO CLIP",
                duration_seconds=round(duration, 1),
                file_size_kb=file_size_kb,
                width=width,
                height=height,
                fps=self.fps,
                created_at=created_at,
                metadata_json={"frames_recorded": self._frame_count},
            )

        # Commit to persistent SQLite database outside lock
        record = evidence_repository.insert(dto)
        print(f"[RECORDER] Video finalized & committed to database: {filename} ({file_size_kb} KB, {duration:.1f}s)")
        return record

    def record_clip(
        self,
        view_mode: str = "aerial",
        threat_level: str = "INTRUSION",
        duration_seconds: float = 4.0,
        width: int = 1280,
        height: int = 720,
    ) -> Optional[EvidenceRecord]:
        """
        Record a fixed-duration evidence video clip asynchronously in a background thread
        using the circular pre-roll buffer and incoming frames.
        """
        def _clip_worker():
            self.start_recording(
                view_mode=view_mode,
                threat_level=threat_level,
                width=width,
                height=height,
            )
            time.sleep(duration_seconds)
            self.stop_recording()

        thread = threading.Thread(target=_clip_worker, daemon=True)
        thread.start()
        return None


video_recorder = VideoClipRecorder()
