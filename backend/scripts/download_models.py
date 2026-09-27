#!/usr/bin/env python3
"""
Automated Model Weights Downloader for Drone-Detect-Person
Downloads YOLO model weights into models/ directory safely.
"""

import os
import sys
import json
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = ROOT / "models"
REGISTRY_FILE = MODELS_DIR / "registry.json"

DEFAULT_URLS = {
    "yolov8n.pt": "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8n.pt",
    "yolov8s.pt": "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8s.pt",
    "yolo11n.pt": "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n.pt",
}

def download_file(url: str, dest: Path):
    dest.parent.mkdir(parents=True, exist_ok=True)
    temp_dest = dest.with_suffix(".download")
    print(f"[INFO] Downloading {dest.name} from {url}...")
    try:
        def report(count, block_size, total_size):
            if total_size > 0:
                percent = int(count * block_size * 100 / total_size)
                sys.stdout.write(f"\r[INFO] Progress: {min(100, percent)}%")
                sys.stdout.flush()

        urllib.request.urlretrieve(url, temp_dest, reporthook=report)
        print()
        if temp_dest.stat().st_size < 1000:
            temp_dest.unlink(missing_ok=True)
            raise ValueError("Downloaded file is suspiciously small or corrupted.")
        temp_dest.replace(dest)
        print(f"[SUCCESS] Downloaded and verified: {dest.name} ({dest.stat().st_size / (1024*1024):.2f} MB)")
    except Exception as e:
        temp_dest.unlink(missing_ok=True)
        print(f"[ERROR] Failed to download {dest.name}: {e}")
        raise

def main():
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    targets = ["yolov8n.pt"]
    
    if REGISTRY_FILE.exists():
        try:
            with open(REGISTRY_FILE, "r") as f:
                data = json.load(f)
            targets = list({p["filename"] for p in data.get("profiles", {}).values()})
        except Exception as e:
            print(f"[WARN] Could not parse registry.json: {e}")

    for filename in targets:
        dest = MODELS_DIR / filename
        if dest.exists() and dest.stat().st_size > 10000:
            print(f"[OK] Weights already present: {filename} ({dest.stat().st_size / (1024*1024):.2f} MB)")
            continue
        url = DEFAULT_URLS.get(filename)
        if url:
            download_file(url, dest)
        else:
            print(f"[WARN] No URL mapped for {filename}, skipping auto-download.")

if __name__ == "__main__":
    main()
