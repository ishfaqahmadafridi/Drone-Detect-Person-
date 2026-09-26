"""API contract and failure handling, independent of model-download availability."""

import unittest

import cv2
import numpy as np
from fastapi.testclient import TestClient

from app import create_app
from tracking import StaleTrackingFrame


class FakeEngine:
    def __init__(self):
        self.calls = []

    def status(self):
        return {"ground": {"available": True}, "aerial": {"available": True}}

    def predict(self, view, frame, frame_id, imgsz, confidence, **options):
        self.calls.append((view, frame.shape, frame_id, imgsz, confidence))
        self.options = options
        return {"view": view, "frame_id": frame_id, "detections": [], "tracking": bool(options), **options}

    def release_tracking(self, session_id):
        self.released = session_id


class DetectionApiTests(unittest.TestCase):
    def setUp(self):
        self.engine = FakeEngine()
        self.client = TestClient(create_app(self.engine))
        success, encoded = cv2.imencode(".jpg", np.zeros((80, 120, 3), dtype=np.uint8))
        self.assertTrue(success)
        self.jpeg = encoded.tobytes()

    def post_frame(self, view="ground", query="", content=None, content_type="image/jpeg"):
        return self.client.post(f"/api/detect/{view}{query}", content=self.jpeg if content is None else content, headers={"Content-Type": content_type})

    def test_each_view_preserves_its_frame_and_settings(self):
        for view in ("ground", "aerial"):
            response = self.post_frame(view, "?frame_id=73&imgsz=1280&confidence=0.4")
            self.assertEqual(response.status_code, 200, response.text)
            self.assertEqual(response.json()["view"], view)
            self.assertEqual(response.json()["frame_id"], 73)
            self.assertEqual(self.engine.calls[-1], (view, (80, 120, 3), 73, 1280, 0.4))

    def test_input_validation_prevents_inference(self):
        for response, status in [
            (self.post_frame("unknown"), 422),
            (self.post_frame(query="?imgsz=123"), 422),
            (self.post_frame(query="?confidence=1.5"), 422),
            (self.post_frame(query="?frame_id=-1"), 422),
            (self.post_frame(content_type="text/plain"), 415),
            (self.post_frame(content=b"not an image"), 400),
            (self.post_frame(content=b""), 400),
            (self.post_frame(content=b"x" * (8 * 1024 * 1024 + 1)), 413),
        ]:
            self.assertEqual(response.status_code, status, response.text[:200])
        self.assertEqual(self.engine.calls, [])

    def test_model_errors_are_explicit_and_not_demo_predictions(self):
        def missing(*args):
            raise FileNotFoundError("Missing aerial weights")
        self.engine.predict = missing
        response = self.post_frame("aerial")
        self.assertEqual(response.status_code, 503)
        self.assertIn("Missing aerial weights", response.json()["detail"])
        self.assertNotIn("detections", response.json())

    def test_tracking_session_and_timestamp_contract(self):
        session = 'eb2770f0-8475-45b9-b932-c1ddcfa264d4'
        query = f'?tracking_session={session}&source_time=1.2&frame_id=3'
        response = self.post_frame('aerial', query)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(self.engine.options, {'tracking_session': session, 'source_time': 1.2})
        self.assertTrue(response.json()['tracking'])
        for view, bad_query in [('ground', query), ('aerial', f'?tracking_session={session}'),
                                ('aerial', '?tracking_session=bad&source_time=1'),
                                ('aerial', f'?tracking_session={session}&source_time=nan')]:
            self.assertEqual(self.post_frame(view, bad_query).status_code, 422)
        self.assertEqual(self.client.delete(f'/api/tracking/{session}').status_code, 200)
        self.assertEqual(self.engine.released, session)

    def test_out_of_order_tracking_frame_returns_conflict(self):
        def stale(*args, **kwargs):
            raise StaleTrackingFrame('Out of order')
        self.engine.predict = stale
        self.assertEqual(self.post_frame('aerial').status_code, 409)

    def test_frontend_is_served_without_exposing_weights_or_project_files(self):
        self.assertEqual(self.client.get("/").status_code, 200)
        self.assertEqual(self.client.get("/src/main.js").status_code, 200)
        self.assertEqual(self.client.get("/styles.css").status_code, 200)
        for path in ("/models/registry.json", "/app.py", "/requirements.txt", "/src/%2e%2e/%2e%2e/app.py"):
            self.assertEqual(self.client.get(path).status_code, 404, path)
        self.assertEqual(self.client.get("/api/health").json()["status"], "ok")


if __name__ == "__main__":
    unittest.main()
