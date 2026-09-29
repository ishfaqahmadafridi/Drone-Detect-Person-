"""
Video Recording Subsystem: Frame Buffers, Container Writers, and Clip Orchestration.
"""

from app.services.recording.buffer import PreRollBuffer
from app.services.recording.writer import (
    VideoCodecNegotiator,
    CompanionThumbnailGenerator,
    VideoContainerWriter,
)
from app.services.recording.recorder import (
    RecordingSession,
    ClipCaptureWorker,
    RecordingFinalizer,
    RecorderPipeline,
    VideoClipRecorder,
)
from app.services.recording.video_recorder import video_recorder

__all__ = [
    "PreRollBuffer",
    "VideoCodecNegotiator",
    "CompanionThumbnailGenerator",
    "VideoContainerWriter",
    "RecordingSession",
    "ClipCaptureWorker",
    "RecordingFinalizer",
    "RecorderPipeline",
    "VideoClipRecorder",
    "video_recorder",
]
