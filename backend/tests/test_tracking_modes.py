import unittest
import numpy as np
from fastapi.testclient import TestClient

from main import app
from app.core.config import DetectionConfig
from app.services.annotation.theme import TacticalAnnotationTheme
from app.services.annotation.target_overlay import draw_detections_and_trails
from app.services.stream_service import stream_service


class TestTrackingModes(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.previous_view = stream_service.config.view_mode
        stream_service.set_view_mode("ground")
        # Ensure clean initial state
        stream_service.set_tracking_mode("auto")

    def tearDown(self):
        stream_service.set_tracking_mode("auto")
        stream_service.set_view_mode(self.previous_view)

    def test_target_overlay_keeps_all_people_visible(self):
        cfg_auto = DetectionConfig(tracking_mode="auto", selected_target_ids=[])
        theme = TacticalAnnotationTheme()
        frame_auto = np.zeros((720, 1280, 3), dtype=np.uint8)

        persons = [
            {"id": 10, "bbox": [50, 50, 150, 200], "conf": 0.85, "foot": (100, 200)},
            {"id": 20, "bbox": [300, 50, 400, 200], "conf": 0.90, "foot": (350, 200)},
        ]

        # In Auto Mode: both persons drawn
        draw_detections_and_trails(
            annotated=frame_auto,
            detected_persons=persons,
            intruders=[],
            track_history=None,
            config=cfg_auto,
            theme=theme
        )
        non_zero_auto = np.count_nonzero(frame_auto)
        self.assertGreater(non_zero_auto, 0)

        # Selecting no suspects still draws every person
        cfg_manual_empty = DetectionConfig(tracking_mode="manual", selected_target_ids=[])
        frame_manual_empty = np.zeros((720, 1280, 3), dtype=np.uint8)
        draw_detections_and_trails(
            annotated=frame_manual_empty,
            detected_persons=persons,
            intruders=[],
            track_history=None,
            config=cfg_manual_empty,
            theme=theme
        )
        self.assertGreater(np.count_nonzero(frame_manual_empty), 0)

        # Selected ID 10 is highlighted; unselected ID 20 stays boxed
        cfg_manual_selected = DetectionConfig(tracking_mode="manual", selected_target_ids=[10])
        frame_manual_selected = np.zeros((720, 1280, 3), dtype=np.uint8)
        draw_detections_and_trails(
            annotated=frame_manual_selected,
            detected_persons=persons,
            intruders=[],
            track_history=None,
            config=cfg_manual_selected,
            theme=theme
        )
        non_zero_single = np.count_nonzero(frame_manual_selected)
        self.assertGreater(non_zero_single, 0)
        self.assertGreater(np.count_nonzero(frame_manual_selected[50:201, 300:401]), 0)
        self.assertFalse(np.array_equal(frame_manual_selected[50:201, 50:151], frame_auto[50:201, 50:151]))

    def test_tracking_service_mode_switch(self):
        res = stream_service.set_tracking_mode("manual", [10, 20])
        self.assertEqual(res["mode"], "manual")
        self.assertEqual(res["selected_ids"], [10, 20])
        self.assertEqual(stream_service.config.tracking_mode, "manual")

        res_auto = stream_service.set_tracking_mode("auto")
        self.assertEqual(res_auto["mode"], "auto")
        self.assertEqual(res_auto["selected_ids"], [])
        self.assertEqual(stream_service.config.tracking_mode, "auto")

    def test_target_selection_by_id_and_clear(self):
        stream_service.set_tracking_mode("manual")
        # Toggle ID 5
        r1 = stream_service.select_target(target_id=5)
        self.assertIn(5, r1["selected_ids"])

        # Toggle ID 6
        r2 = stream_service.select_target(target_id=6)
        self.assertEqual(r2["selected_ids"], [5, 6])

        # Toggle ID 5 again (deselects)
        r3 = stream_service.select_target(target_id=5)
        self.assertEqual(r3["selected_ids"], [6])

        # Clear targets
        r_clear = stream_service.clear_manual_targets()
        self.assertEqual(r_clear["selected_ids"], [])

    def test_tracking_api_endpoints(self):
        # 1. Switch mode to manual
        resp = self.client.post("/api/tracking/mode", json={"mode": "manual", "selected_ids": [7]})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["mode"], "manual")
        self.assertIn(7, data["selected_ids"])

        # 2. Select target via endpoint
        resp_sel = self.client.post("/api/tracking/select", json={"target_id": 8})
        self.assertEqual(resp_sel.status_code, 200)
        self.assertIn(8, resp_sel.json()["selected_ids"])

        # 3. Status check
        resp_st = self.client.get("/api/tracking/status")
        self.assertEqual(resp_st.status_code, 200)
        self.assertEqual(resp_st.json()["mode"], "manual")

        # 4. Clear endpoint
        resp_cl = self.client.post("/api/tracking/clear")
        self.assertEqual(resp_cl.status_code, 200)
        self.assertEqual(resp_cl.json()["selected_ids"], [])


if __name__ == "__main__":
    unittest.main()
