"""
Inference Profiles & Registry Loader for Multi-View Computer Vision.
"""

import json
from pathlib import Path
from typing import Dict, Any

from app.core.config import BASE_DIR, ROOT_DIR, GROUND_MODEL_NAME, AERIAL_MODEL_NAME, AERIAL_DETECTION_PROFILE

MODELS_DIR = Path(BASE_DIR) / "models"
if not MODELS_DIR.exists():
    MODELS_DIR = Path(ROOT_DIR) / "models"
REGISTRY_FILE = MODELS_DIR / "registry.json"


DEFAULT_PROFILES: Dict[str, Any] = {
    "ground": {
        "name": "Ground View (YOLO26n Person)",
        "architecture": "YOLO26n",
        "dataset": "COCO",
        "filename": GROUND_MODEL_NAME,
        "recommended_imgsz": 640,
        "confidence": 0.35,
        "iou": 0.50,
        "person_classes": [0],
        "person_labels": ["person"],
        "tracker": "bytetrack.yaml",
        "engine": "YOLO26n + ByteTrack",
        "description": "General-purpose person detection for ground cameras and uploaded videos."
    },
    "aerial": {
        "name": "Aerial Drone View (YOLO11n VisDrone Person)",
        "architecture": "YOLO11n",
        "dataset": "VisDrone",
        "filename": AERIAL_MODEL_NAME,
        "recommended_imgsz": 1280,
        "confidence": 0.25,
        "iou": 0.45,
        "person_classes": [0],
        "person_labels": ["person"],
        "tracker": "botsort.yaml",
        "engine": "YOLO11n + BoT-SORT",
        "description": "pratap424's YOLO11n checkpoint fine-tuned on VisDrone, merging pedestrian and people into a single person class."
    }
}


def load_inference_profiles() -> Dict[str, Any]:
    """
    Loads inference profiles from models/registry.json if present,
    falling back to DEFAULT_PROFILES, and applies any environment overrides.
    """
    profiles = {k: dict(v) for k, v in DEFAULT_PROFILES.items()}
    if REGISTRY_FILE.exists():
        try:
            with open(REGISTRY_FILE, "r") as f:
                data = json.load(f)
                loaded_profiles = data.get("profiles", {})
                for k, v in loaded_profiles.items():
                    profiles[k] = dict(v)
        except Exception as e:
            print(f"[WARN] Failed to read {REGISTRY_FILE}: {e}")

    # Allow environment variable overrides for custom model filenames
    if "ground" in profiles and GROUND_MODEL_NAME:
        original = profiles["ground"].get("filename")
        if original != GROUND_MODEL_NAME:
            profiles["ground"]["filename"] = GROUND_MODEL_NAME
            profiles["ground"].pop("sha256", None)
            profiles["ground"].pop("size_bytes", None)

    if "aerial" in profiles and AERIAL_MODEL_NAME:
        original = profiles["aerial"].get("filename")
        if original != AERIAL_MODEL_NAME:
            profiles["aerial"]["filename"] = AERIAL_MODEL_NAME
            profiles["aerial"].pop("sha256", None)
            profiles["aerial"].pop("size_bytes", None)

    if AERIAL_DETECTION_PROFILE == "general":
        # Keep matching weights, classes and checksum together. The perspective
        # stays aerial; this profile suits nearby/elevated views of larger people.
        profiles["aerial"] = dict(profiles["ground"])
        profiles["aerial"]["name"] = "Aerial / Elevated View (General Person)"
        profiles["aerial"]["description"] = "General person detection for nearby or elevated footage; evaluate high-altitude footage separately."
    return profiles
