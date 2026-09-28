"""
generator.py — Backward-compatible re-export shim.

All logic has been split into dedicated single-responsibility modules:
  - app.simulator.video_generator  → SyntheticVideoGenerator, create_synthetic_drone_video
  - app.simulator.live_stream      → LiveSimulationStream

Import from those modules directly for new code.
"""

from app.simulator.video_generator import SyntheticVideoGenerator, create_synthetic_drone_video  # noqa: F401
from app.simulator.live_stream import LiveSimulationStream  # noqa: F401

__all__ = [
    "SyntheticVideoGenerator",
    "create_synthetic_drone_video",
    "LiveSimulationStream",
]
