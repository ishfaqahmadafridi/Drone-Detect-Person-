"""
StreamSourceConfig: Configuration tokens for video frame acquisition and simulation fallback.
"""

from dataclasses import dataclass
from app.core.config import (
    SYNTHETIC_VIDEO_PATH, BLOCKED_WEBCAM_DEVICE, STREAM_HTTP_TIMEOUT_SECONDS,
    STREAM_MAX_FRAME_WIDTH, SIMULATION_WIDTH, SIMULATION_HEIGHT,
    SIMULATION_PERSON_COUNT, SIMULATION_INTERVAL_SECONDS,
)


@dataclass
class StreamSourceConfig:
    """Configuration tokens for streaming source acquisition and fallback."""
    default_source_type: str = "synthetic"
    default_path: str = SYNTHETIC_VIDEO_PATH
    webcam_device_id: str = BLOCKED_WEBCAM_DEVICE
    http_timeout_seconds: float = STREAM_HTTP_TIMEOUT_SECONDS
    max_frame_width: int = STREAM_MAX_FRAME_WIDTH
    simulation_width: int = SIMULATION_WIDTH
    simulation_height: int = SIMULATION_HEIGHT
    simulation_num_people: int = SIMULATION_PERSON_COUNT
    simulation_frame_interval: float = SIMULATION_INTERVAL_SECONDS
