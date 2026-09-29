"""
PerimeterRenderer: Security fence, vertical posts, and cross-wire along the horizon.

All pixel offsets and colour tokens live in PerimeterFenceConfig — never
written as bare integers in the drawing calls themselves.
"""

from dataclasses import dataclass
from typing import Tuple

import cv2
import numpy as np


@dataclass(frozen=True)
class PerimeterFenceConfig:
    """Visual tokens for the security fence layer."""
    rail_color: Tuple[int, int, int] = (100, 110, 120)
    rail_thickness: int = 3

    post_spacing_px: int = 40
    post_height_px: int = 35           # distance above horizon rail
    post_color: Tuple[int, int, int] = (85, 95, 105)
    post_thickness: int = 2

    topper_radius: int = 3
    topper_color: Tuple[int, int, int] = (140, 150, 160)

    wire_offset_px: int = 20          # below top of posts
    wire_color: Tuple[int, int, int] = (70, 75, 80)
    wire_thickness: int = 1


class PerimeterRenderer:
    """
    Renders the perimeter security fence (horizontal rail, vertical posts,
    post toppers, and cross-wire) at the horizon line.

    Args:
        fence_cfg: Token dataclass; defaults to PerimeterFenceConfig().
    """

    def __init__(self, fence_cfg: PerimeterFenceConfig | None = None) -> None:
        self._cfg = fence_cfg or PerimeterFenceConfig()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def draw(self, frame: np.ndarray, horizon_y: int) -> None:
        """Draw full fence assembly onto *frame* in-place."""
        width = frame.shape[1]
        self._draw_rail(frame, horizon_y, width)
        self._draw_posts(frame, horizon_y, width)
        self._draw_cross_wire(frame, horizon_y, width)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _draw_rail(self, frame: np.ndarray, horizon_y: int, width: int) -> None:
        cfg = self._cfg
        cv2.line(
            frame,
            (0, horizon_y),
            (width, horizon_y),
            cfg.rail_color,
            cfg.rail_thickness,
        )

    def _draw_posts(self, frame: np.ndarray, horizon_y: int, width: int) -> None:
        cfg = self._cfg
        post_top_y = horizon_y - cfg.post_height_px
        for post_x in range(0, width, cfg.post_spacing_px):
            cv2.line(
                frame,
                (post_x, post_top_y),
                (post_x, horizon_y),
                cfg.post_color,
                cfg.post_thickness,
            )
            cv2.circle(frame, (post_x, post_top_y), cfg.topper_radius, cfg.topper_color, -1)

    def _draw_cross_wire(self, frame: np.ndarray, horizon_y: int, width: int) -> None:
        cfg = self._cfg
        wire_y = horizon_y - cfg.wire_offset_px
        cv2.line(frame, (0, wire_y), (width, wire_y), cfg.wire_color, cfg.wire_thickness)
