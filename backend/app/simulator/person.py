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
        Updates pedestrian kinematics and triggers intentional 2+ gathering behavior.
        """
        # In frames 60..260, guide persons 0 and 1 towards each other to trigger gathering
        if 60 < frame_idx < 260 and person_idx < 2:
            target_x = width // 2 + (person_idx * 40 - 20)
            target_y = height // 2
            dx = target_x - self.x
            dy = target_y - self.y
            dist = math.hypot(dx, dy)
            if dist > 5:
                self.vx = (dx / dist) * 2.0
                self.vy = (dy / dist) * 2.0
            else:
                self.vx = random.uniform(-0.3, 0.3)
                self.vy = random.uniform(-0.3, 0.3)
        else:
            # Standard perimeter bounce
            if self.x < 100 or self.x > width - 100:
                self.vx *= -1
            if self.y < 100 or self.y > height - 100:
                self.vy *= -1

        self.x += self.vx
        self.y += self.vy
        self.walk_phase += 0.2

    def render(self, frame: np.ndarray, drift_x: int = 0, drift_y: int = 0) -> None:
        """
        Renders overhead aerial pedestrian (shadow, torso ellipse, head, and swinging arms).
        """
        px = int(self.x + drift_x)
        py = int(self.y + drift_y)
        r = self.size

        # 1. Cast shadow
        cv2.ellipse(frame, (px + 6, py + 8), (r + 4, r // 2), 25, 0, 360, (70, 75, 80), -1)

        # 2. Torso & shoulders
        cv2.ellipse(frame, (px, py), (r, r // 2 + 2), int(self.walk_phase * 10), 0, 360, self.color, -1)

        # 3. Head & Hair
        cv2.circle(frame, (px, py - 2), r // 2, (30, 20, 15), -1)
        cv2.circle(frame, (px, py - 4), r // 3, (20, 15, 10), -1)

        # 4. Arms swinging
        swing = math.sin(self.walk_phase) * 6
        cv2.circle(frame, (px - r + int(swing), py), 3, (210, 180, 150), -1)
        cv2.circle(frame, (px + r - int(swing), py), 3, (210, 180, 150), -1)
