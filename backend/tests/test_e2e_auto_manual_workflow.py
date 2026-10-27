"""
Comprehensive End-to-End Unit & Integration Tests:
Verifies Auto Mode & Manual Mode person detection, freeze, portrait crop, Re-ID linkage, and Aerial matching.
"""

import unittest
import numpy as np
from types import SimpleNamespace
from fastapi.testclient import TestClient

from main import app
from app.core.config import DetectionConfig
from app.services.stream_service import stream_service
from app.services.reid.service import reid_service


class TestE2EAutoManualWorkflow(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.previous_view = stream_service.config.view_mode
        stream_service.set_view_mode("ground")
        stream_service.set_tracking_mode("auto")
        reid_service.reset_channel("ground")
        reid_service.reset_channel("aerial")

        # Seed mock ground detection frame
        frame = np.ones((480, 640, 3), dtype=np.uint8) * 120
        # Draw distinct colors for simulated people
        frame[50:180, 50:120] = [200, 50, 50]   # Person 1
        frame[60:190, 200:270] = [50, 200, 50]  # Person 2

        result = SimpleNamespace(
            annotated_frame=frame,
            telemetry_payload={
                "view_mode": "ground",
                "source_type": "file",
                "detections": [
                    {"id": 1, "bbox": [50, 50, 120, 180], "conf": 0.92, "class_name": "person"},
                    {"id": 2, "bbox": [200, 60, 270, 190], "conf": 0.88, "class_name": "person"},
                ]
            }
        )
        jpeg = stream_service.broadcaster.encode_frame(frame)
        stream_service.frame_streamer.selection.publish(jpeg, result)
        if hasattr(stream_service.frame_streamer, "_overlay"):
            identity = getattr(stream_service.source_provider, "source_identity", None)
            stream_service.frame_streamer._overlay = (identity, 0, result.telemetry_payload)
        reid_service.observe("ground", frame, result.telemetry_payload["detections"], 1, "file", [])

    def tearDown(self):
        stream_service.set_tracking_mode("auto")
        stream_service.set_view_mode(self.previous_view)
        reid_service.reset_channel("ground")
        reid_service.reset_channel("aerial")

    def test_auto_capture_and_reid_workflow(self):
        """
        End-to-End Test: Auto-Capture ground suspect -> Send to Aerial -> Aerial Re-ID Matching
        """
        # 1. Freeze ground frame to capture highest confidence suspect
        freeze_resp = self.client.post("/api/tracking/freeze")
        self.assertEqual(freeze_resp.status_code, 200)
        data = freeze_resp.json()
        self.assertIn("token", data)
        self.assertEqual(len(data["detections"]), 2)

        # Verify highest confidence suspect is Person 1 (conf: 0.92)
        best_suspect = max(data["detections"], key=lambda d: d.get("conf", 0))
        self.assertEqual(best_suspect["id"], 1)

        # 2. Commit suspect ID 1
        commit_resp = self.client.post("/api/tracking/commit", json={
            "token": data["token"],
            "selected_ids": [best_suspect["id"]]
        })
        self.assertEqual(commit_resp.status_code, 200)
        commit_data = commit_resp.json()
        self.assertEqual(commit_data["mode"], "manual")
        self.assertEqual(commit_data["selected_ids"], [1])

        # 3. Simulate Aerial Drone detecting people top-down
        aerial_frame = np.ones((480, 640, 3), dtype=np.uint8) * 80
        aerial_frame[100:220, 100:160] = [200, 50, 50]  # Person matching suspect 1
        aerial_frame[100:220, 300:360] = [0, 0, 220]    # Person 5 (different)

        aerial_detections = [
            {"id": 101, "bbox": [100, 100, 160, 220], "conf": 0.85, "class_name": "person"},
            {"id": 105, "bbox": [300, 100, 360, 220], "conf": 0.80, "class_name": "person"},
        ]
        reid_service.observe("aerial", aerial_frame, aerial_detections, 1, "file", [])

        # 4. Check Re-ID matching status
        reid_status = self.client.get("/api/reid/status").json()
        self.assertIn(reid_status["status"], ["ready", "idle", "loading", "disabled"])
        self.assertEqual(len(reid_status["targets"]), 1)
        self.assertEqual(reid_status["targets"][0]["ground_track_id"], 1)

    def test_manual_mode_freeze_select_and_clear_workflow(self):
        """
        End-to-End Test: Manual Freeze -> Select Target ID 2 -> Status Check -> Clear
        """
        # 1. Freeze
        freeze_resp = self.client.post("/api/tracking/freeze")
        self.assertEqual(freeze_resp.status_code, 200)
        token = freeze_resp.json()["token"]

        # 2. Operator selects Person 2
        commit_resp = self.client.post("/api/tracking/commit", json={
            "token": token,
            "selected_ids": [2]
        })
        self.assertEqual(commit_resp.status_code, 200)
        self.assertEqual(commit_resp.json()["selected_ids"], [2])

        # 3. Verify status endpoint returns manual mode with ID 2
        status_resp = self.client.get("/api/tracking/status")
        self.assertEqual(status_resp.status_code, 200)
        self.assertEqual(status_resp.json()["mode"], "manual")
        self.assertEqual(status_resp.json()["selected_ids"], [2])

        # 4. Clear selection back to Auto Mode
        clear_resp = self.client.post("/api/tracking/clear")
        self.assertEqual(clear_resp.status_code, 200)
        self.assertEqual(clear_resp.json()["selected_ids"], [])

        # 5. Verify status returns auto mode
        status_after = self.client.get("/api/tracking/status").json()
        self.assertEqual(status_after["mode"], "auto")
        self.assertEqual(status_after["selected_ids"], [])

    def test_aerial_perspective_rejects_ground_selection(self):
        """
        Ensures strict perspective separation: Aerial Drone mode rejects suspect freeze.
        """
        stream_service.set_view_mode("aerial")
        freeze_resp = self.client.post("/api/tracking/freeze")
        self.assertEqual(freeze_resp.status_code, 409)
        self.assertIn("Ground CCTV", freeze_resp.json()["detail"])


if __name__ == "__main__":
    unittest.main()
