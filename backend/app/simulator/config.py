"""
Simulation Configuration: Typed parameters and color palettes for synthetic drone aerial generation.
"""

from dataclasses import dataclass, field
from typing import List, Tuple

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
