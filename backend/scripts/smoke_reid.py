"""Run the real pretrained model on deterministic test inputs, not an accuracy test."""
import argparse
import json
import sys
import time
from dataclasses import replace
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.core.config import ReIDConfig
from app.services.reid.worker import ModelWorker
from app.services.reid.assets import sha256
from app.services.reid.service import ReIDService


def pipeline_smoke(settings, sequence):
    """Exercise clean crops, freeze/select, real inference, ranking and reset."""
    settings = replace(settings, enabled=True, sample_seconds=1e-9,
                       update_seconds=1e-9, min_similarity=-1)
    service = ReIDService(settings, background=False)
    try:
        for index, rgb in enumerate(sequence):
            frame = rgb[:, :, ::-1].copy()
            for channel, track_id in (("ground", 101), ("aerial", 201)):
                detection = {"id": track_id, "conf": 1.0,
                             "bbox": [0, 0, settings.crop_width, settings.crop_height]}
                service.observe(channel, frame, [detection], index, "file", [])
        service.freeze_ground()
        service.select([101])
        # There are two sequences; batch size 1 needs two scheduler passes.
        for _ in range(2):
            service.process_once()
        status = service.snapshot()
        if status.status != "ready" or len(status.targets) != 1:
            raise RuntimeError(f"Pipeline did not become ready: {status.message}")
        target = status.targets[0]
        if target.state != "candidates" or len(target.candidates) != 1:
            raise RuntimeError("Pipeline did not retrieve the aerial track")
        candidate = target.candidates[0]
        if candidate.track_id != 201 or not candidate.image or not target.image:
            raise RuntimeError("Pipeline returned invalid track evidence")
        service.reset_channel("aerial")
        if service.snapshot().targets[0].candidates:
            raise RuntimeError("Aerial reset retained stale candidates")
        service.reset_channel("ground")
        if service.snapshot().targets:
            raise RuntimeError("Ground reset retained a stale reference")
        return {"passed": True, "reference_samples": target.samples,
                "candidate_track_id": candidate.track_id,
                "similarity": candidate.similarity, "source_reset_passed": True}
    finally:
        service.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--report", type=Path)
    parser.add_argument("--pipeline", action="store_true",
                        help="Also verify crop collection, selection, ranking and source reset with the real model")
    args = parser.parse_args()
    settings = replace(ReIDConfig(), device=args.device)
    rng = np.random.default_rng(42)
    sequence = rng.integers(0, 256, size=(settings.sequence_length, settings.crop_height,
                                        settings.crop_width, 3), dtype=np.uint8)
    worker = ModelWorker(settings)
    try:
        started = time.monotonic()
        worker.start()
        load_seconds = time.monotonic() - started
        embeddings, elapsed = [], []
        for channel in ("ground", "aerial"):
            started = time.monotonic()
            output = worker.encode([sequence], [channel])
            elapsed.append(time.monotonic() - started)
            if output.ndim != 2 or output.shape[0] != 1 or not np.isfinite(output).all():
                raise RuntimeError("Invalid real-model output")
            if not np.allclose(np.linalg.norm(output, axis=1), 1, atol=1e-5):
                raise RuntimeError("Embeddings are not normalized")
            embeddings.append(output[0])
        import torch
        report = {"passed": True, "device": args.device, "torch": torch.__version__,
                  "checkpoint_sha256": sha256(settings.checkpoint), "camera_mode": settings.camera_mode,
                  "load_seconds": load_seconds, "sequence_seconds": elapsed,
                  "embedding_dimensions": int(embeddings[0].size),
                  "note": "Real trained weights; deterministic artificial inputs. This does not measure person matching accuracy."}
        # Release the first model before allocating a second pipeline worker.
        worker.close()
        if args.pipeline:
            report["pipeline"] = pipeline_smoke(settings, sequence)
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report, indent=2))
    finally:
        worker.close()


if __name__ == "__main__":
    main()
