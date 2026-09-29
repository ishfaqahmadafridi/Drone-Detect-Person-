"""
BackgroundRenderer: Sky gradient and distant warehouse / perimeter-wall silhouettes.

Owns the visual layer above the horizon line — all hardcoded pixel values
are driven by the GroundSceneConfig token class below, never written inline.
"""

from dataclasses import dataclass, field
from typing import List, Tuple

import numpy as np


@dataclass(frozen=True)
class SkyGradientConfig:
    """Colour ramp for the industrial sky (BGR channel base + ramp delta)."""
    b_base: int = 70
    g_base: int = 80
    r_base: int = 90
    ramp: int = 30  # added at the horizon edge


@dataclass(frozen=True)
class BuildingConfig:
    """Position and colour for one warehouse silhouette (x1, y_offset, x2, bgr)."""
    x1: int
    x2: int
    height_px: int
    color: Tuple[int, int, int]


@dataclass(frozen=True)
class BackgroundSceneConfig:
    """Aggregates all background-layer rendering tokens."""
    sky: SkyGradientConfig = field(default_factory=SkyGradientConfig)
    buildings: List[BuildingConfig] = field(default_factory=lambda: [
        BuildingConfig(x1=80,   x2=380,  height_px=120, color=(50, 55, 60)),
        BuildingConfig(x1=420,  x2=780,  height_px=80,  color=(45, 50, 55)),
        BuildingConfig(x1=820,  x2=1200, height_px=140, color=(48, 52, 58)),
    ])


class BackgroundRenderer:
    """
    Renders the sky gradient and warehouse silhouettes above the horizon line.

    Args:
        scene_cfg: Token dataclass; defaults to BackgroundSceneConfig().
    """

    def __init__(self, scene_cfg: BackgroundSceneConfig | None = None) -> None:
        self._cfg = scene_cfg or BackgroundSceneConfig()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def draw(self, frame: np.ndarray, horizon_y: int) -> None:
        """Draw sky + silhouettes onto *frame* in-place."""
        self._draw_sky_gradient(frame, horizon_y)
        self._draw_warehouse_silhouettes(frame, horizon_y)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _draw_sky_gradient(self, frame: np.ndarray, horizon_y: int) -> None:
        sky = self._cfg.sky
        for y in range(horizon_y):
            ratio = y / max(horizon_y, 1)
            b = int(sky.b_base + ratio * sky.ramp)
            g = int(sky.g_base + ratio * sky.ramp)
            r = int(sky.r_base + ratio * sky.ramp)
            frame[y, :] = (b, g, r)

    def _draw_warehouse_silhouettes(self, frame: np.ndarray, horizon_y: int) -> None:
        import cv2
        for bldg in self._cfg.buildings:
            top_y = horizon_y - bldg.height_px
            cv2.rectangle(frame, (bldg.x1, top_y), (bldg.x2, horizon_y), bldg.color, -1)
