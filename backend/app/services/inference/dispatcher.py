"""
Multi-View Model Inference Dispatcher: Ground (CCTV) vs. Aerial (Drone/UAV) Viewpoints.
"""

import hashlib
import threading
from pathlib import Path
from typing import Any, Dict, Optional

from app.services.inference.profiles import (
    DEFAULT_PROFILES,
    MODELS_DIR,
    load_inference_profiles,
)


class MultiViewInferenceService:
    """
    Manages lazy loading and active model switching across different camera perspectives.
    Supports checksum integrity verification, custom class validations, and tracker resets.
    """

    def __init__(self, device: str = "cpu"):
        self.device = device
        self.models: Dict[str, Any] = {}
        self.profiles: Dict[str, Any] = load_inference_profiles()
        self.lock = threading.RLock()
        self.active_view: str = "aerial"

    def get_profile(self, view: str) -> Dict[str, Any]:
        if view not in self.profiles:
            raise ValueError(f"Unknown view: '{view}'. Expected ground or aerial.")
        return self.profiles[view]

    def get_status(self) -> Dict[str, Any]:
        with self.lock:
            status_info = {}
            for view, profile in self.profiles.items():
                model_path = MODELS_DIR / profile["filename"]
                is_avail = (
                    model_path.is_file()
                    and (
                        "size_bytes" not in profile
                        or model_path.stat().st_size == profile["size_bytes"]
                    )
                )
                status_info[view] = {
                    "name": profile["name"],
                    "filename": profile["filename"],
                    "available": is_avail,
                    "loaded": view in self.models,
                    "is_active": view == self.active_view,
                    "confidence": profile["confidence"],
                    "iou": profile["iou"],
                    "description": profile.get("description", ""),
                }
            return {
                "active_view": self.active_view,
                "device": self.device,
                "profiles": status_info,
            }

    def set_active_view(self, view: str, preload: bool = False) -> str:
        self.get_profile(view)
        with self.lock:
            if preload:
                self.get_model(view)
            self.active_view = view
            return self.active_view

    def get_model(self, view: Optional[str] = None) -> Any:
        view = view or self.active_view
        with self.lock:
            if view in self.models:
                return self.models[view]

            profile = self.get_profile(view)
            model_path = MODELS_DIR / profile["filename"]
            setup = f"Run python scripts/download_models.py --view {view} from backend/."

            if not model_path.is_file():
                raise FileNotFoundError(f"Missing {view} model: {model_path.name}. {setup}")

            if "sha256" in profile:
                with model_path.open("rb") as checkpoint:
                    digest = hashlib.file_digest(checkpoint, "sha256").hexdigest()
                if digest != profile["sha256"]:
                    raise ValueError(f"Checksum mismatch for {model_path.name}. {setup}")

            from ultralytics import YOLO

            print(f"[INFO] Loading YOLO model for view '{view}': {model_path.name}")
            model = YOLO(str(model_path))

            if "person_classes" in profile and "person_labels" in profile:
                for class_id, label in zip(profile["person_classes"], profile["person_labels"]):
                    if getattr(model, "names", {}).get(class_id) != label:
                        raise ValueError(f"Unexpected person class mapping in {model_path.name}")

            self.models[view] = model
            return model

    def reset_tracking(self):
        """Reset internal trackers for all loaded YOLO models."""
        with self.lock:
            for model in self.models.values():
                predictor = getattr(model, "predictor", None)
                for tracker in getattr(predictor, "trackers", []):
                    tracker.reset()


# Global inference service singleton
inference_service = MultiViewInferenceService()
