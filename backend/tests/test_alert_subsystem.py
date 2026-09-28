import unittest
import os
import shutil
import tempfile
import numpy as np
from app.core.constants import AlertLevel
from app.services.alert import (
    ThreatStateEvaluator,
    EvidenceRecorder,
    AlertManagerService,
)


class TestAlertSubsystem(unittest.TestCase):
    def setUp(self):
        self.test_dir = tempfile.mkdtemp()
        self.snapshots_dir = os.path.join(self.test_dir, "snapshots")
        self.logs_dir = os.path.join(self.test_dir, "logs")

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_state_evaluator_clear(self):
        evaluator = ThreatStateEvaluator(multi_person_threshold=2)
        threat, msg, details = evaluator.evaluate([], [], [])
        self.assertEqual(threat, AlertLevel.CLEAR)
        self.assertEqual(details["total_persons"], 0)
        self.assertEqual(details["intruders_count"], 0)

    def test_state_evaluator_monitoring(self):
        evaluator = ThreatStateEvaluator(multi_person_threshold=2)
        p1 = {"id": 1}
        threat, msg, details = evaluator.evaluate([p1], [], [])
        self.assertEqual(threat, AlertLevel.MONITORING)
        self.assertEqual(details["total_persons"], 1)

    def test_state_evaluator_multi_person(self):
        evaluator = ThreatStateEvaluator(multi_person_threshold=2)
        persons = [{"id": 1}, {"id": 2}]
        threat, msg, details = evaluator.evaluate(persons, [], [(1, 2, 45.0)])
        self.assertEqual(threat, AlertLevel.MULTI_PERSON)
        self.assertEqual(details["total_persons"], 2)

    def test_state_evaluator_intrusion(self):
        evaluator = ThreatStateEvaluator(multi_person_threshold=2)
        intruders = [{"id": 1}]
        threat, msg, details = evaluator.evaluate([{"id": 1}], intruders, [])
        self.assertEqual(threat, AlertLevel.INTRUSION)
        self.assertIn("RESTRICTED ZONE BREACH", msg)

    def test_evidence_recorder_and_manager(self):
        alert_mgr = AlertManagerService(
            output_dir=self.test_dir,
            snapshots_dir=self.snapshots_dir,
            logs_dir=self.logs_dir,
            multi_person_threshold=2,
            snapshot_cooldown=1.0
        )

        dummy_frame = np.zeros((100, 100, 3), dtype=np.uint8)
        details = {
            "timestamp": "2026-09-28 20:00:00",
            "threat_level": AlertLevel.INTRUSION,
            "total_persons": 1,
            "intruders_count": 1,
            "gathering_pairs": 0,
            "person_ids": [1],
        }

        # First snapshot should be saved
        saved_path = alert_mgr.process_and_save_evidence(
            frame=dummy_frame,
            threat_level=AlertLevel.INTRUSION,
            details=details
        )
        self.assertIsNotNone(saved_path)
        self.assertTrue(os.path.exists(saved_path))
        self.assertTrue(os.path.exists(alert_mgr.log_file_csv))
        self.assertEqual(len(alert_mgr.alert_history), 1)

        # Immediate second snapshot should be rate-limited by cooldown
        second_path = alert_mgr.process_and_save_evidence(
            frame=dummy_frame,
            threat_level=AlertLevel.INTRUSION,
            details=details
        )
        self.assertIsNone(second_path)
        self.assertEqual(len(alert_mgr.alert_history), 1)


if __name__ == "__main__":
    unittest.main()
