"""
CourtyardRenderer: Perspective paved ground plane, converging depth lines,
and the restricted-zone trapezoid overlay with warning label.

All proportional ratios, colour tokens, and geometry factors are driven by
CourtyardConfig — no bare numbers inside drawing calls.
"""

from dataclasses import dataclass
from typing import Tuple

import cv2
import numpy as np


@dataclass(frozen=True)
class PavementConfig:
    """Ground-plane gradient: lighter far, darker near."""
    base_val: int = 105          # brightness at horizon
    depth_darken: int = 35       # subtracted at camera-near edge


@dataclass(frozen=True)
class PerspectiveLinesConfig:
    """Converging depth lines towards the vanishing point."""
    x_offset_start: int = -800
    x_offset_end: int = 900
    x_offset_step: int = 200
    top_scale: float = 0.15       # lateral offset at horizon
    bottom_scale: float = 2.20    # lateral offset at frame bottom
    color: Tuple[int, int, int] = (75, 80, 85)
    thickness: int = 1


@dataclass(frozen=True)
class RestrictedZoneConfig:
    """Perspective trapezoid that marks the restricted ground zone."""
    # Normalised fractions relative to (width, horizon_y + ground_h)
    near_top_x_left: float = 0.35
    near_top_x_right: float = 0.65
    near_top_y_frac: float = 0.20     # fraction of ground_h from horizon
    far_bot_x_right: float = 0.82
    far_bot_x_left: float = 0.18
    far_bot_y_frac: float = 0.85

    fill_color: Tuple[int, int, int] = (20, 20, 140)
    fill_alpha: float = 0.22
    border_color: Tuple[int, int, int] = (60, 60, 220)
    border_thickness: int = 2

    label_text: str = "RESTRICTED GROUND ZONE - PERIMETER SECTOR 4"
    label_x_frac: float = 0.24
    label_y_frac: float = 0.82       # fraction of ground_h from horizon
    label_color: Tuple[int, int, int] = (80, 80, 240)
    label_scale: float = 0.6
    label_thickness: int = 2


@dataclass(frozen=True)
class CourtyardConfig:
    """Aggregates all courtyard-layer tokens."""
    pavement: PavementConfig = PavementConfig()
    lines: PerspectiveLinesConfig = PerspectiveLinesConfig()
    zone: RestrictedZoneConfig = RestrictedZoneConfig()


class CourtyardRenderer:
    """
    Renders the paved courtyard ground below the horizon: pavement gradient,
    perspective depth lines, and restricted-zone marking.

    Args:
        courtyard_cfg: Token dataclass; defaults to CourtyardConfig().
    """

    def __init__(self, courtyard_cfg: CourtyardConfig | None = None) -> None:
        self._cfg = courtyard_cfg or CourtyardConfig()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def draw(self, frame: np.ndarray, horizon_y: int) -> None:
        """Draw all courtyard layers onto *frame* in-place."""
        height, width = frame.shape[:2]
        ground_h = height - horizon_y

        self._draw_pavement(frame, horizon_y, height, ground_h)
        self._draw_perspective_lines(frame, horizon_y, height, width)
        self._draw_restricted_zone(frame, horizon_y, ground_h, width)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _draw_pavement(
        self,
        frame: np.ndarray,
        horizon_y: int,
        height: int,
        ground_h: int,
    ) -> None:
        pav = self._cfg.pavement
        for y in range(horizon_y, height):
            depth = (y - horizon_y) / max(ground_h, 1)
            val = int(pav.base_val - depth * pav.depth_darken)
            frame[y, :] = (val - 5, val, val + 5)

    def _draw_perspective_lines(
        self,
        frame: np.ndarray,
        horizon_y: int,
        height: int,
        width: int,
    ) -> None:
        cfg = self._cfg.lines
        vanishing_x = width // 2
        for offset_x in range(cfg.x_offset_start, cfg.x_offset_end, cfg.x_offset_step):
            bottom_x = vanishing_x + int(offset_x * cfg.bottom_scale)
            top_x = vanishing_x + int(offset_x * cfg.top_scale)
            cv2.line(
                frame,
                (top_x, horizon_y),
                (bottom_x, height),
                cfg.color,
                cfg.thickness,
            )

    def _draw_restricted_zone(
        self,
        frame: np.ndarray,
        horizon_y: int,
        ground_h: int,
        width: int,
    ) -> None:
        z = self._cfg.zone
        zone_pts = np.array(
            [
                [int(width * z.near_top_x_left),  int(horizon_y + ground_h * z.near_top_y_frac)],
                [int(width * z.near_top_x_right), int(horizon_y + ground_h * z.near_top_y_frac)],
                [int(width * z.far_bot_x_right),  int(horizon_y + ground_h * z.far_bot_y_frac)],
                [int(width * z.far_bot_x_left),   int(horizon_y + ground_h * z.far_bot_y_frac)],
            ],
            dtype=np.int32,
        )

        # Semi-transparent fill
        overlay = frame.copy()
        cv2.fillPoly(overlay, [zone_pts], z.fill_color)
        cv2.addWeighted(overlay, z.fill_alpha, frame, 1.0 - z.fill_alpha, 0, frame)

        # Border
        cv2.polylines(frame, [zone_pts], True, z.border_color, z.border_thickness)

        # Warning label
        label_y = int(horizon_y + ground_h * z.label_y_frac)
        cv2.putText(
            frame,
            z.label_text,
            (int(width * z.label_x_frac), label_y),
            cv2.FONT_HERSHEY_SIMPLEX,
            z.label_scale,
            z.label_color,
            z.label_thickness,
            cv2.LINE_AA,
        )
