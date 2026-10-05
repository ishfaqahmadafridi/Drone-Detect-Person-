"""
Unit Tests for Multi-View Model Selection, Checksum Integrity, and Tracker Resets.
"""

import hashlib
import io
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import Mock, patch

import numpy as np

from app.core.config import DetectionConfig
from app.services.detector import DronePersonDetectorService
from app.services.inference import MultiViewInferenceService
from scripts.download_models import download_file


class TestModelSelection(unittest.TestCase):
    def setUp(self):
        storage = tempfile.TemporaryDirectory()
        self.addCleanup(storage.cleanup)
        self.models_dir = Path(storage.name)

        # Patch MODELS_DIR across inference modules
        self.enterContext(patch("app.services.inference.profiles.MODELS_DIR", self.models_dir))
        self.enterContext(patch("app.services.inference.dispatcher.MODELS_DIR", self.models_dir))

        self.service = MultiViewInferenceService()
        for view, profile in self.service.profiles.items():
            content = f"test checkpoint: {view}".encode()
            (self.models_dir / profile["filename"]).write_bytes(content)
            profile["sha256"] = hashlib.sha256(content).hexdigest()
            profile["size_bytes"] = len(content)

        self.enterContext(patch("app.services.detector.detector.inference_service", self.service))
        self.enterContext(patch("app.services.inference_service", self.service))
        self.tracking = self.enterContext(patch("app.services.detector.detector.tracking_service"))
        self.yolo = self.enterContext(patch("ultralytics.YOLO", side_effect=self.make_model))

    @staticmethod
    def make_model(path):
        model = Mock()
        model.names = {0: "person"}
        model.predictor = SimpleNamespace(trackers=[Mock()])
        model.track.return_value = []
        model.predict.return_value = []
        return model

    def test_exact_checkpoints_are_distinct_and_cached(self):
        aerial = self.service.get_model("aerial")
        ground = self.service.get_model("ground")
        self.assertIsNot(aerial, ground)
        self.assertIs(aerial, self.service.get_model("aerial"))
        self.assertEqual(self.yolo.call_count, 2)
        paths = [Path(call.args[0]).name for call in self.yolo.call_args_list]
        self.assertEqual(paths, ["visdrone_person_best.pt", "mot20_yolo26s_pedestrian.pt"])

    def test_missing_checkpoint_never_falls_back(self):
        (self.models_dir / self.service.get_profile("ground")["filename"]).unlink()
        with self.assertRaisesRegex(FileNotFoundError, "download_models.py --view ground"):
            self.service.set_active_view("ground", preload=True)
        self.assertEqual(self.service.active_view, "aerial")
        self.yolo.assert_not_called()

    def test_modified_checkpoint_is_rejected_before_loading(self):
        (self.models_dir / self.service.get_profile("ground")["filename"]).write_bytes(b"wrong weights")
        with self.assertRaisesRegex(ValueError, "Checksum mismatch"):
            self.service.get_model("ground")
        self.yolo.assert_not_called()

    def test_unexpected_class_mapping_is_rejected(self):
        model = self.make_model(None)
        model.names = {0: "car"}
        self.yolo.side_effect = None
        self.yolo.return_value = model
        with self.assertRaisesRegex(ValueError, "class mapping"):
            self.service.get_model("aerial")
        self.assertNotIn("aerial", self.service.models)

    def test_view_switch_updates_inference_and_resets_tracking(self):
        detector = DronePersonDetectorService()
        frame = np.zeros((32, 32, 3), dtype=np.uint8)
        aerial = detector.model
        detector.process_frame(frame)
        aerial_options = aerial.track.call_args.kwargs
        self.assertEqual(aerial_options["tracker"], "bytetrack.yaml")
        self.assertEqual(aerial_options["classes"], [0])
        self.assertEqual(aerial_options["imgsz"], 640)
        self.assertEqual(aerial_options["iou"], 0.45)
        detector.config.confidence_threshold = 0.42
        detector.process_frame(frame, use_tracking=False)
        self.assertEqual(aerial.predict.call_args.kwargs["conf"], 0.42)
        detector.track_history[7].append((10, 10))

        detector.set_view("ground")
        ground = detector.model
        detector.process_frame(frame)
        ground_options = ground.track.call_args.kwargs
        self.assertEqual(ground_options["tracker"], "bytetrack.yaml")
        self.assertEqual(ground_options["classes"], [0])
        self.assertEqual(ground_options["imgsz"], 640)
        self.assertEqual(ground_options["conf"], 0.25)
        self.assertEqual(ground_options["iou"], 0.50)
        self.assertEqual(detector.config.model_name, "mot20_yolo26s_pedestrian.pt")
        self.assertEqual(detector.engine, "YOLO26s + ByteTrack")
        self.assertFalse(detector.track_history)
        self.tracking.reset.assert_called_once()

        detector.set_view("aerial")
        self.assertIs(detector.model, aerial)
        for model in (aerial, ground):
            self.assertEqual(model.predictor.trackers[0].reset.call_count, 2)

    def test_failed_switch_keeps_current_detector_and_settings(self):
        detector = DronePersonDetectorService()
        previous_model = detector.model
        previous_config = vars(detector.config).copy()
        (self.models_dir / self.service.get_profile("ground")["filename"]).unlink()
        with self.assertRaises(FileNotFoundError):
            detector.set_view("ground")
        self.assertIs(detector.model, previous_model)
        self.assertEqual(detector.active_view, "aerial")
        self.assertEqual(vars(detector.config), previous_config)

    def test_explicit_inference_overrides_are_honored(self):
        config = DetectionConfig(view_mode="ground", img_size=640, confidence_threshold=0.4)
        detector = DronePersonDetectorService(config)
        detector.process_frame(np.zeros((32, 32, 3), dtype=np.uint8))
        self.assertEqual(detector.model.track.call_args.kwargs["imgsz"], 640)
        self.assertEqual(detector.model.track.call_args.kwargs["conf"], 0.4)

    def test_failed_download_preserves_existing_checkpoint(self):
        profile = self.service.get_profile("ground")
        destination = self.models_dir / profile["filename"]
        original = destination.read_bytes()
        with patch("urllib.request.urlopen", return_value=io.BytesIO(b"incomplete")):
            with self.assertRaisesRegex(ValueError, "failed verification"):
                download_file(profile, destination)
        self.assertEqual(destination.read_bytes(), original)
        self.assertFalse(destination.with_suffix(".download").exists())


if __name__ == "__main__":
    unittest.main()
