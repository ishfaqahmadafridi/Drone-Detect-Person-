"""
LiveSimulationStream: Real-time in-memory synthetic frame generator.

Produces frames for both perspectives:
  - aerial: Top-down UAV drone simulation (TerrainRenderer + SimulatedPerson).
  - ground: Eye-level perimeter CCTV simulation (GroundCctvRenderer + GroundSimulatedPerson).

Zero disk dependency. Zero codec requirement. Designed to be the primary simulation
frame source for StreamSourceProvider's SyntheticFrameSource.
"""

import math
import random
from typing import List, Tuple

import numpy as np

from app.simulator.config import SimulationConfig
from app.simulator.person import SimulatedPerson
from app.simulator.terrain import TerrainRenderer
from app.simulator.osd import TelemetryOsdRenderer
from app.simulator.ground_renderer import GroundCctvRenderer
from app.simulator.ground_person import GroundSimulatedPerson


# Confidence tokens — not magic numbers
_AERIAL_SIM_CONF: float = 0.87
_GROUND_SIM_CONF: float = 0.89
_AERIAL_PERSON_SPEED_FPS: float = 25.0
_GROUND_PERSON_SPEED_FPS: float = 25.0

# Aerial person bounding-box half-extents (pixels) — top-down overhead perspective
_AERIAL_BBOX_HALF_W: int = 24
_AERIAL_BBOX_HALF_H: int = 34

# Camera drift simulation parameters
_DRIFT_SIN_FREQ: float = 0.02
_DRIFT_SIN_AMP_X: int = 8
_DRIFT_COS_AMP_Y: int = 6


class LiveSimulationStream:
    """
    Direct in-memory frame generator for real-time synthetic surveillance simulation.

    Manages two independent agent populations (aerial top-down + ground eye-level)
    and switches between them without restarting the frame counter.

    Args:
        width: Frame width in pixels.
        height: Frame height in pixels.
        num_people: Number of synthetic agents per perspective.
        view_mode: Initial rendering perspective ('aerial' | 'ground').
    """

    _VALID_MODES = frozenset({"aerial", "ground"})

    def __init__(
        self,
        width: int = 1280,
        height: int = 720,
        num_people: int = 4,
        view_mode: str = "aerial",
    ) -> None:
        self.config = SimulationConfig(width=width, height=height, num_people=num_people)
        self.view_mode = view_mode if view_mode in self._VALID_MODES else "aerial"
        self.frame_idx: int = 0

        self._terrain = TerrainRenderer(self.config)
        self._aerial_people: List[SimulatedPerson] = self._spawn_aerial_agents(width, height, num_people)

        self._ground_renderer = GroundCctvRenderer(self.config)
        self._ground_people: List[GroundSimulatedPerson] = self._spawn_ground_agents(width, height, num_people)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def set_view_mode(self, mode: str) -> str:
        """Switch perspective between 'aerial' and 'ground'. Returns active mode."""
        self.view_mode = mode.lower().strip() if mode.lower().strip() in self._VALID_MODES else "aerial"
        return self.view_mode

    def read_frame(self) -> Tuple[bool, np.ndarray]:
        """Produce and return the next synthetic frame for the active view mode."""
        frame = self._render_ground() if self.view_mode == "ground" else self._render_aerial()
        self.frame_idx += 1
        return True, frame

    def get_simulated_targets(self) -> List[dict]:
        """Ground-truth bounding boxes and kinematic metadata for both perspectives."""
        if self.view_mode == "ground":
            return self._build_ground_targets()
        return self._build_aerial_targets()

    # ------------------------------------------------------------------
    # Perspective-specific rendering
    # ------------------------------------------------------------------

    def _render_ground(self) -> np.ndarray:
        cfg = self.config
        frame, horizon_y = self._ground_renderer.render(self.frame_idx)
        for idx, person in enumerate(sorted(self._ground_people, key=lambda p: p.y)):
            person.update_physics(self.frame_idx, idx, cfg.width, cfg.height, horizon_y)
            person.render(frame, horizon_y)
        return frame

    def _render_aerial(self) -> np.ndarray:
        cfg = self.config
        frame, drift_x, drift_y = self._terrain.render(self.frame_idx)
        for idx, person in enumerate(self._aerial_people):
            person.update_physics(self.frame_idx, idx, cfg.width, cfg.height)
            person.render(frame, drift_x, drift_y)
        TelemetryOsdRenderer.render(frame, self.frame_idx, 1_000_000)
        return frame

    # ------------------------------------------------------------------
    # Target builders (ground-truth telemetry)
    # ------------------------------------------------------------------

    def _build_ground_targets(self) -> List[dict]:
        h_frame = self.config.height
        horizon_y = self._ground_renderer.horizon_y
        targets = []
        for idx, p in enumerate(self._ground_people):
            x1, y1, x2, y2, _ = p.get_bbox(horizon_y, h_frame)
            targets.append({
                "id": idx + 1,
                "conf": _GROUND_SIM_CONF,
                "bbox": [x1, y1, x2, y2],
                "center": (int((x1 + x2) / 2), int((y1 + y2) / 2)),
                "foot": (int((x1 + x2) / 2), y2),
                "width": x2 - x1,
                "height": y2 - y1,
                "is_intruder": False,
                "speed_px_s": round(abs(p.vx) * _GROUND_PERSON_SPEED_FPS, 1),
                "trajectory": [[int(p.x), int(p.y)]],
            })
        return targets

    def _build_aerial_targets(self) -> List[dict]:
        drift_x = int(math.sin(self.frame_idx * _DRIFT_SIN_FREQ) * _DRIFT_SIN_AMP_X)
        drift_y = int(math.cos(self.frame_idx * _DRIFT_SIN_FREQ) * _DRIFT_COS_AMP_Y)
        targets = []
        for idx, p in enumerate(self._aerial_people):
            px = int(p.x + drift_x)
            py = int(p.y + drift_y)
            x1 = px - _AERIAL_BBOX_HALF_W
            y1 = py - _AERIAL_BBOX_HALF_H
            x2 = px + _AERIAL_BBOX_HALF_W
            y2 = py + _AERIAL_BBOX_HALF_H
            targets.append({
                "id": idx + 1,
                "conf": _AERIAL_SIM_CONF,
                "bbox": [x1, y1, x2, y2],
                "center": (px, py),
                "foot": (px, y2),
                "width": x2 - x1,
                "height": y2 - y1,
                "is_intruder": False,
                "speed_px_s": round(math.hypot(p.vx, p.vy) * _AERIAL_PERSON_SPEED_FPS, 1),
                "trajectory": [[px, py]],
            })
        return targets

    # ------------------------------------------------------------------
    # Agent spawning helpers
    # ------------------------------------------------------------------

    def _spawn_aerial_agents(self, width: int, height: int, num_people: int) -> List[SimulatedPerson]:
        return [
            SimulatedPerson(
                x=random.uniform(150, width - 150),
                y=random.uniform(150, height - 150),
                color=self.config.shirt_colors[i % len(self.config.shirt_colors)],
                size=random.randint(18, 24),
            )
            for i in range(num_people)
        ]

    def _spawn_ground_agents(self, width: int, height: int, num_people: int) -> List[GroundSimulatedPerson]:
        horizon_y = self._ground_renderer.horizon_y
        ground_h = height - horizon_y
        return [
            GroundSimulatedPerson(
                x=random.uniform(100, width - 100),
                y=horizon_y + 80 + int(i * (ground_h * 0.7) / max(1, num_people)),
                color=self.config.shirt_colors[i % len(self.config.shirt_colors)],
            )
            for i in range(num_people)
        ]
