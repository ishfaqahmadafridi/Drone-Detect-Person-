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


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--device", default="cpu")
    parser.add_argument("--report", type=Path)
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
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report, indent=2))
    finally:
        worker.close()


if __name__ == "__main__":
    main()
