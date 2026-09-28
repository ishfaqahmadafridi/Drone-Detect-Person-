"""
GroundCctvRenderer: Thin coordinator for the ground-level CCTV simulation.

Delegates every visual layer to its dedicated sub-renderer:
  BackgroundRenderer  → sky gradient + warehouse silhouettes
  PerimeterRenderer   → security fence, posts, cross-wire
  CourtyardRenderer   → perspective ground plane + restricted-zone marking
  OsdOverlayRenderer  → recording dot, timestamp, camera header, footer

No drawing logic lives here — this file owns only composition and frame assembly.
"""

from typing import Tuple

import numpy as np

from app.simulator.config import SimulationConfig
from app.simulator.renderers import (
    BackgroundRenderer,
    CourtyardRenderer,
    OsdOverlayRenderer,
    PerimeterRenderer,
)


class GroundCctvRenderer:
    """
    Assembles a single ground-level CCTV frame by compositing four independent
    visual layers in order: background → perimeter → courtyard → OSD.

    Args:
        config: Simulation-wide parameters (width, height, fps, …).
    """

    # Horizon sits at ~34 % of frame height (eye-level security camera mount).
    _HORIZON_FRACTION: float = 0.34

    def __init__(self, config: SimulationConfig) -> None:
        self.config = config
        self.horizon_y: int = int(config.height * self._HORIZON_FRACTION)

        self._background = BackgroundRenderer()
        self._perimeter = PerimeterRenderer()
        self._courtyard = CourtyardRenderer()
        self._osd = OsdOverlayRenderer()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def render(self, frame_idx: int) -> Tuple[np.ndarray, int]:
        """
        Render one complete CCTV background frame.

        Returns:
            (frame, horizon_y) – the composited BGR frame and the horizon
            pixel row, which callers use for person depth-scaling.
        """
        frame = np.zeros((self.config.height, self.config.width, 3), dtype=np.uint8)

        self._background.draw(frame, self.horizon_y)
        self._perimeter.draw(frame, self.horizon_y)
        self._courtyard.draw(frame, self.horizon_y)
        self._osd.draw(frame, frame_idx)

        return frame, self.horizon_y
