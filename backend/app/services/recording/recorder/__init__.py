"""
Video Clip Recorder Subsystem: Session State, Async Clip Workers, Frame Pipeline, and Video Orchestration.
"""

from app.services.recording.recorder.session import RecordingSession
from app.services.recording.recorder.clip_worker import ClipCaptureWorker
from app.services.recording.recorder.persistence import RecordingFinalizer
from app.services.recording.recorder.pipeline import RecorderPipeline
from app.services.recording.recorder.service import VideoClipRecorder

__all__ = [
    "RecordingSession",
    "ClipCaptureWorker",
    "RecordingFinalizer",
    "RecorderPipeline",
    "VideoClipRecorder",
]
