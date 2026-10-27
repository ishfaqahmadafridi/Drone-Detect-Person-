"""
Synthetic Simulation Frame Source: Procedural in-memory drone patrol stream.
Zero external hardware, disk, or codec requirements.
"""

from app.core.config import SIMULATION_WIDTH, SIMULATION_HEIGHT, SIMULATION_PERSON_COUNT, SIMULATION_INTERVAL_SECONDS
import time
from typing import Tuple, Optional
import numpy as np

from app.services.streaming.sources.base import BaseFrameSource
from app.simulator.generator import LiveSimulationStream


class SyntheticFrameSource(BaseFrameSource):
    """
    Procedural computer vision simulator generating realistic aerial drone telemetry and people paths.
    """
    def __init__(
        self,
        width: int = SIMULATION_WIDTH,
        height: int = SIMULATION_HEIGHT,
        num_people: int = SIMULATION_PERSON_COUNT,
        frame_interval_seconds: float = SIMULATION_INTERVAL_SECONDS
    ):
        self.stream = LiveSimulationStream(width=width, height=height, num_people=num_people)
        self.frame_interval_seconds = frame_interval_seconds

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        ret, frame = self.stream.read_frame()
        if self.frame_interval_seconds > 0:
            time.sleep(self.frame_interval_seconds)
        return ret, frame

    def set_view_mode(self, view_mode: str) -> str:
        return self.stream.set_view_mode(view_mode)

    def get_simulated_targets(self):
        return self.stream.get_simulated_targets()

    def release(self) -> None:
        pass
