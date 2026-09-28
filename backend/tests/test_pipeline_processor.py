import unittest
import numpy as np

from app.core.config import DetectionConfig
from app.services.streaming.pipeline_processor import VisionPipelineProcessor, PipelineResult
from app.services.streaming.stream_coordinator import StreamManagerService, CoordinatorConfig


class TestPipelineProcessor(unittest.TestCase):
    def test_pipeline_processor_execution(self):
        cfg = DetectionConfig()
        processor = VisionPipelineProcessor(config=cfg)

        test_frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        result = processor.process_frame(test_frame, frame_idx=1, source_type="synthetic")

        self.assertIsInstance(result, PipelineResult)
        self.assertEqual(result.annotated_frame.shape, test_frame.shape)
        self.assertIn("threat_level", result.telemetry_payload)
        self.assertIn("total_persons", result.telemetry_payload)
        self.assertIn("fps", result.telemetry_payload)
        self.assertIn("avionics", result.telemetry_payload)

    def test_pipeline_processor_config_and_view(self):
        processor = VisionPipelineProcessor()
        processor.update_config(multi_person_thresh=5, conf_thresh=0.6)
        self.assertEqual(processor.config.multi_person_threshold, 5)
        self.assertEqual(processor.config.confidence_threshold, 0.6)

        active_view = processor.set_view("ground")
        self.assertEqual(active_view, "ground")

    def test_stream_manager_service_coordination(self):
        coord_cfg = CoordinatorConfig(
            jpeg_quality=75,
            no_frame_retry_sleep_seconds=0.01,
            frame_rate_throttle_seconds=0.0
        )
        service = StreamManagerService(coordinator_config=coord_cfg)
        self.assertEqual(service.coordinator_config.jpeg_quality, 75)
        self.assertEqual(service.source_type, "synthetic")

        # Test single frame generation step
        frame_gen = service.generate_frames()
        first_chunk = next(frame_gen)
        self.assertTrue(first_chunk.startswith(b"--frame\r\n"))
        self.assertIn(b"Content-Type: image/jpeg\r\n\r\n", first_chunk)
        service.is_running = False

    def test_pipeline_processor_defensive_empty_frame(self):
        processor = VisionPipelineProcessor()
        # Test None frame
        result_none = processor.process_frame(None, frame_idx=0)
        self.assertIsInstance(result_none, PipelineResult)
        self.assertEqual(result_none.threat_level, "CLEAR")

        # Test empty frame buffer
        empty_frame = np.zeros((0,), dtype=np.uint8)
        result_empty = processor.process_frame(empty_frame, frame_idx=0)
        self.assertIsInstance(result_empty, PipelineResult)
        self.assertEqual(result_empty.threat_level, "CLEAR")

    def test_telemetry_formatter_sanitization(self):
        from app.services.streaming.telemetry_formatter import TelemetryFormatter
        raw_detections = [
            {"id": 1, "conf": "0.854", "bbox": [10, 20, 30, 40], "speed_px_s": 5.43, "trajectory": [(10, 10)], "is_intruder": True},
            {"id": 2, "conf": 0.92, "bbox": [50, 60, 70, 80]}
        ]
        sanitized = TelemetryFormatter.format_detections(raw_detections)
        self.assertEqual(len(sanitized), 2)
        self.assertEqual(sanitized[0]["conf"], 0.85)
        self.assertTrue(sanitized[0]["is_intruder"])
        self.assertEqual(sanitized[1]["speed_px_s"], 0.0)
        self.assertFalse(sanitized[1]["is_intruder"])


if __name__ == "__main__":
    unittest.main()
