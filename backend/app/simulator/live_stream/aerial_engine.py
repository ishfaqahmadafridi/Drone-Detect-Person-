"""
Aerial Simulation Engine: Handles top-down drone camera drift, terrain rendering, and target telemetry.
"""

import math
from typing import List, Dict, Tuple
import numpy as np

from app.simulator.config import SimulationConfig
from app.simulator.person import SimulatedPerson
from app.simulator.terrain import TerrainRenderer
from app.simulator.osd import TelemetryOsdRenderer
from app.simulator.live_stream.config import LiveStreamConfig


class AerialSimulationEngine:
    """
    Simulates top-down aerial drone surveillance footage and ground-truth telemetry targets.
    """

    def __init__(
        self,
        sim_config: SimulationConfig,
        stream_config: LiveStreamConfig,
        agents: List[SimulatedPerson]
    ):
        self._sim_cfg = sim_config
        self._stream_cfg = stream_config
        self._agents = agents
        self._terrain = TerrainRenderer(self._sim_cfg)

    def calculate_camera_drift(self, frame_idx: int) -> Tuple[int, int]:
        """Calculates natural UAV flight drift offsets using harmonic wave functions."""
        freq = self._stream_cfg.drift_frequency
        drift_x = int(math.sin(frame_idx * freq) * self._stream_cfg.drift_amplitude_x)
        drift_y = int(math.cos(frame_idx * freq) * self._stream_cfg.drift_amplitude_y)
        return drift_x, drift_y

    def render_frame(self, frame_idx: int) -> np.ndarray:
        """
        Renders the aerial UAV perspective frame including procedural terrain and walking pedestrians.
        """
        w, h = self._sim_cfg.width, self._sim_cfg.height
        frame, drift_x, drift_y = self._terrain.render(frame_idx)

        for idx, person in enumerate(self._agents):
            person.update_physics(frame_idx, idx, w, h)
            person.render(frame, drift_x, drift_y)

        TelemetryOsdRenderer.render(frame, frame_idx, 1_000_000)
        return frame

    def build_targets(self, frame_idx: int) -> List[Dict]:
        """
        Generates ground-truth bounding box telemetry enclosing each human body completely.
        """
        drift_x, drift_y = self.calculate_camera_drift(frame_idx)
        half_w = self._stream_cfg.aerial_bbox_half_w
        top_offset = self._stream_cfg.aerial_bbox_top_offset
        bottom_offset = self._stream_cfg.aerial_bbox_bottom_offset
        conf = self._stream_cfg.aerial_confidence
        speed_mult = self._stream_cfg.aerial_speed_multiplier

        targets = []
        for idx, p in enumerate(self._agents):
            px = int(p.x + drift_x)
            py = int(p.y + drift_y)

            # Enclose full body (head at py-20, feet at py+26, arms swinging to px±23)
            x1 = px - half_w
            y1 = py - top_offset
            x2 = px + half_w
            y2 = py + bottom_offset

            targets.append({
                "id": idx + 1,
                "conf": conf,
                "bbox": [x1, y1, x2, y2],
                "center": (px, py + self._stream_cfg.aerial_center_y_offset),
                "foot": (px, py + self._stream_cfg.aerial_foot_y_offset),
                "width": x2 - x1,
                "height": y2 - y1,
                "is_intruder": False,
                "speed_px_s": round(math.hypot(p.vx, p.vy) * speed_mult, 1),
                "trajectory": [[px, py]],
            })
        return targets
