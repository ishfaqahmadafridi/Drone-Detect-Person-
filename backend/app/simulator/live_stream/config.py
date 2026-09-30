"""
Live Stream Config: Configuration tokens and simulation parameters for real-time synthetic streaming.
Zero magic numbers — strictly centralized and typed tokens.
"""

from dataclasses import dataclass, field
from typing import Tuple


@dataclass(frozen=True)
class LiveStreamConfig:
    """
    Simulation parameters for aerial UAV and ground CCTV synthetic streaming engines.
    """
    # Detection confidence tokens
    aerial_confidence: float = 0.87
    ground_confidence: float = 0.89

    # Kinematics speed scaling factors
    aerial_speed_multiplier: float = 25.0
    ground_speed_multiplier: float = 25.0

    # Aerial pedestrian full-body bounding box half-extents & offsets (pixels)
    aerial_bbox_half_w: int = 25
    aerial_bbox_top_offset: int = 24
    aerial_bbox_bottom_offset: int = 30
    aerial_center_y_offset: int = 3
    aerial_foot_y_offset: int = 26

    # UAV Camera drift simulation parameters
    drift_frequency: float = 0.02
    drift_amplitude_x: int = 8
    drift_amplitude_y: int = 6

    # Spawning margins & geometry
    spawn_margin_aerial: int = 150
    spawn_margin_ground_x: int = 100
    spawn_ground_base_offset_y: int = 80
    ground_depth_coverage_ratio: float = 0.7
    aerial_person_size_range: Tuple[int, int] = (18, 24)
