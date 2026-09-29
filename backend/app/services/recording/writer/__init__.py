"""
Video Container Writer Subsystem: Codecs, Thumbnails, Path Resolvers, Scalers, Metrics, and Container Writers.
"""

from app.services.recording.writer.codec import VideoCodecNegotiator
from app.services.recording.writer.thumbnail import CompanionThumbnailGenerator
from app.services.recording.writer.path_resolver import VideoFilePathResolver
from app.services.recording.writer.frame_scaler import FrameScaler
from app.services.recording.writer.metrics import RecordingMetricsCalculator
from app.services.recording.writer.container import VideoContainerWriter

__all__ = [
    "VideoCodecNegotiator",
    "CompanionThumbnailGenerator",
    "VideoFilePathResolver",
    "FrameScaler",
    "RecordingMetricsCalculator",
    "VideoContainerWriter",
]
