"""Download the two user-selected checkpoints into models/, with provenance."""

import hashlib
import json
import os
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from model_registry import MODEL_DIR, PROFILES


def download(view: str, profile: dict) -> dict:
    MODEL_DIR.mkdir(exist_ok=True)
    destination = MODEL_DIR / profile["filename"]
    if destination.exists():
        existing_hash = hashlib.sha256(destination.read_bytes()).hexdigest()
        if profile.get("sha256") and existing_hash == profile["sha256"]:
            print(f"{view}: verified existing checkpoint", flush=True)
            return {"sha256": existing_hash, "bytes": destination.stat().st_size, "file": destination.name, "url": profile["download_url"]}
    partial = destination.with_suffix(".partial")
    request = urllib.request.Request(profile["download_url"], headers={"User-Agent": "BirdsEye-FYP/0.2"})
    digest = hashlib.sha256()
    size = 0
    try:
        with urllib.request.urlopen(request, timeout=120) as response, partial.open("wb") as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
                digest.update(chunk)
                size += len(chunk)
        if size < 100_000 or partial.read_bytes()[:2] != b"PK":
            raise ValueError(f"{view}: download is not a PyTorch checkpoint archive")
        checksum = digest.hexdigest()
        if profile.get("sha256") and checksum != profile["sha256"]:
            raise ValueError(f"{view}: downloaded checkpoint checksum does not match the registry")
        os.replace(partial, destination)
    finally:
        partial.unlink(missing_ok=True)
    print(f"{view}: {size:,} bytes, SHA256 {checksum}", flush=True)
    return {"sha256": checksum, "bytes": size, "file": destination.name, "url": profile["download_url"]}


if __name__ == "__main__":
    manifest = {"downloaded_at": datetime.now(timezone.utc).isoformat(), "models": {}}
    for view, profile in PROFILES.items():
        manifest["models"][view] = download(view, profile)
    (MODEL_DIR / "downloads.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
