"""
StreamSourceConfig: Configuration tokens for video frame acquisition and simulation fallback.
"""

from dataclasses import dataclass
from app.core.config import SYNTHETIC_VIDEO_PATH


@dataclass
class StreamSourceConfig:
    """Configuration tokens for streaming source acquisition and fallback."""
    default_source_type: str = "synthetic"
    default_path: str = SYNTHETIC_VIDEO_PATH
    webcam_device_id: str = "0"
    http_timeout_seconds: float = 2.5
    max_frame_width: int = 1280
    simulation_width: int = 1280
    simulation_height: int = 720
    simulation_num_people: int = 4
    simulation_frame_interval: float = 0.035
