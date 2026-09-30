"""
Ground Simulation Engine: Handles eye-level perimeter CCTV rendering, depth sorting, and target telemetry.
"""

from typing import List, Dict
import numpy as np

from app.simulator.config import SimulationConfig
from app.simulator.ground_renderer import GroundCctvRenderer
from app.simulator.ground_person import GroundSimulatedPerson
from app.simulator.live_stream.config import LiveStreamConfig


class GroundSimulationEngine:
    """
    Simulates eye-level perimeter CCTV surveillance footage with perspective depth sorting.
    """

    def __init__(
        self,
        sim_config: SimulationConfig,
        stream_config: LiveStreamConfig,
        agents: List[GroundSimulatedPerson]
    ):
        self._sim_cfg = sim_config
        self._stream_cfg = stream_config
        self._agents = agents
        self._ground_renderer = GroundCctvRenderer(self._sim_cfg)

    @property
    def horizon_y(self) -> int:
        return self._ground_renderer.horizon_y

    def render_frame(self, frame_idx: int) -> np.ndarray:
        """
        Renders eye-level CCTV perspective frame with depth-sorted pedestrian layering.
        """
        w, h = self._sim_cfg.width, self._sim_cfg.height
        frame, horizon_y = self._ground_renderer.render(frame_idx)

        # Depth-sort pedestrians by Y-axis position for accurate occlusion
        for idx, person in enumerate(sorted(self._agents, key=lambda p: p.y)):
            person.update_physics(frame_idx, idx, w, h, horizon_y)
            person.render(frame, horizon_y)

        return frame

    def build_targets(self) -> List[Dict]:
        """
        Generates ground-truth telemetry targets using perspective-scaled bounding boxes.
        """
        h_frame = self._sim_cfg.height
        horizon_y = self._ground_renderer.horizon_y
        conf = self._stream_cfg.ground_confidence
        speed_mult = self._stream_cfg.ground_speed_multiplier

        targets = []
        for idx, p in enumerate(self._agents):
            x1, y1, x2, y2, _ = p.get_bbox(horizon_y, h_frame)
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)

            targets.append({
                "id": idx + 1,
                "conf": conf,
                "bbox": [x1, y1, x2, y2],
                "center": (cx, cy),
                "foot": (cx, y2),
                "width": x2 - x1,
                "height": y2 - y1,
                "is_intruder": False,
                "speed_px_s": round(abs(p.vx) * speed_mult, 1),
                "trajectory": [[int(p.x), int(p.y)]],
            })
        return targets
