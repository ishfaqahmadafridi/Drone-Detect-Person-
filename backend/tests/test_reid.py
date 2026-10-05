"""CPU contract tests. Fake encoders validate orchestration, never model accuracy."""
import threading
import unittest
from dataclasses import replace
from unittest.mock import patch

import numpy as np
from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.core.config import ReIDConfig
from app.services.reid.crops import person_crop
from app.services.reid.service import ReIDService
from app.api.v1.endpoints import reid


class FakeWorker:
    def __init__(self, settings):
        self.calls = 0
        self.closed = False

    def start(self):
        pass

    def encode(self, sequences, channels):
        self.calls += 1
        # Color vectors intentionally make deterministic test fixtures distinguishable.
        return np.array([np.mean(frames, axis=(0, 1, 2)) + 1 for frames in sequences])

    def close(self):
        self.closed = True


class ReIDTests(unittest.TestCase):
    def setUp(self):
        self.settings = ReIDConfig(enabled=True, sequence_length=2, sample_seconds=0.000001,
                                   update_seconds=0.000001, batch_size=8, crop_height=40, crop_width=20)
        self.service = ReIDService(self.settings, FakeWorker, background=False)
        self.frame = np.zeros((80, 200, 3), dtype=np.uint8)
        self.frame[:, :40, 2] = 255
        self.frame[:, 40:80, 1] = 255
        self.frame[:, 80:120, 0] = 255
        self.detections = [{"id": i + 1, "bbox": [40 * i, 0, 40 * (i + 1), 80], "conf": .9}
                           for i in range(3)]

    def tearDown(self):
        self.service.close()

    def feed(self, channel, selected=(), source="file", detections=None):
        for frame_idx in range(self.settings.sequence_length):
            self.service.observe(channel, self.frame, self.detections if detections is None else detections,
                                 frame_idx, source, list(selected))

    def ready(self):
        self.feed("ground", [1])
        self.feed("aerial")
        self.service.process_once()

    def test_ranks_distinct_tracks_and_uses_rgb_clean_crops(self):
        self.ready()
        status = self.service.snapshot()
        self.assertEqual(status.status, "ready")
        candidates = status.targets[0].candidates
        self.assertEqual(candidates[0].track_id, 1)
        self.assertEqual(candidates[0].similarity, 1)
        self.assertEqual(len({item.track_key for item in candidates}), 3)
        crop = self.service._references[1].frames[0]
        self.assertEqual(crop[0, 0].tolist(), [255, 0, 0])
        self.assertTrue(candidates[0].image.startswith("data:image/jpeg;base64,"))

    def test_no_reference_reports_waiting_even_if_model_was_loaded(self):
        self.ready()
        self.service.select([])
        status = self.service.snapshot()
        self.assertEqual(status.status, "idle")
        self.assertEqual(status.targets, [])
        self.assertIn("Select a person", status.message)

    def test_query_is_frozen_and_not_reencoded_when_ground_appearance_changes(self):
        self.ready()
        original = self.service._references[1].embedding.copy()
        self.frame[:] = [255, 255, 255]
        self.feed("ground", [1])
        self.service.process_once()
        np.testing.assert_array_equal(self.service._references[1].embedding, original)
        self.assertEqual(self.service._worker.calls, 1)

    def test_threshold_allows_no_match_and_expiry_hides_old_candidates(self):
        self.service.settings = replace(self.settings, min_similarity=.99)
        self.feed("ground", [1])
        self.feed("aerial", detections=self.detections[1:])
        self.service.process_once()
        self.assertEqual(self.service.snapshot().targets[0].state, "no_match")
        for track in self.service._tracks["aerial"].values():
            track.last_seen = 0
        self.assertEqual(self.service.snapshot().gallery_tracks, 0)
        self.assertEqual(self.service.snapshot().targets[0].state, "searching")

    def test_source_change_clears_aerial_but_preserves_ground_reference(self):
        self.ready()
        self.service.reset_channel("aerial")
        self.assertEqual(len(self.service.snapshot().targets), 1)
        self.assertEqual(self.service.snapshot().targets[0].candidates, [])
        self.service.reset_channel("ground")
        self.assertEqual(self.service.snapshot().targets, [])

    def test_selection_clear_and_synthetic_fallback_remove_matches(self):
        self.ready()
        self.feed("aerial", source="synthetic")
        self.assertEqual(self.service.snapshot().targets[0].candidates, [])
        self.service.select([])
        self.assertEqual(self.service.snapshot().targets, [])

    def test_disabled_never_starts_worker(self):
        service = ReIDService(replace(self.settings, enabled=False), FakeWorker)
        service.observe("ground", self.frame, self.detections, 1, "file", [1])
        self.assertIsNone(service._thread)
        self.assertIsNone(service._worker)
        self.assertEqual(service.snapshot().status, "disabled")

    def test_invalid_tiny_and_low_confidence_crops_are_rejected(self):
        for box in ([0, 0, 3, 8], [50, 20, 0, 0], [0, 0, float("nan"), 80], [0, 0]):
            self.assertIsNone(person_crop(self.frame, {"bbox": box, "conf": .9}, self.settings))
        self.assertIsNone(person_crop(self.frame, {"bbox": [0, 0, 40, 80], "conf": .1}, self.settings))

    def test_inflight_result_cannot_restore_cleared_selection(self):
        entered, release = threading.Event(), threading.Event()

        class BlockingWorker(FakeWorker):
            def encode(self, sequences, channels):
                entered.set()
                release.wait(5)
                return super().encode(sequences, channels)

        self.service._worker_factory = BlockingWorker
        self.feed("ground", [1])
        self.feed("aerial")
        thread = threading.Thread(target=self.service.process_once)
        thread.start()
        self.assertTrue(entered.wait(5))
        self.service.select([])
        release.set()
        thread.join(5)
        self.assertFalse(thread.is_alive())
        self.assertEqual(self.service.snapshot().targets, [])

    def test_model_failure_visible_and_retry_does_not_need_stream_restart(self):
        class BrokenWorker(FakeWorker):
            def start(self):
                raise RuntimeError("checkpoint missing")

        self.service._worker_factory = BrokenWorker
        self.feed("ground", [1])
        with self.assertLogs("app.services.reid.service", level="ERROR"):
            self.service.process_once()
        self.assertEqual(self.service.snapshot().status, "error")
        self.assertIn("checkpoint missing", self.service.snapshot().message)
        self.service._worker_factory = FakeWorker
        self.service.retry()
        self.service.process_once()
        self.assertEqual(self.service.snapshot().status, "ready")

    def test_reused_id_does_not_fill_old_incomplete_reference(self):
        self.service.observe("ground", self.frame, self.detections, 1, "file", [1])
        old_key = self.service._references[1].origin_key
        self.service._tracks["ground"][1].last_seen = 0
        self.feed("ground", [1])
        self.assertNotEqual(self.service._tracks["ground"][1].key, old_key)
        self.assertEqual(len(self.service._references[1].frames), 1)

    def test_api_contract_and_retry(self):
        app = FastAPI()
        app.include_router(reid.router)
        with patch.object(reid, "reid_service", self.service), TestClient(app) as client:
            self.ready()
            response = client.get("/reid/status")
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["targets"][0]["candidates"][0]["rank"], 1)
            self.assertEqual(client.post("/reid/retry").status_code, 200)

    def test_frozen_reference_survives_operator_delay(self):
        self.feed("ground")
        self.service.freeze_ground()
        for track in self.service._tracks["ground"].values():
            track.last_seen = 0
        self.assertEqual(self.service.snapshot().targets, [])
        self.assertEqual(self.service._tracks["ground"], {})
        self.service.select([1])
        self.assertEqual(len(self.service._references[1].frames), self.settings.sequence_length)
        self.assertEqual(self.service._frozen_ground, {})

    def test_selection_limit_applies_when_adding_lower_ids(self):
        self.service.settings = replace(self.settings, max_targets=2)
        self.service.select([3])
        self.service.select([1, 2, 3])
        self.assertEqual(set(self.service._references), {1, 2})
        self.assertIn("first 2", self.service.snapshot().message)

    def test_top_four_cap_and_buffer_capacity(self):
        self.service.settings = replace(self.settings, max_tracks=5)
        detections = [{**self.detections[0], "id": pid} for pid in range(1, 8)]
        self.feed("ground", [1])
        self.feed("aerial", detections=detections)
        self.service.process_once()
        status = self.service.snapshot()
        self.assertEqual(status.gallery_tracks, 5)
        self.assertEqual(len(status.targets[0].candidates), 4)

    def test_encoder_preprocessing_matches_upstream_evaluation(self):
        import torch
        from app.services.reid.encoder import XTFCLIPEncoder
        calls = []

        def model(tensor, cam_label):
            calls.append((tensor.clone(), cam_label.clone()))
            return torch.tensor([[3., 4.]])

        # Exercise actual preprocessing/flip/normalization on CPU, without model weights.
        encoder = XTFCLIPEncoder.__new__(XTFCLIPEncoder)
        encoder.torch, encoder.device, encoder.model = torch, torch.device("cpu"), model
        encoder.settings = replace(self.settings, ground_camera_id=2, aerial_camera_id=0)
        from app.core.constants import XTFCLIP_PIXEL_MEAN, XTFCLIP_PIXEL_STD
        encoder.mean = torch.tensor(XTFCLIP_PIXEL_MEAN).view(1, 1, 3, 1, 1)
        encoder.std = torch.tensor(XTFCLIP_PIXEL_STD).view(1, 1, 3, 1, 1)
        frames = [np.full((40, 20, 3), [255, 0, 0], dtype=np.uint8) for _ in range(2)]
        result = encoder.encode([frames], ["ground"])
        self.assertEqual(tuple(calls[0][0].shape), (1, 2, 3, 40, 20))
        self.assertEqual(calls[0][1].item(), 2)
        self.assertEqual(len(calls), 2)
        self.assertAlmostEqual(calls[0][0][0, 0, 0, 0, 0].item(), (1 - .485) / .229, places=5)
        np.testing.assert_allclose(result, [[.6, .8]], atol=1e-6)

    def test_cpu_worker_reports_missing_checkpoint_and_shuts_down(self):
        from app.services.reid.worker import ModelWorker
        worker = ModelWorker(replace(self.settings, device="cpu", checkpoint="missing-test-checkpoint.pth",
                                     worker_timeout_seconds=30))
        try:
            with self.assertRaisesRegex(RuntimeError, "(?:checkpoint|source) missing"):
                worker.start()
            process = worker.process
        finally:
            worker.close()
        self.assertFalse(process.is_alive())


if __name__ == "__main__":
    unittest.main()
