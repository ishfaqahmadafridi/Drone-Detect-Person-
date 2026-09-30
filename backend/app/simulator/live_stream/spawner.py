"""
Agent Population Spawner: Procedural instantiation of synthetic aerial and ground pedestrian agents.
"""

import random
from typing import List

from app.simulator.config import SimulationConfig
from app.simulator.person import SimulatedPerson
from app.simulator.ground_person import GroundSimulatedPerson
from app.simulator.live_stream.config import LiveStreamConfig


class AgentPopulationSpawner:
    """
    Spawns procedurally randomized pedestrian agents for aerial and ground simulations.
    """

    def __init__(self, sim_config: SimulationConfig, stream_config: LiveStreamConfig):
        self._sim_cfg = sim_config
        self._stream_cfg = stream_config

    def spawn_aerial_agents(self, width: int, height: int, num_people: int) -> List[SimulatedPerson]:
        """
        Instantiates top-down aerial pedestrian agents within safe viewport boundaries.
        """
        margin = self._stream_cfg.spawn_margin_aerial
        min_size, max_size = self._stream_cfg.aerial_person_size_range
        colors = self._sim_cfg.shirt_colors

        return [
            SimulatedPerson(
                x=random.uniform(margin, max(margin + 1, width - margin)),
                y=random.uniform(margin, max(margin + 1, height - margin)),
                color=colors[i % len(colors)],
                size=random.randint(min_size, max_size),
            )
            for i in range(num_people)
        ]

    def spawn_ground_agents(
        self,
        width: int,
        height: int,
        num_people: int,
        horizon_y: int
    ) -> List[GroundSimulatedPerson]:
        """
        Instantiates eye-level ground CCTV pedestrian agents distributed along the depth plane.
        """
        margin_x = self._stream_cfg.spawn_margin_ground_x
        base_offset_y = self._stream_cfg.spawn_ground_base_offset_y
        depth_ratio = self._stream_cfg.ground_depth_coverage_ratio
        ground_h = height - horizon_y
        colors = self._sim_cfg.shirt_colors

        return [
            GroundSimulatedPerson(
                x=random.uniform(margin_x, max(margin_x + 1, width - margin_x)),
                y=horizon_y + base_offset_y + int(i * (ground_h * depth_ratio) / max(1, num_people)),
                color=colors[i % len(colors)],
            )
            for i in range(num_people)
        ]
