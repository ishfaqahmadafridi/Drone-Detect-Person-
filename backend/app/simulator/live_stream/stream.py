"""
Live Simulation Stream: High-level coordinator for multi-perspective procedural synthetic video feeds.
"""

from typing import List, Tuple, Dict, Optional
import numpy as np

from app.simulator.config import SimulationConfig
from app.simulator.live_stream.config import LiveStreamConfig
from app.simulator.live_stream.spawner import AgentPopulationSpawner
from app.simulator.live_stream.aerial_engine import AerialSimulationEngine
from app.simulator.live_stream.ground_engine import GroundSimulationEngine


class LiveSimulationStream:
    """
    Direct in-memory frame generator for real-time synthetic surveillance simulation.
    Composes dedicated aerial and ground simulation engines with shared population management.
    """

    _VALID_MODES = frozenset({"aerial", "ground"})

    def __init__(
        self,
        width: int = 1280,
        height: int = 720,
        num_people: int = 4,
        view_mode: str = "aerial",
        stream_config: Optional[LiveStreamConfig] = None
    ) -> None:
        self.config = SimulationConfig(width=width, height=height, num_people=num_people)
        self.stream_config = stream_config or LiveStreamConfig()
        self.view_mode = view_mode if view_mode in self._VALID_MODES else "aerial"
        self.frame_idx: int = 0

        # Spawner
        spawner = AgentPopulationSpawner(self.config, self.stream_config)

        # Ground engine & population
        ground_agents = spawner.spawn_ground_agents(
            width=width,
            height=height,
            num_people=num_people,
            horizon_y=int(height * 0.33)
        )
        self._ground_engine = GroundSimulationEngine(self.config, self.stream_config, ground_agents)

        # Aerial engine & population
        aerial_agents = spawner.spawn_aerial_agents(
            width=width,
            height=height,
            num_people=num_people
        )
        self._aerial_engine = AerialSimulationEngine(self.config, self.stream_config, aerial_agents)

    def set_view_mode(self, mode: str) -> str:
        """Switch perspective between 'aerial' and 'ground'. Returns active mode."""
        clean_mode = mode.lower().strip()
        self.view_mode = clean_mode if clean_mode in self._VALID_MODES else "aerial"
        return self.view_mode

    def read_frame(self) -> Tuple[bool, np.ndarray]:
        """Produce and return the next synthetic frame for the active view mode."""
        if self.view_mode == "ground":
            frame = self._ground_engine.render_frame(self.frame_idx)
        else:
            frame = self._aerial_engine.render_frame(self.frame_idx)

        self.frame_idx += 1
        return True, frame

    def get_simulated_targets(self) -> List[Dict]:
        """Ground-truth bounding boxes and kinematic metadata for the active perspective."""
        if self.view_mode == "ground":
            return self._ground_engine.build_targets()
        return self._aerial_engine.build_targets(self.frame_idx)
