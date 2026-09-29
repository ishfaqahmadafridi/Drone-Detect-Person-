#!/usr/bin/env python3
"""Download the exact checkpoints pinned in models/registry.json."""

import argparse
import hashlib
import json
import urllib.request
from pathlib import Path

MODELS_DIR = Path(__file__).resolve().parent.parent / "models"
REGISTRY_FILE = MODELS_DIR / "registry.json"


def verify_file(path: Path, profile: dict) -> bool:
    if not path.is_file() or path.stat().st_size != profile["size_bytes"]:
        return False
    with path.open("rb") as checkpoint:
        return hashlib.file_digest(checkpoint, "sha256").hexdigest() == profile["sha256"]


def download_file(profile: dict, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    temporary = dest.with_suffix(".download")
    request = urllib.request.Request(
        profile["download_url"], headers={"User-Agent": "Drone-Detect-Person/model-setup"}
    )
    print(f"[INFO] Downloading {dest.name}...")
    try:
        with urllib.request.urlopen(request, timeout=90) as response, temporary.open("wb") as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
        if not verify_file(temporary, profile):
            raise ValueError(f"Downloaded checkpoint failed verification: {dest.name}")
        temporary.replace(dest)
        print(f"[OK] Downloaded and verified: {dest.name}")
    finally:
        temporary.unlink(missing_ok=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--view", choices=("ground", "aerial"), help="Download only this view")
    parser.add_argument("--verify-only", action="store_true", help="Check files without downloading")
    args = parser.parse_args()
    profiles = json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))["profiles"]
    for view, profile in profiles.items():
        if args.view and view != args.view:
            continue
        dest = MODELS_DIR / profile["filename"]
        if dest.resolve().parent != MODELS_DIR.resolve():
            raise ValueError(f"Invalid model filename for {view}")
        if verify_file(dest, profile):
            print(f"[OK] Verified {view}: {dest.name}")
        elif args.verify_only:
            raise ValueError(f"Missing or invalid {view} checkpoint: {dest.name}")
        else:
            download_file(profile, dest)


if __name__ == "__main__":
    main()
