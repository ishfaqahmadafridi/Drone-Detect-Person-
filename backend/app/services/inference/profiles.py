"""
Inference Profiles & Registry Loader for Multi-View Computer Vision.
"""

import json
from pathlib import Path
from typing import Dict, Any

from app.core.config import BASE_DIR, ROOT_DIR

MODELS_DIR = Path(BASE_DIR) / "models"
if not MODELS_DIR.exists():
    MODELS_DIR = Path(ROOT_DIR) / "models"
REGISTRY_FILE = MODELS_DIR / "registry.json"


DEFAULT_PROFILES: Dict[str, Any] = {
    "ground": {
        "name": "Ground View (YOLOv8n CCTV)",
        "filename": "yolov8n.pt",
        "recommended_imgsz": 640,
        "confidence": 0.25,
        "iou": 0.45,
        "person_classes": [0],
        "description": "Optimized for horizontal CCTV camera perspectives."
    },
    "aerial": {
        "name": "Aerial Drone View (YOLOv8n VisDrone)",
        "filename": "yolov8n.pt",
        "recommended_imgsz": 640,
        "confidence": 0.35,
        "iou": 0.50,
        "person_classes": [0],
        "description": "Optimized for overhead UAV/Drone flight perspectives."
    }
}


def load_inference_profiles() -> Dict[str, Any]:
    """
    Loads inference profiles from models/registry.json if present,
    falling back to DEFAULT_PROFILES.
    """
    if REGISTRY_FILE.exists():
        try:
            with open(REGISTRY_FILE, "r") as f:
                data = json.load(f)
                return data.get("profiles", DEFAULT_PROFILES)
        except Exception as e:
            print(f"[WARN] Failed to read {REGISTRY_FILE}: {e}")
    return DEFAULT_PROFILES
