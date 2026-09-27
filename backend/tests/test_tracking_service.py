import unittest
import time
from app.services.tracking_service import TargetTrackerService

class TestTrackingService(unittest.TestCase):
    def setUp(self):
        self.tracker = TargetTrackerService(max_trajectory_points=10, ttl_seconds=2.0)

    def test_trajectory_and_velocity_tracking(self):
        t0 = 1000.0
        # Frame 1: Person at (100, 100)
        detections_f1 = [{
            "id": 1,
            "track_id": 1,
            "bbox": [80, 80, 120, 120],
            "center": (100, 100),
            "conf": 0.9
        }]
        res1 = self.tracker.update_tracks(detections_f1, timestamp=t0)
        self.assertEqual(len(res1), 1)
        self.assertEqual(len(res1[0]["trajectory"]), 1)
        self.assertEqual(res1[0]["speed_px_s"], 0.0)

        # Frame 2: Person moved to (130, 140) at t0 + 0.5s (dx=30, dy=40, dist=50px -> 100px/s)
        t1 = t0 + 0.5
        detections_f2 = [{
            "id": 1,
            "track_id": 1,
            "bbox": [110, 120, 150, 160],
            "center": (130, 140),
            "conf": 0.88
        }]
        res2 = self.tracker.update_tracks(detections_f2, timestamp=t1)
        self.assertEqual(len(res2), 1)
        self.assertEqual(len(res2[0]["trajectory"]), 2)
        self.assertAlmostEqual(res2[0]["speed_px_s"], 100.0, delta=1.0)

    def test_ttl_cleanup(self):
        t0 = 1000.0
        detections = [{
            "id": 99,
            "track_id": 99,
            "bbox": [50, 50, 100, 100],
            "center": (75, 75),
            "conf": 0.85
        }]
        self.tracker.update_tracks(detections, timestamp=t0)
        self.assertIn(99, self.tracker.trajectories)

        # After TTL of 2.0s (e.g. at t0 + 3.0s), track should be purged
        t_future = t0 + 3.0
        self.tracker.update_tracks([], timestamp=t_future)
        self.assertNotIn(99, self.tracker.trajectories)

if __name__ == "__main__":
    unittest.main()
