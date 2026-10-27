"""
Coordinator Configuration: Operational thresholds and pacing parameters for video streaming.
"""

from dataclasses import dataclass
from app.core.config import STREAM_JPEG_QUALITY, STREAM_RETRY_SECONDS, STREAM_THROTTLE_SECONDS


@dataclass
class CoordinatorConfig:
    """
    Operational thresholds and pacing for the stream broadcast loop.
    """
    jpeg_quality: int = STREAM_JPEG_QUALITY
    no_frame_retry_sleep_seconds: float = STREAM_RETRY_SECONDS
    frame_rate_throttle_seconds: float = STREAM_THROTTLE_SECONDS
