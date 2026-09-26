"""The two explicitly selected detection checkpoints; no automatic fallback model."""

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"
PROFILES = json.loads((MODEL_DIR / "registry.json").read_text(encoding="utf-8"))


def profile_for(view: str) -> dict:
    if view not in PROFILES:
        raise ValueError("View must be 'ground' or 'aerial'.")
    return dict(PROFILES[view])


def weights_for(view: str, verify: bool = True) -> Path:
    profile = profile_for(view)
    path = MODEL_DIR / profile["filename"]
    if not path.is_file():
        raise FileNotFoundError(f"Missing {view} weights. Run: python scripts/download_models.py")
    if verify and profile.get("sha256"):
        checksum = hashlib.sha256()
        with path.open("rb") as file:
            for chunk in iter(lambda: file.read(1024 * 1024), b""):
                checksum.update(chunk)
        if checksum.hexdigest() != profile["sha256"]:
            raise ValueError(f"Checksum mismatch for {path.name}; download the verified checkpoint again.")
    return path
