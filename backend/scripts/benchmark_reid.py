"""CPU/CUDA benchmark on prepared person crops; reports ranking, not claimed accuracy.

Example: python scripts/benchmark_reid.py --query-dir crops/ground/person1 --gallery-dir crops/aerial
The gallery contains one subdirectory per person/track. Each directory needs at
least REID_SEQUENCE_LENGTH ordered images. Use --expected-track for a labeled query.
"""
import argparse
import json
import sys
import time
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.core.config import ReIDConfig
from app.services.reid.crops import normalized_embedding
from app.services.reid.worker import ModelWorker


def sequence(directory, settings):
    files = sorted(path for path in directory.iterdir() if path.suffix.lower() in {".jpg", ".jpeg", ".png"})
    if len(files) < settings.sequence_length:
        raise ValueError(f"{directory} needs at least {settings.sequence_length} person crops")
    indices = np.linspace(0, len(files) - 1, settings.sequence_length, dtype=int)
    frames = []
    for index in indices:
        with Image.open(files[index]) as image:
            frames.append(np.asarray(image.convert("RGB").resize(
                (settings.crop_width, settings.crop_height), Image.Resampling.BILINEAR)).copy())
    return frames


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--query-dir", type=Path, required=True)
    parser.add_argument("--gallery-dir", type=Path, required=True)
    parser.add_argument("--expected-track", help="Name of the correct gallery directory, if present")
    args = parser.parse_args()
    settings = ReIDConfig()
    gallery = sorted(path for path in args.gallery_dir.iterdir() if path.is_dir())
    if not gallery:
        parser.error("The gallery must contain person/track subdirectories")
    worker = ModelWorker(settings)
    try:
        started = time.monotonic()
        worker.start()
        load_seconds = time.monotonic() - started
        started = time.monotonic()
        query = normalized_embedding(worker.encode([sequence(args.query_dir, settings)], ["ground"])[0])
        ranked = []
        for offset in range(0, len(gallery), settings.batch_size):
            batch = gallery[offset:offset + settings.batch_size]
            embeddings = worker.encode([sequence(path, settings) for path in batch], ["aerial"] * len(batch))
            ranked.extend({"track": path.name, "similarity": float(query @ normalized_embedding(embedding))}
                          for path, embedding in zip(batch, embeddings))
        ranked.sort(key=lambda item: item["similarity"], reverse=True)
        result = {"load_seconds": load_seconds, "query_and_gallery_seconds": time.monotonic() - started,
                  "gallery_count": len(gallery), "top_candidates": ranked[:settings.top_k]}
        if args.expected_track:
            result["correct_in_top_k"] = any(item["track"] == args.expected_track for item in ranked[:settings.top_k])
        print(json.dumps(result, indent=2))
    finally:
        worker.close()


if __name__ == "__main__":
    main()
