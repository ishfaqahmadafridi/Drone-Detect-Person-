"""Slow detection must not stall preview or create an inference backlog."""
import threading
import time
import unittest
from types import SimpleNamespace
from unittest.mock import Mock
from fastapi import HTTPException

import numpy as np
from app.core.config import DetectionConfig
from app.services.streaming.preview_streamer import PreviewStreamer
from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster
from app.services.streaming.telemetry_state import TelemetryStateStore


class PreviewTests(unittest.TestCase):
    def setUp(self):
        self.entered, self.release = threading.Event(), threading.Event()
        self.source = Mock(source_type="file", frame_source_type="file", source_identity="first")
        self.frame = np.zeros((80, 120, 3), dtype=np.uint8)
        self.source.read_frame.return_value = (True, self.frame)
        self.pipeline = Mock(config=DetectionConfig(view_mode="ground"))
        self.indices = []

        def detect(**job):
            self.indices.append(job["frame_idx"])
            self.entered.set()
            self.release.wait(timeout=3)
            return SimpleNamespace(annotated_frame=job["frame"], telemetry_payload={
                "view_mode": "ground", "source_type": "file", "detections": [{"id": 7, "conf": .9, "bbox": [5, 5, 20, 50]}]})

        self.pipeline.process_frame.side_effect = detect
        self.streamer = PreviewStreamer(self.source, self.pipeline, TelemetryStateStore(),
                                        MjpegBroadcaster(), CoordinatorConfig())
        self.streamer.record_frames = False
        self.stream = self.streamer.generate_frames()

    def tearDown(self):
        self.release.set()
        self.stream.close()
        self.streamer.is_running = False
        if self.streamer._producer:
            self.streamer._producer.join(timeout=3)

    def wait_for(self, condition):
        deadline = time.monotonic() + 3
        while not condition() and time.monotonic() < deadline:
            time.sleep(.01)
        self.assertTrue(condition())

    def test_preview_advances_while_detector_is_blocked_and_mailbox_skips_old_frames(self):
        next(self.stream)
        self.assertTrue(self.entered.wait(timeout=2))
        first_index = self.indices[0]
        for _ in range(5):
            self.assertIn(b"image/jpeg", next(self.stream))
        self.assertEqual(len(self.indices), 1)
        self.release.set()
        self.wait_for(lambda: len(self.indices) >= 2)
        self.assertGreater(self.indices[1], first_index + 1)

    def test_frozen_selection_uses_detected_snapshot_and_pauses_capture(self):
        self.release.set()
        next(self.stream)
        self.wait_for(lambda: self.streamer.selection.latest is not None)
        snapshot = self.streamer.selection.freeze(self.pipeline.config)
        self.assertEqual(snapshot["detections"][0]["id"], 7)
        with self.streamer.source_lock:
            count = self.source.read_frame.call_count
        for _ in range(3):
            next(self.stream)
        self.assertEqual(count, self.source.read_frame.call_count)
        self.streamer.selection.cancel(snapshot["token"])

    def test_loop_during_detection_discards_old_snapshot(self):
        next(self.stream)
        self.assertTrue(self.entered.wait(timeout=2))
        self.source.source_identity = "second"
        # Stop subscribers after the old result returns so no new job can publish.
        with self.streamer.source_lock:
            self.streamer._subscribers = 0
        self.release.set()
        self.wait_for(lambda: self.pipeline.process_frame.call_count >= 1)
        with self.streamer.selection.lock:
            self.assertIsNone(self.streamer.selection.latest)
        self.streamer._subscribers = 1

    def test_source_change_rejects_selection_until_a_new_detection_is_available(self):
        self.release.set()
        next(self.stream)
        self.wait_for(lambda: self.streamer.selection.latest is not None)
        with self.streamer.selection.lock, self.streamer.source_lock:
            self.source.source_identity = "replacement"
            with self.assertRaises(HTTPException) as caught:
                self.streamer.selection.freeze(self.pipeline.config)
            self.assertEqual(caught.exception.status_code, 409)

    def test_completed_clip_keeps_the_last_detection_without_more_sampling(self):
        next(self.stream)
        self.assertTrue(self.entered.wait(timeout=2))
        with self.streamer.source_lock:
            self.source.video_finished = True
            reads = self.source.read_frame.call_count
            generation = self.streamer._generation
        self.release.set()
        self.wait_for(lambda: self.streamer.selection.latest is not None)
        for _ in range(3):
            next(self.stream)
        self.assertEqual(self.source.read_frame.call_count, reads)
        self.assertEqual(self.streamer._generation, generation)
        self.assertTrue(self.streamer.telemetry_store.latest["video_finished"])
        snapshot = self.streamer.selection.freeze(self.pipeline.config)
        self.assertEqual(snapshot["detections"][0]["id"], 7)
        self.streamer.selection.cancel(snapshot["token"])

    def test_preview_respects_box_display_setting_and_expires_delayed_boxes(self):
        from app.services.annotation.preview_overlay import draw_preview_boxes
        payload = {"detections": [{"id": 7, "conf": .9, "bbox": [5, 5, 20, 50]}]}
        config = DetectionConfig(show_boxes=False)
        hidden = draw_preview_boxes(self.frame.copy(), ("first", 10, payload), "first", 10.1, config)
        np.testing.assert_array_equal(hidden, self.frame)
        config.show_boxes = True
        expired = draw_preview_boxes(self.frame.copy(), ("first", 10, payload), "first", 100, config)
        np.testing.assert_array_equal(expired, self.frame)
        visible = draw_preview_boxes(self.frame.copy(), ("first", 10, payload), "first", 10.1, config)
        self.assertGreater(np.count_nonzero(visible), 0)


if __name__ == "__main__":
    unittest.main()
