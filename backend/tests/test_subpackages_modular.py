"""
Tests for Modular Service Subpackages and Legacy Alias Exports.
Validates clean decoupling and backward compatibility across all modules.
"""

import unittest
import numpy as np

# Subpackage imports
from app.services.detector import FPSProfiler, DronePersonDetectorService
from app.services.tracking import TargetTrackerService, tracking_service
from app.services.zone import (
    normalized_to_pixel_polygon,
    is_point_in_polygon,
    compute_proximity_gatherings,
    ZoneMonitorService
)
from app.services.inference import (
    DEFAULT_PROFILES,
    load_inference_profiles,
    MultiViewInferenceService,
    inference_service
)
from app.services.annotation import (
    TacticalAnnotationTheme,
    TacticalFrameAnnotator,
    draw_zone_polygon,
    draw_proximity_lines,
    draw_detections_and_trails,
    draw_hud_banner
)

# Backward-compatible legacy package imports
from legacy import alert_manager, config, detector, zone_monitor



class TestModularSubpackages(unittest.TestCase):
    def test_detector_subpackage(self):
        profiler = FPSProfiler(window_seconds=0.1)
        fps = profiler.tick()
        self.assertIsInstance(fps, float)
        self.assertTrue(hasattr(DronePersonDetectorService, "process_frame"))

    def test_tracking_subpackage(self):
        tracker = TargetTrackerService(max_trajectory_points=10)
        tracks = tracker.update_tracks([{"id": 1, "center": (100, 100), "bbox": [90, 80, 110, 120]}])
        self.assertEqual(len(tracks), 1)
        self.assertIn("trajectory", tracks[0])
        self.assertIn("speed_px_s", tracks[0])

    def test_zone_subpackage(self):
        norm_pts = [(0.0, 0.0), (1.0, 0.0), (1.0, 1.0), (0.0, 1.0)]
        pixel_poly = normalized_to_pixel_polygon(norm_pts, 100, 100)
        self.assertEqual(len(pixel_poly), 4)

        inside = is_point_in_polygon((50, 50), pixel_poly)
        outside = is_point_in_polygon((150, 150), pixel_poly)
        self.assertTrue(inside)
        self.assertFalse(outside)

        persons = [
            {"id": 1, "center": (50, 50)},
            {"id": 2, "center": (60, 60)}
        ]
        gatherings, clustered_ids = compute_proximity_gatherings(persons, proximity_threshold_px=100)
        self.assertEqual(len(gatherings), 1)
        self.assertEqual(set(clustered_ids), {1, 2})

    def test_inference_subpackage(self):
        profiles = load_inference_profiles()
        self.assertIn("aerial", profiles)
        self.assertIn("ground", profiles)
        status = inference_service.get_status()
        self.assertIn("active_view", status)
        self.assertIn("profiles", status)

    def test_annotation_subpackage(self):
        theme = TacticalAnnotationTheme()
        self.assertEqual(theme.HUD_HEIGHT_PX, 36)
        annotator = TacticalFrameAnnotator(theme=theme)
        frame = np.zeros((200, 200, 3), dtype=np.uint8)
        annotated = annotator.draw_annotations(
            frame=frame,
            detected_persons=[],
            intruders=[],
            gatherings=[],
            clustered_ids=[],
            zone_polygon=None,
            threat_level="CLEAR",
            alert_msg="ALL CLEAR"
        )
        self.assertEqual(annotated.shape, (200, 200, 3))

    def test_recording_subpackage(self):
        from app.services.recording import (
            PreRollBuffer,
            VideoCodecNegotiator,
            CompanionThumbnailGenerator,
            VideoContainerWriter,
            RecordingSession,
            ClipCaptureWorker,
            RecordingFinalizer,
            RecorderPipeline,
            VideoClipRecorder,
            video_recorder,
        )
        self.assertTrue(callable(VideoCodecNegotiator.create_writer))
        self.assertTrue(callable(CompanionThumbnailGenerator.generate))
        self.assertTrue(hasattr(RecordingSession, "start"))
        self.assertTrue(hasattr(ClipCaptureWorker, "spawn_clip_task"))
        self.assertTrue(hasattr(RecordingFinalizer, "commit_evidence_record"))
        self.assertTrue(hasattr(RecorderPipeline, "dispatch_frame"))
        self.assertTrue(hasattr(VideoClipRecorder, "push_frame"))
        self.assertIsNotNone(video_recorder)

    def test_root_legacy_aliases(self):
        self.assertTrue(hasattr(alert_manager, "AlertManager"))
        self.assertTrue(hasattr(config, "DetectionConfig"))
        self.assertTrue(hasattr(detector, "DronePersonDetector"))
        self.assertTrue(hasattr(zone_monitor, "ZoneMonitor"))

    def test_cli_subpackage(self):
        from app.cli import (
            build_cli_parser,
            resolve_video_source,
            CLIDetectionExecutor,
            CLIReporter,
            run_cli_detection,
            main,
        )
        parser = build_cli_parser()
        args = parser.parse_args(["--source", "test.mp4", "--conf", "0.45", "--headless"])
        self.assertEqual(args.source, "test.mp4")
        self.assertEqual(args.conf, 0.45)
        self.assertTrue(args.headless)
        self.assertTrue(callable(resolve_video_source))
        self.assertTrue(callable(run_cli_detection))
        self.assertTrue(callable(main))
        executor = CLIDetectionExecutor(source="synthetic", confidence=0.45)
        self.assertEqual(executor.confidence, 0.45)
        self.assertTrue(hasattr(CLIReporter, "print_header"))
        self.assertTrue(hasattr(CLIReporter, "print_alert_event"))
        self.assertTrue(hasattr(CLIReporter, "print_summary"))

    def test_inference_modular_subcomponents(self):
        from app.services.inference import ModelWeightLoader, InferenceStatusReporter
        from pathlib import Path
        self.assertTrue(hasattr(ModelWeightLoader, "verify_and_load"))
        status = InferenceStatusReporter.build_status(
            profiles={"aerial": {"name": "Test", "filename": "test.pt", "confidence": 0.3, "iou": 0.4}},
            loaded_models={},
            active_view="aerial",
            device="cpu",
            models_dir=Path("/tmp")
        )
        self.assertEqual(status["active_view"], "aerial")
        self.assertIn("aerial", status["profiles"])

    def test_coordinator_modular_subcomponents(self):
        from app.services.streaming.coordinator import (
            PerspectiveController,
            DroneFlightController,
            StreamManagerService,
            TargetTrackingManager
        )
        self.assertTrue(hasattr(PerspectiveController, "set_view_mode"))
        self.assertTrue(hasattr(DroneFlightController, "execute_command"))
        self.assertTrue(hasattr(StreamManagerService, "set_view_mode"))
        self.assertTrue(hasattr(TargetTrackingManager, "set_tracking_mode"))

    def test_pipeline_processor_stages_modular(self):
        from app.services.streaming.pipeline_processor.stages import (
            FrameNormalizer,
            TargetingModeEvaluator
        )
        from app.core.config import DetectionConfig
        # Test FrameNormalizer
        is_valid, norm_frame, h, w = FrameNormalizer.validate_and_normalize(np.zeros((64, 64), dtype=np.uint8))
        self.assertTrue(is_valid)
        self.assertEqual(norm_frame.shape, (64, 64, 3))
        self.assertEqual(h, 64)
        self.assertEqual(w, 64)

        # Test TargetingModeEvaluator
        cfg = DetectionConfig(tracking_mode="manual", selected_target_ids=[1, 2])
        threat, msg, mode, ids = TargetingModeEvaluator.evaluate_mode(cfg, "CLEAR", "ALL CLEAR")
        self.assertEqual(threat, "MANUAL")
        self.assertIn("2 TARGETS LOCKED", msg)
        self.assertEqual(mode, "manual")
        self.assertEqual(ids, [1, 2])


if __name__ == "__main__":
    unittest.main()

