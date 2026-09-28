import unittest
import numpy as np

from app.services.streaming.sources import (
    HttpFrameSource,
    DeviceFrameSource,
    SyntheticFrameSource,
)
from app.services.streaming.source_provider import StreamSourceProvider, StreamSourceConfig


class TestSourceProviders(unittest.TestCase):
    def test_http_endpoint_normalization(self):
        url1 = "http://10.10.20.117:8080"
        src1 = HttpFrameSource(url1)
        self.assertEqual(src1.shot_url, "http://10.10.20.117:8080/shot.jpg")

        url2 = "http://192.168.1.15:8080/video"
        src2 = HttpFrameSource(url2)
        self.assertEqual(src2.shot_url, "http://192.168.1.15:8080/shot.jpg")

        url3 = "http://example.com/snapshot.jpg"
        src3 = HttpFrameSource(url3)
        self.assertEqual(src3.shot_url, "http://example.com/snapshot.jpg")

    def test_synthetic_source(self):
        synth = SyntheticFrameSource(width=640, height=360, num_people=2, frame_interval_seconds=0.0)
        ret, frame = synth.read_frame()
        self.assertTrue(ret)
        self.assertIsNotNone(frame)
        self.assertEqual(frame.shape, (360, 640, 3))

    def test_device_source_invalid(self):
        device = DeviceFrameSource(source_path="non_existent_file.mp4")
        ret, frame = device.read_frame()
        self.assertFalse(ret)
        self.assertIsNone(frame)
        device.release()

    def test_provider_configuration_and_fallback(self):
        config = StreamSourceConfig(
            default_source_type="synthetic",
            simulation_width=640,
            simulation_height=360,
            simulation_frame_interval=0.0
        )
        provider = StreamSourceProvider(config=config)
        self.assertEqual(provider.source_type, "synthetic")
        ret, frame = provider.read_frame()
        self.assertTrue(ret)
        self.assertIsNotNone(frame)

        # Switch to invalid HTTP stream -> Should safely fallback to synthetic frame
        provider.set_source("rtsp", "http://127.0.0.1:9999/dummy")
        ret, frame = provider.read_frame()
        self.assertTrue(ret)
        self.assertIsNotNone(frame)
        provider.close()


if __name__ == "__main__":
    unittest.main()
