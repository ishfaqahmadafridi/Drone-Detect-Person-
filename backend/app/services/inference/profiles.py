"""
Inference Profiles & Registry Loader for Multi-View Computer Vision.
"""

from typing import Dict, Any
from app.core.config import GROUND_MODEL_NAME, AERIAL_MODEL_NAME
from app.services.inference.registry_loader import (
    MODELS_DIR,
    REGISTRY_FILE,
    resolve_models_dir,
    resolve_registry_path,
    load_registry_file,
    apply_profile_overrides,
)

DEFAULT_PROFILES: Dict[str, Any] = {
    "ground": {
        "name": "Ground View (YOLO26s MOT20 Pedestrian)",
        "architecture": "YOLO26s",
        "dataset": "MOT20",
        "filename": GROUND_MODEL_NAME,
        "recommended_imgsz": 640,
        "confidence": 0.25,
        "iou": 0.50,
        "person_classes": [0],
        "person_labels": ["person"],
        "tracker": "bytetrack.yaml",
        "engine": "YOLO26s + ByteTrack",
        "description": "Halftom's YOLO26s checkpoint fine-tuned for pedestrian detection in dense ground-level MOT20 scenes."
    },
    "aerial": {
        "name": "Aerial Drone View (YOLO11n VisDrone Person)",
        "architecture": "YOLO11n",
        "dataset": "VisDrone",
        "filename": AERIAL_MODEL_NAME,
        "recommended_imgsz": 640,
        "confidence": 0.25,
        "iou": 0.45,
        "person_classes": [0],
        "person_labels": ["person"],
        "tracker": "bytetrack.yaml",
        "engine": "YOLO11n + ByteTrack",
        "description": "pratap424's YOLO11n checkpoint fine-tuned on VisDrone, merging pedestrian and people into a single person class."
    }
}


def load_inference_profiles() -> Dict[str, Any]:
    """
    Loads inference profiles from models/registry.json if present,
    falling back to DEFAULT_PROFILES, and applies any environment overrides.
    """
    profiles = {k: dict(v) for k, v in DEFAULT_PROFILES.items()}
    loaded = load_registry_file(REGISTRY_FILE)
    for k, v in loaded.items():
        profiles[k] = dict(v)

    return apply_profile_overrides(profiles)


__all__ = [
    "MODELS_DIR",
    "REGISTRY_FILE",
    "DEFAULT_PROFILES",
    "resolve_models_dir",
    "resolve_registry_path",
    "load_inference_profiles",
]
