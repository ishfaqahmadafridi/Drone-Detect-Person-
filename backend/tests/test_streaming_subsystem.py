import unittest
import numpy as np

from app.services.streaming.source_provider import StreamSourceProvider
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.stream_service import stream_service, StreamManagerService

class TestStreamingSubsystem(unittest.TestCase):
    def test_telemetry_state_store(self):
        store = TelemetryStateStore()
        initial = store.latest
        self.assertEqual(initial["threat_level"], "CLEAR")

        store.update(threat_level="INTRUSION", total_persons=3)
        updated = store.latest
        self.assertEqual(updated["threat_level"], "INTRUSION")
        self.assertEqual(updated["total_persons"], 3)

    def test_mjpeg_broadcaster(self):
        broadcaster = MjpegBroadcaster(jpeg_quality=75)
        # Create dummy BGR image
        test_frame = np.zeros((100, 100, 3), dtype=np.uint8)
        encoded = broadcaster.encode_frame(test_frame)
        self.assertIsNotNone(encoded)
        self.assertTrue(len(encoded) > 0)

        chunk = broadcaster.format_mjpeg_chunk(encoded)
        self.assertTrue(chunk.startswith(b"--frame\r\n"))
        self.assertIn(b"Content-Type: image/jpeg\r\n\r\n", chunk)

    def test_source_provider_fallback(self):
        provider = StreamSourceProvider(default_source_type="synthetic")
        self.assertEqual(provider.source_type, "synthetic")

        ret, frame = provider.read_frame()
        self.assertTrue(ret)
        self.assertIsNotNone(frame)
        self.assertEqual(len(frame.shape), 3)

        # Switch to non-existent webcam and verify safe fallback
        provider.set_source("webcam", "999")
        self.assertEqual(provider.source_type, "webcam")
        provider.close()

    def test_stream_manager_service_facade(self):
        self.assertIsInstance(stream_service, StreamManagerService)
        stream_service.update_config(conf_thresh=0.5)
        self.assertEqual(stream_service.config.confidence_threshold, 0.5)

if __name__ == "__main__":
    unittest.main()
