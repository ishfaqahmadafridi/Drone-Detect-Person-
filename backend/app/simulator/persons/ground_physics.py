"""
GroundPedestrianPhysics: Position, velocity, boundary handling, and walk-cycle state.

Single responsibility: kinematics only — no rendering, no bounding boxes.
All behaviour thresholds come from PedestrianKinematicsConfig (no bare numbers).
"""

import math
import random

from app.simulator.config import PedestrianKinematicsConfig


class GroundPedestrianPhysics:
    """
    Maintains and advances kinematic state for a ground-level simulated pedestrian.

    Attributes:
        x, y        : Current foot position (pixels).
        vx, vy      : Current velocity (pixels/frame).
        walk_phase  : Current gait animation angle (radians).
    """

    def __init__(
        self,
        x: float,
        y: float,
        speed: float | None = None,
        kinematics: PedestrianKinematicsConfig | None = None,
    ) -> None:
        self._k = kinematics or PedestrianKinematicsConfig()

        self.x: float = x
        self.y: float = y

        direction = 1.0 if random.random() > 0.5 else -1.0
        base_speed = speed or random.uniform(self._k.min_speed, self._k.max_speed)
        self.vx: float = base_speed * direction
        self.vy: float = random.uniform(-self._k.vertical_drift_max, self._k.vertical_drift_max)
        self.walk_phase: float = random.uniform(0.0, math.pi * 2)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def step(
        self,
        frame_idx: int,
        person_idx: int,
        width: int,
        height: int,
        horizon_y: int,
    ) -> None:
        """
        Advance kinematics by one frame.

        Each pedestrian follows an independent patrol path.
        """
        k = self._k
        self._patrol_step(width, height, horizon_y)

        self.x += self.vx
        self.y += self.vy
        self.walk_phase += k.walk_cycle_increment

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _patrol_step(self, width: int, height: int, horizon_y: int) -> None:
        """Wrap horizontal boundaries and clamp vertical to the ground plane."""
        # Horizontal wrap
        if self.x > width + 50:
            self.x = -40.0
            self.vx = abs(self.vx)
        elif self.x < -50:
            self.x = float(width + 40)
            self.vx = -abs(self.vx)

        # Vertical: constrain to ground plane below horizon
        min_y = float(horizon_y + 60)
        max_y = float(height - 40)
        if self.y < min_y:
            self.y = min_y
            self.vy = abs(self.vy)
        elif self.y > max_y:
            self.y = max_y
            self.vy = -abs(self.vy)
