"""Completed clips hold their identity until explicit replay, even with slow inference."""
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

import cv2
import numpy as np
from app.services.streaming.sources.device_source import DeviceFrameSource


class VideoEndTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.path = Path(self.directory.name) / "short.mp4"
        writer = cv2.VideoWriter(str(self.path), cv2.VideoWriter_fourcc(*"mp4v"), 25, (40, 40))
        self.assertTrue(writer.isOpened())
        for value in (30, 90, 180):
            writer.write(np.full((40, 40, 3), value, dtype=np.uint8))
        writer.release()

    def source(self, behavior):
        source = DeviceFrameSource(str(self.path), end_behavior=behavior)
        self.addCleanup(source.release)
        clock = Mock(frame_count=3, last_index=-1)

        def next_index():
            clock.last_index += 1
            return clock.last_index % 3

        clock.next_index.side_effect = next_index
        source._playback_clock = clock
        return source

    def test_hold_keeps_last_frame_and_does_not_reset_identity(self):
        source = self.source("hold")
        frames = [source.read_frame()[1] for _ in range(3)]
        self.assertTrue(source.finished)
        self.assertEqual(source.playback_epoch, 0)
        for _ in range(5):
            ok, held = source.read_frame()
            self.assertTrue(ok)
            np.testing.assert_array_equal(held, frames[-1])
        self.assertEqual(source._playback_clock.next_index.call_count, 3)

    def test_loop_remains_available_and_changes_identity(self):
        source = self.source("loop")
        first = source.read_frame()[1]
        source.read_frame()
        source.read_frame()
        repeated = source.read_frame()[1]
        self.assertFalse(source.finished)
        self.assertEqual(source.playback_epoch, 1)
        np.testing.assert_array_equal(first, repeated)

    def test_network_stream_is_not_treated_as_a_completed_file(self):
        with patch.object(DeviceFrameSource, "_open"):
            source = DeviceFrameSource("http://camera.local/video")
        self.assertFalse(source._is_video_file)
        self.assertIsNone(source._playback_clock)


if __name__ == "__main__":
    unittest.main()
