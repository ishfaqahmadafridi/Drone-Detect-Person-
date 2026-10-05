"""Regression coverage for validated uploads, frozen selection and shared streaming."""
import asyncio
import io
import tempfile
import time
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import patch, Mock

import cv2
import numpy as np
from fastapi import HTTPException, UploadFile
from app.core.config import DetectionConfig
from app.services.video_upload import save_video
from app.services.streaming.selection_session import SelectionSession
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.streaming.frame_streamer import FrameStreamer
from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster


class TestSelectionSession(unittest.TestCase):
    def setUp(self):
        self.session = SelectionSession()
        self.config = DetectionConfig(view_mode="ground")
        self.store = TelemetryStateStore()
        self.result = SimpleNamespace(
            annotated_frame=np.zeros((240, 320, 3), dtype=np.uint8),
            telemetry_payload={"view_mode": "ground", "source_type": "file", "detections": [
                {"id": 7, "bbox": [10, 20, 30, 40], "conf": 0.9}
            ]},
        )
        self.session.publish(b"paired-jpeg", self.result)

    def test_snapshot_and_commit_use_same_frame(self):
        snapshot = self.session.freeze(self.config)
        self.assertEqual((snapshot["width"], snapshot["height"]), (320, 240))
        self.assertTrue(self.session.paused)
        self.assertEqual(snapshot["detections"][0]["id"], 7)
        result = self.session.commit(snapshot["token"], [7, 7], self.config, self.store)
        self.assertEqual(result["selected_ids"], [7])
        self.assertEqual(self.store.latest["tracking_mode"], "manual")
        self.assertFalse(self.session.paused)

    def test_reject_aerial_and_unknown_ids(self):
        self.config.view_mode = "aerial"
        with self.assertRaises(HTTPException):
            self.session.freeze(self.config)
        self.config.view_mode = "ground"
        snapshot = self.session.freeze(self.config)
        with self.assertRaises(HTTPException):
            self.session.commit(snapshot["token"], [999], self.config, self.store)
        self.assertEqual(self.config.selected_target_ids, [])

    def test_source_change_and_expiry_reject_stale_selection(self):
        token = self.session.freeze(self.config)["token"]
        self.session.invalidate()
        with self.assertRaises(HTTPException):
            self.session.commit(token, [7], self.config, self.store)
        self.session.publish(b"next-frame", self.result)
        token = self.session.freeze(self.config)["token"]
        self.session.deadline = time.monotonic() - 1
        self.assertFalse(self.session.paused)
        with self.assertRaises(HTTPException):
            self.session.commit(token, [7], self.config, self.store)

    def test_cancel_token_cannot_resume_another_session(self):
        token = self.session.freeze(self.config)["token"]
        self.session.cancel("stale-token")
        self.assertTrue(self.session.paused)
        self.session.cancel(token)
        self.assertFalse(self.session.paused)


class TestVideoUpload(unittest.TestCase):
    def test_invalid_and_oversize_uploads_leave_no_files(self):
        with tempfile.TemporaryDirectory() as directory:
            with patch("app.services.video_upload.UPLOADS_DIR", directory):
                for filename, payload, expected in [("bad.exe", b"bad", 415), ("bad.mp4", b"invalid", 422)]:
                    with self.assertRaises(HTTPException) as caught:
                        asyncio.run(save_video(UploadFile(filename=filename, file=io.BytesIO(payload))))
                    self.assertEqual(caught.exception.status_code, expected)
                with patch("app.services.video_upload.VIDEO_UPLOAD_MAX_BYTES", 2):
                    with self.assertRaises(HTTPException) as caught:
                        asyncio.run(save_video(UploadFile(filename="big.mp4", file=io.BytesIO(b"123"))))
                    self.assertEqual(caught.exception.status_code, 413)
                self.assertEqual(list(Path(directory).iterdir()), [])

    def test_valid_video_uses_safe_generated_filename(self):
        with tempfile.TemporaryDirectory() as directory:
            fixture = Path(directory) / "fixture.avi"
            writer = cv2.VideoWriter(str(fixture), cv2.VideoWriter_fourcc(*"MJPG"), 10, (64, 48))
            writer.write(np.zeros((48, 64, 3), dtype=np.uint8))
            writer.release()
            with patch("app.services.video_upload.UPLOADS_DIR", directory):
                saved = asyncio.run(save_video(UploadFile(filename="../../escape.avi", file=io.BytesIO(fixture.read_bytes()))))
            self.assertEqual(saved.parent, Path(directory))
            self.assertNotIn("escape", saved.name)
            self.assertTrue(saved.exists())


class TestSharedStreamer(unittest.TestCase):
    def test_two_viewers_share_producer_and_freeze_stops_inference(self):
        frame = np.zeros((48, 64, 3), dtype=np.uint8)
        source = Mock(source_type="file")
        source.read_frame.return_value = (True, frame)
        pipeline = Mock()
        pipeline.process_frame.return_value = SimpleNamespace(
            annotated_frame=frame, telemetry_payload={"view_mode": "ground", "detections": []}
        )
        streamer = FrameStreamer(source, pipeline, TelemetryStateStore(), MjpegBroadcaster(), CoordinatorConfig())
        first, second = streamer.generate_frames(), streamer.generate_frames()
        with patch("app.services.streaming.frame_streamer.video_recorder"):
            try:
                self.assertIn(b"image/jpeg", next(first))
                producer = streamer._producer
                next(second)
                self.assertIs(streamer._producer, producer)
                token = streamer.selection.freeze(DetectionConfig(view_mode="ground"))["token"]
                count = pipeline.process_frame.call_count
                time.sleep(0.15)
                self.assertEqual(pipeline.process_frame.call_count, count)
                streamer.selection.cancel(token)
            finally:
                first.close()
                second.close()
                streamer.is_running = False
                streamer._producer.join(timeout=2)


if __name__ == "__main__":
    unittest.main()
