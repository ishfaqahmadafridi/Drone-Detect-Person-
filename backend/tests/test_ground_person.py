"""
Unit tests for GroundSimulatedPerson, pedestrian configs, and rendering.
"""

import unittest
import numpy as np

from app.simulator.config import (
    PedestrianPaletteConfig,
    PedestrianMorphologyConfig,
    PedestrianKinematicsConfig,
)
from app.simulator.ground_person import GroundSimulatedPerson


class TestGroundSimulatedPerson(unittest.TestCase):
    def test_pedestrian_instantiation_and_bbox(self):
        palette = PedestrianPaletteConfig()
        morphology = PedestrianMorphologyConfig(base_height=160, base_width=50)
        kinematics = PedestrianKinematicsConfig()

        person = GroundSimulatedPerson(
            x=640,
            y=500,
            color=(40, 200, 40),
            palette=palette,
            morphology=morphology,
            kinematics=kinematics
        )

        x1, y1, x2, y2, scale = person.get_bbox(horizon_y=240, frame_height=720)
        self.assertGreater(scale, 0.6)
        self.assertLess(scale, 1.5)
        self.assertEqual(x2 - x1, int(50 * scale))
        self.assertEqual(y2 - y1, int(160 * scale))

    def test_pedestrian_physics_and_render(self):
        person = GroundSimulatedPerson(
            x=600,
            y=450,
            color=(220, 100, 40)
        )

        # Physics update
        initial_x = person.x
        person.update_physics(frame_idx=10, person_idx=0, width=1280, height=720, horizon_y=240)
        self.assertNotEqual(person.x, initial_x)

        # Rendering
        frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        person.render(frame, horizon_y=240)
        # Verify frame has non-zero pixels rendered
        self.assertTrue(np.any(frame > 0))


if __name__ == "__main__":
    unittest.main()
