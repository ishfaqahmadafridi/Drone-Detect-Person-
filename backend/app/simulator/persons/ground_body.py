"""
GroundBodyRenderer: All cv2 drawing sub-routines for a ground-level pedestrian.

Single responsibility: rendering only — no physics, no bounding-box math.
All proportions and colour tokens come from PedestrianMorphologyConfig and
PedestrianPaletteConfig — no bare numbers inside drawing calls.
"""

import math
from typing import Tuple

import cv2
import numpy as np

from app.simulator.config import (
    PedestrianKinematicsConfig,
    PedestrianMorphologyConfig,
    PedestrianPaletteConfig,
)


class GroundBodyRenderer:
    """
    Draws each anatomical layer of a ground-level pedestrian onto a BGR frame.

    All geometry is derived from (scale, walk_phase, arm_swing) parameters
    computed by the caller from the agent's physics state.

    Args:
        color       : Shirt / jacket colour (BGR).
        pants_color : Trousers colour (BGR).
        palette     : Skin / hair / shadow / shoe colour tokens.
        morphology  : Body proportion scaling tokens.
    """

    # Torso waist-narrowing ratio (fraction of person_width)
    _WAIST_RATIO: float = 0.4
    # Torso outline stroke colour
    _TORSO_OUTLINE: Tuple[int, int, int] = (30, 30, 30)
    _TORSO_OUTLINE_THICKNESS: int = 1
    # Shadow foot offset (pixels right)
    _SHADOW_FOOT_OFFSET_X: int = 10
    _SHADOW_FOOT_OFFSET_Y: int = -2

    def __init__(
        self,
        color: Tuple[int, int, int],
        pants_color: Tuple[int, int, int],
        palette: PedestrianPaletteConfig | None = None,
        morphology: PedestrianMorphologyConfig | None = None,
        kinematics: PedestrianKinematicsConfig | None = None,
    ) -> None:
        self._color = color
        self._pants = pants_color
        self._p = palette or PedestrianPaletteConfig()
        self._m = morphology or PedestrianMorphologyConfig()
        self._k = kinematics or PedestrianKinematicsConfig()

    # ------------------------------------------------------------------
    # Public API — called in z-order (back → front)
    # ------------------------------------------------------------------

    def draw(
        self,
        frame: np.ndarray,
        px: int,
        py: int,
        scale: float,
        person_width: int,
        person_height: int,
        walk_phase: float,
    ) -> None:
        """Render all body layers in correct painter's order."""
        head_radius = int(self._m.head_radius * scale)
        leg_len = int(person_height * self._m.leg_ratio)
        hip_y = py - leg_len
        torso_h = int(person_height * self._m.torso_ratio)
        torso_y1 = hip_y - torso_h

        stride = math.sin(walk_phase) * (self._k.stride_amplitude * scale)
        arm_swing = math.cos(walk_phase) * (self._k.arm_swing_amplitude * scale)

        self._draw_shadow(frame, px, py, scale, person_width)
        self._draw_lower_body(frame, px, py, hip_y, scale, stride)
        self._draw_torso(frame, px, torso_y1, hip_y, person_width)
        self._draw_arms(frame, px, torso_y1, hip_y, person_width, scale, arm_swing)
        self._draw_head(frame, px, torso_y1, scale, head_radius)

    # ------------------------------------------------------------------
    # Private body-part sub-routines
    # ------------------------------------------------------------------

    def _draw_shadow(
        self,
        frame: np.ndarray,
        px: int,
        py: int,
        scale: float,
        person_width: int,
    ) -> None:
        m = self._m
        shadow_w = int(person_width * m.shadow_width_factor)
        shadow_h = int(m.shadow_height_base * scale)
        cv2.ellipse(
            frame,
            (px + self._SHADOW_FOOT_OFFSET_X, py + self._SHADOW_FOOT_OFFSET_Y),
            (shadow_w, max(2, shadow_h)),
            15, 0, 360,
            self._p.shadow,
            -1,
        )

    def _draw_lower_body(
        self,
        frame: np.ndarray,
        px: int,
        py: int,
        hip_y: int,
        scale: float,
        stride: float,
    ) -> None:
        thickness = max(4, int(10 * scale))
        leg_offset = int(8 * scale)
        foot1_x = int(px - stride)
        foot2_x = int(px + stride)

        cv2.line(frame, (px - leg_offset, hip_y), (foot1_x, py), self._pants, thickness)
        cv2.line(frame, (px + leg_offset, hip_y), (foot2_x, py), self._pants, thickness)

        shoe_r = max(2, int(5 * scale))
        cv2.circle(frame, (foot1_x, py), shoe_r, self._p.shoes, -1)
        cv2.circle(frame, (foot2_x, py), shoe_r, self._p.shoes, -1)

    def _draw_torso(
        self,
        frame: np.ndarray,
        px: int,
        torso_y1: int,
        torso_y2: int,
        person_width: int,
    ) -> None:
        half_w = person_width // 2
        waist_w = int(person_width * self._WAIST_RATIO)
        pts = np.array(
            [
                [px - half_w, torso_y1],
                [px + half_w, torso_y1],
                [px + waist_w, torso_y2],
                [px - waist_w, torso_y2],
            ],
            dtype=np.int32,
        )
        cv2.fillPoly(frame, [pts], self._color)
        cv2.polylines(frame, [pts], True, self._TORSO_OUTLINE, self._TORSO_OUTLINE_THICKNESS)

    def _draw_arms(
        self,
        frame: np.ndarray,
        px: int,
        torso_y1: int,
        hip_y: int,
        person_width: int,
        scale: float,
        arm_swing: float,
    ) -> None:
        arm_thickness = max(3, int(7 * scale))
        half_w = person_width // 2
        shoulder_y = torso_y1 + int(6 * scale)
        hand_y = hip_y - int(4 * scale)
        cv2.line(
            frame,
            (px - half_w, shoulder_y),
            (px - half_w - int(arm_swing), hand_y),
            self._color,
            arm_thickness,
        )
        cv2.line(
            frame,
            (px + half_w, shoulder_y),
            (px + half_w + int(arm_swing), hand_y),
            self._color,
            arm_thickness,
        )

    def _draw_head(
        self,
        frame: np.ndarray,
        px: int,
        torso_y1: int,
        scale: float,
        head_radius: int,
    ) -> None:
        m, p = self._m, self._p
        neck_h = int(m.neck_height_factor * scale)
        neck_w = int(4 * scale)
        cv2.rectangle(
            frame,
            (px - neck_w, torso_y1 - neck_h),
            (px + neck_w, torso_y1),
            p.skin_tone,
            -1,
        )
        head_cy = torso_y1 - neck_h - head_radius
        cv2.circle(frame, (px, head_cy), max(3, head_radius), p.skin_tone, -1)
        hair_h = max(2, int(head_radius * m.hair_height_ratio))
        cv2.ellipse(
            frame,
            (px, head_cy - int(4 * scale)),
            (max(2, head_radius), hair_h),
            0, 180, 360,
            p.hair,
            -1,
        )
