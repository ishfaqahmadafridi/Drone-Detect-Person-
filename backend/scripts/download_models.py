#!/usr/bin/env python3
"""
Automated Model Weights Downloader & Verifier for Drone-Detect-Person
Downloads exact checkpoints pinned in models/registry.json and verifies SHA-256 integrity.
"""

import argparse
import hashlib
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
REGISTRY_FILE = MODELS_DIR / "registry.json"


def verify_file(path: Path, profile: dict) -> bool:
    """Verifies file existence, size, and SHA-256 checksum."""
    if not path.is_file():
        return False
    if "size_bytes" in profile and path.stat().st_size != profile["size_bytes"]:
        return False
    if "sha256" in profile:
        with path.open("rb") as checkpoint:
            return hashlib.file_digest(checkpoint, "sha256").hexdigest() == profile["sha256"]
    return True


def download_file(profile: dict, dest: Path):
    """Downloads checkpoint atomically and verifies cryptographic integrity."""
    dest.parent.mkdir(parents=True, exist_ok=True)
    temporary = dest.with_suffix(".download")
    url = profile.get("download_url")
    if not url:
        raise ValueError(f"No download_url configured for {dest.name}")

    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Drone-Detect-Person/model-setup"},
    )
    print(f"[INFO] Downloading {dest.name}...")
    try:
        with urllib.request.urlopen(request, timeout=120) as response, temporary.open("wb") as output:
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

    if not REGISTRY_FILE.exists():
        raise FileNotFoundError(f"Registry file not found: {REGISTRY_FILE}")

    profiles = json.loads(REGISTRY_FILE.read_text(encoding="utf-8")).get("profiles", {})
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
