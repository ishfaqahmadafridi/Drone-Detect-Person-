"""
Simulator package public API.
All consumers import from here — internal module layout is an implementation detail.
"""

from app.simulator.config import SimulationConfig
from app.simulator.person import SimulatedPerson
from app.simulator.terrain import TerrainRenderer
from app.simulator.osd import TelemetryOsdRenderer
from app.simulator.video_generator import SyntheticVideoGenerator, create_synthetic_drone_video
from app.simulator.live_stream import LiveSimulationStream
from app.simulator.ground_renderer import GroundCctvRenderer
from app.simulator.persons import GroundSimulatedPerson

__all__ = [
    "SimulationConfig",
    "SimulatedPerson",
    "TerrainRenderer",
    "TelemetryOsdRenderer",
    "SyntheticVideoGenerator",
    "create_synthetic_drone_video",
    "LiveSimulationStream",
    "GroundCctvRenderer",
    "GroundSimulatedPerson",
]
