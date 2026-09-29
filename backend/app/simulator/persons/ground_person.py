"""
GroundSimulatedPerson: Thin coordinator composing physics + body rendering.

Single responsibility: wires GroundPedestrianPhysics to GroundBodyRenderer
and exposes the bounding-box calculation shared with telemetry target builders.
No drawing logic, no kinematics logic lives here directly.
"""

from typing import Optional, Tuple

import numpy as np

from app.simulator.config import (
    PedestrianKinematicsConfig,
    PedestrianMorphologyConfig,
    PedestrianPaletteConfig,
)
from app.simulator.persons.ground_physics import GroundPedestrianPhysics
from app.simulator.persons.ground_body import GroundBodyRenderer


class GroundSimulatedPerson:
    """
    Upright ground-level pedestrian agent.

    Delegates kinematics to GroundPedestrianPhysics and rendering to
    GroundBodyRenderer. Exposes get_bbox() as the single source of truth
    for perspective-scaled bounding-box geometry (Strict DRY — shared with
    LiveSimulationStream's target builder).

    Args:
        x, y        : Initial foot position (pixels).
        color       : Shirt / jacket colour (BGR).
        pants_color : Trousers colour (BGR); defaults to palette.default_pants.
        speed       : Initial speed scalar; randomised if omitted.
        palette, morphology, kinematics: Config tokens; library defaults if omitted.
    """

    def __init__(
        self,
        x: float,
        y: float,
        color: Tuple[int, int, int],
        pants_color: Optional[Tuple[int, int, int]] = None,
        speed: Optional[float] = None,
        palette: Optional[PedestrianPaletteConfig] = None,
        morphology: Optional[PedestrianMorphologyConfig] = None,
        kinematics: Optional[PedestrianKinematicsConfig] = None,
    ) -> None:
        _palette = palette or PedestrianPaletteConfig()
        _morphology = morphology or PedestrianMorphologyConfig()
        _kinematics = kinematics or PedestrianKinematicsConfig()

        self._physics = GroundPedestrianPhysics(x=x, y=y, speed=speed, kinematics=_kinematics)
        self._morphology = _morphology
        self._body = GroundBodyRenderer(
            color=color,
            pants_color=pants_color or _palette.default_pants,
            palette=_palette,
            morphology=_morphology,
            kinematics=_kinematics,
        )

    # ------------------------------------------------------------------
    # Passthrough properties (used by LiveSimulationStream target builder)
    # ------------------------------------------------------------------

    @property
    def x(self) -> float:
        return self._physics.x

    @property
    def y(self) -> float:
        return self._physics.y

    @property
    def vx(self) -> float:
        return self._physics.vx

    @property
    def vy(self) -> float:
        return self._physics.vy

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def update_physics(
        self,
        frame_idx: int,
        person_idx: int,
        width: int,
        height: int,
        horizon_y: int = 240,
    ) -> None:
        """Advance kinematic state by one frame."""
        self._physics.step(frame_idx, person_idx, width, height, horizon_y)

    def get_bbox(
        self,
        horizon_y: int,
        frame_height: int,
    ) -> Tuple[int, int, int, int, float]:
        """
        Compute perspective-scaled bounding box.

        Returns (x1, y1, x2, y2, scale).
        Single source of truth shared between render() and get_simulated_targets()
        — Strict DRY, no duplication.
        """
        m = self._morphology
        denom = max(1, frame_height - horizon_y)
        depth_ratio = max(0.1, min(1.0, (self._physics.y - horizon_y) / denom))
        scale = m.min_scale + depth_ratio * m.depth_scale_range

        person_height = int(m.base_height * scale)
        person_width = int(m.base_width * scale)

        px = int(self._physics.x)
        py = int(self._physics.y)
        return (
            px - person_width // 2,
            py - person_height,
            px + person_width // 2,
            py,
            scale,
        )

    def render(self, frame: np.ndarray, horizon_y: int = 240) -> None:
        """Render the pedestrian onto *frame* at current physics position."""
        h_frame, w_frame = frame.shape[:2]
        x1, y1, x2, y2, scale = self.get_bbox(horizon_y, h_frame)

        px = int(self._physics.x)
        py = int(self._physics.y)

        # Skip if fully out of frame bounds
        if px < -60 or px > w_frame + 60:
            return

        self._body.draw(
            frame=frame,
            px=px,
            py=py,
            scale=scale,
            person_width=x2 - x1,
            person_height=y2 - y1,
            walk_phase=self._physics.walk_phase,
        )
