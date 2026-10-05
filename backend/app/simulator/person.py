"""
Simulated Person: Aerial kinematics and procedural top-down pedestrian rendering.
"""

import math
import random
from typing import Tuple
import cv2
import numpy as np

class SimulatedPerson:
    """
    Represents an aerial pedestrian with physics, kinematics, and top-down rendering.
    """
    def __init__(self, x: float, y: float, color: Tuple[int, int, int], size: int = 20):
        self.x = x
        self.y = y
        self.color = color
        self.size = size

        angle = random.uniform(0, 2 * math.pi)
        speed = random.uniform(1.5, 3.5)
        self.vx = math.cos(angle) * speed
        self.vy = math.sin(angle) * speed
        self.walk_phase = random.uniform(0, math.pi * 2)

    def update_physics(
        self,
        frame_idx: int,
        person_idx: int,
        width: int,
        height: int
    ) -> None:
        """
        Updates independent pedestrian movement with boundary reflection.
        """
        if self.x < 100 or self.x > width - 100:
            self.vx *= -1
        if self.y < 100 or self.y > height - 100:
            self.vy *= -1

        self.x += self.vx
        self.y += self.vy
        self.walk_phase += 0.2

    def render(self, frame: np.ndarray, drift_x: int = 0, drift_y: int = 0) -> None:
        """
        Renders oblique aerial drone pedestrian (shadow, walking legs, jacket torso, arms, and head).
        Optimized for high-confidence YOLOv8 overhead aerial person detection.
        """
        px = int(self.x + drift_x)
        py = int(self.y + drift_y)
        r = self.size

        # 1. Cast elongated aerial ground shadow
        cv2.ellipse(frame, (px + 8, py + 26), (r, 8), 15, 0, 360, (50, 55, 60), -1)

        # 2. Animated walking legs (stride kinematics)
        stride = math.sin(self.walk_phase) * 8
        leg_color = (40, 45, 55)
        cv2.line(frame, (px - 5, py + 10), (int(px - 6 - stride), py + 26), leg_color, 5)
        cv2.line(frame, (px + 5, py + 10), (int(px + 6 + stride), py + 26), leg_color, 5)

        # 3. Torso / Jacket
        torso_pts = np.array([
            [px - 14, py - 6],
            [px + 14, py - 6],
            [px + 10, py + 14],
            [px - 10, py + 14]
        ], dtype=np.int32)
        cv2.fillPoly(frame, [torso_pts], self.color)
        cv2.polylines(frame, [torso_pts], True, (30, 30, 30), 1)

        # 4. Swinging arms
        arm_swing = math.cos(self.walk_phase) * 7
        cv2.line(frame, (px - 13, py - 3), (int(px - 16 - arm_swing), py + 10), self.color, 4)
        cv2.line(frame, (px + 13, py - 3), (int(px + 16 + arm_swing), py + 10), self.color, 4)

        # 5. Head & hair / cap
        cv2.circle(frame, (px, py - 12), 8, (170, 190, 215), -1)
        cv2.ellipse(frame, (px, py - 14), (8, 6), 0, 180, 360, (25, 20, 20), -1)
