"""
Terrain Renderer: Procedural rendering of aerial ground, grass, and restricted zone markings.
"""

import math
from typing import Tuple
import cv2
import numpy as np
from app.simulator.config import SimulationConfig

class TerrainRenderer:
    """
    Renders realistic courtyard pavements, perimeter grass, grid markings, and restricted zone areas.
    """
    def __init__(self, config: SimulationConfig):
        self.config = config
        self.zx1 = int(config.width * 0.25)
        self.zy1 = int(config.height * 0.25)
        self.zx2 = int(config.width * 0.75)
        self.zy2 = int(config.height * 0.75)

    def render(self, frame_idx: int) -> Tuple[np.ndarray, int, int]:
        """
        Renders the base terrain frame and returns (frame, drift_x, drift_y).
        """
        width, height = self.config.width, self.config.height
        frame = np.zeros((height, width, 3), dtype=np.uint8)

        # Concrete courtyard base
        frame[:, :] = self.config.color_concrete

        # Grass border borders
        cv2.rectangle(frame, (0, 0), (width, 60), self.config.color_grass, -1)
        cv2.rectangle(frame, (0, height - 60), (width, height), self.config.color_grass, -1)
        cv2.rectangle(frame, (0, 0), (60, height), self.config.color_grass, -1)
        cv2.rectangle(frame, (width - 60, 0), (width, height), self.config.color_grass, -1)

        # Subtle drone camera drift simulation
        drift_x = int(math.sin(frame_idx * 0.02) * 8)
        drift_y = int(math.cos(frame_idx * 0.02) * 6)

        # Draw grid lines / parking markers
        for gx in range(120, width - 100, 160):
            cv2.line(frame, (gx + drift_x, 80), (gx + drift_x, height - 80), self.config.color_grid_lines, 2)

        return frame, drift_x, drift_y
