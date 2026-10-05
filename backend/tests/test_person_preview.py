import unittest
from unittest.mock import patch
import numpy as np
from app.core.config import DetectionConfig
from app.core.constants import AlertLevel
from app.services.alert.state_evaluator import ThreatStateEvaluator
from app.services.streaming.sources.playback_clock import VideoPlaybackClock
from app.services.streaming.pipeline_processor.stages.frame_normalizer import FrameNormalizer
from app.services.streaming.telemetry_formatter import TelemetryFormatter


class TestPersonPreview(unittest.TestCase):
    def test_slow_inference_skips_to_current_video_time(self):
        clock = VideoPlaybackClock(25, 250, mode="realtime")
        with patch("app.services.streaming.sources.playback_clock.time.monotonic", return_value=100.0):
            self.assertEqual(clock.next_index(), 0)
        with patch("app.services.streaming.sources.playback_clock.time.monotonic", return_value=100.4):
            self.assertEqual(clock.next_index(), 10)

    def test_freezing_does_not_advance_video(self):
        clock = VideoPlaybackClock(25, 250)
        with patch("app.services.streaming.sources.playback_clock.time.monotonic", return_value=100.0):
            clock.next_index()
        with patch("app.services.streaming.sources.playback_clock.time.monotonic", return_value=100.1):
            clock.pause()
        with patch("app.services.streaming.sources.playback_clock.time.monotonic", return_value=160.1):
            self.assertLessEqual(clock.next_index(), 3)

    def test_sequential_playback_does_not_skip_slow_cpu_frames(self):
        clock = VideoPlaybackClock(25, 250, mode="sequential")
        with patch("app.services.streaming.sources.playback_clock.time.monotonic", return_value=100.0):
            self.assertEqual(clock.next_index(), 0)
        with patch("app.services.streaming.sources.playback_clock.time.monotonic", return_value=105.0):
            self.assertEqual(clock.next_index(), 1)

    def test_large_portrait_frames_keep_aspect_ratio(self):
        frame = np.zeros((4096, 2160, 3), dtype=np.uint8)
        valid, normalized, height, width = FrameNormalizer.validate_and_normalize(frame)
        self.assertTrue(valid)
        self.assertEqual(height, 1280)
        self.assertAlmostEqual(width / height, 2160 / 4096, places=2)
        self.assertEqual(normalized.shape[:2], (height, width))

    def test_many_people_are_not_an_alert(self):
        people = [{"id": i} for i in range(10)]
        level, _, details = ThreatStateEvaluator().evaluate(people, [])
        self.assertEqual(level, AlertLevel.MONITORING)
        self.assertEqual(details["total_persons"], 10)
        self.assertFalse(DetectionConfig().show_track_trails)


if __name__ == "__main__":
    unittest.main()
