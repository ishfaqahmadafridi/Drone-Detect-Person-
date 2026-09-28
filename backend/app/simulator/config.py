"""
Simulation Configuration: Typed parameters, color palettes, and morphology definitions for synthetic simulation.
"""

from dataclasses import dataclass, field
from typing import List, Tuple


@dataclass(frozen=True)
class PedestrianPaletteConfig:
    """
    Standard color palette tokens (BGR) for synthetic pedestrians.
    """
    skin_tone: Tuple[int, int, int] = (160, 180, 210)
    hair: Tuple[int, int, int] = (25, 20, 20)
    shoes: Tuple[int, int, int] = (20, 20, 20)
    shadow: Tuple[int, int, int] = (30, 35, 40)
    default_pants: Tuple[int, int, int] = (60, 50, 45)


@dataclass(frozen=True)
class PedestrianMorphologyConfig:
    """
    Morphological proportions and perspective scaling factors.
    """
    base_height: int = 150
    base_width: int = 44
    head_radius: int = 14
    leg_ratio: float = 0.42
    torso_ratio: float = 0.38
    min_scale: float = 0.65
    depth_scale_range: float = 0.75
    shadow_width_factor: float = 1.2
    shadow_height_base: int = 10
    neck_height_factor: float = 6.0
    hair_height_ratio: float = 0.7


@dataclass(frozen=True)
class PedestrianKinematicsConfig:
    """
    Kinematic velocity limits and procedural animation cycles.
    """
    min_speed: float = 1.8
    max_speed: float = 3.2
    vertical_drift_max: float = 0.3
    gathering_start_frame: int = 60
    gathering_end_frame: int = 280
    gathering_speed: float = 2.2
    walk_cycle_increment: float = 0.22
    stride_amplitude: float = 18.0
    arm_swing_amplitude: float = 14.0


@dataclass
class SimulationConfig:
    width: int = 1280
    height: int = 720
    duration_sec: int = 15
    fps: int = 25
    num_people: int = 4
    output_path: str = "test_drone.mp4"

    # Terrain color palette (BGR)
    color_concrete: Tuple[int, int, int] = (130, 135, 140)
    color_grass: Tuple[int, int, int] = (45, 95, 45)
    color_grid_lines: Tuple[int, int, int] = (160, 165, 170)
    color_restricted_zone: Tuple[int, int, int] = (100, 100, 180)

    # Person shirt colors (BGR)
    shirt_colors: List[Tuple[int, int, int]] = field(default_factory=lambda: [
        (40, 40, 220),   # Red
        (220, 100, 40),  # Blue
        (40, 200, 40),   # Green
        (200, 40, 200),  # Purple
        (30, 200, 230),  # Yellow
        (240, 240, 240), # White
    ])
