import unittest
import numpy as np
from app.services.inference_service import MultiViewInferenceService
from app.services.zone_service import ZoneMonitorService
from app.services.alert_service import AlertManagerService
from app.core.constants import AlertLevel

class TestInferenceAndZones(unittest.TestCase):
    def test_inference_profiles(self):
        svc = MultiViewInferenceService()
        status = svc.get_status()
        self.assertIn("aerial", status["profiles"])
        self.assertIn("ground", status["profiles"])
        self.assertEqual(status["active_view"], "aerial")
        
        switched = svc.set_active_view("ground")
        self.assertEqual(switched, "ground")
        self.assertEqual(svc.active_view, "ground")

    def test_zone_intrusion_and_gatherings(self):
        # 1000x1000 zone polygon from (200, 200) to (800, 800)
        norm_zone = [(0.2, 0.2), (0.8, 0.2), (0.8, 0.8), (0.2, 0.8)]
        zone = ZoneMonitorService(1000, 1000, norm_zone)
        alert_mgr = AlertManagerService(multi_person_threshold=2)

        # Person 1 inside zone (foot at 500, 500)
        p1 = {"id": 1, "center": (500, 450), "foot": (500, 500), "bbox": [480, 400, 520, 500]}
        # Person 2 outside zone (foot at 100, 100)
        p2 = {"id": 2, "center": (100, 50), "foot": (100, 100), "bbox": [80, 0, 120, 100]}
        # Person 3 close to Person 1 (foot at 530, 500) -> distance = 30px <= 120px threshold
        p3 = {"id": 3, "center": (530, 450), "foot": (530, 500), "bbox": [510, 400, 550, 500]}

        persons = [p1, p2, p3]
        intruders = zone.check_intrusions(persons)
        self.assertEqual(len(intruders), 2)  # p1 and p3 are inside
        self.assertTrue(p1["is_intruder"])
        self.assertFalse(p2["is_intruder"])
        self.assertTrue(p3["is_intruder"])

        gatherings, clustered_ids = zone.compute_gatherings(persons, proximity_threshold_px=120)
        self.assertGreaterEqual(len(gatherings), 1)  # p1 and p3 form a gathering cluster

        threat, msg, details = alert_mgr.evaluate_state(persons, intruders, gatherings)
        self.assertEqual(threat, AlertLevel.INTRUSION)

if __name__ == "__main__":
    unittest.main()
