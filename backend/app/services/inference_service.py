"""
Registry-backed models for ground (MOT20) and aerial (VisDrone) detection.
"""

import hashlib
import json
import threading
from pathlib import Path
from typing import Any, Dict, Optional

from app.core.config import BASE_DIR

MODELS_DIR = Path(BASE_DIR) / "models"
REGISTRY_FILE = MODELS_DIR / "registry.json"


class MultiViewInferenceService:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.models: Dict[str, Any] = {}
        self.profiles = self._load_profiles()
        self.lock = threading.RLock()
        self.active_view = "aerial"

    def _load_profiles(self) -> Dict[str, Any]:
        profiles = json.loads(REGISTRY_FILE.read_text(encoding="utf-8"))["profiles"]
        for view in ("ground", "aerial"):
            filename = profiles[view]["filename"]
            if Path(filename).name != filename or not filename.endswith(".pt"):
                raise ValueError(f"Invalid model filename for {view}: {filename}")
        return profiles

    def get_profile(self, view: str) -> Dict[str, Any]:
        if view not in self.profiles:
            raise ValueError(f"Unknown view: '{view}'. Expected ground or aerial.")
        return self.profiles[view]

    def get_status(self) -> Dict[str, Any]:
        with self.lock:
            status = {}
            for view, profile in self.profiles.items():
                path = MODELS_DIR / profile["filename"]
                status[view] = {
                    **profile,
                    "available": path.is_file() and path.stat().st_size == profile["size_bytes"],
                    "loaded": view in self.models,
                    "is_active": view == self.active_view,
                }
            return {"active_view": self.active_view, "device": self.device, "profiles": status}

    def set_active_view(self, view: str, preload: bool = False) -> str:
        self.get_profile(view)
        with self.lock:
            # Load successfully before changing the active selection.
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
            path = MODELS_DIR / profile["filename"]
            setup = f"Run python scripts/download_models.py --view {view} from backend/."
            if not path.is_file():
                raise FileNotFoundError(f"Missing {view} model: {path.name}. {setup}")
            with path.open("rb") as checkpoint:
                digest = hashlib.file_digest(checkpoint, "sha256").hexdigest()
            if digest != profile["sha256"]:
                raise ValueError(f"Checksum mismatch for {path.name}. {setup}")

            from ultralytics import YOLO

            print(f"[INFO] Loading {view} detector: {path.name}")
            model = YOLO(str(path))
            for class_id, label in zip(profile["person_classes"], profile["person_labels"]):
                if model.names.get(class_id) != label:
                    raise ValueError(f"Unexpected person class mapping in {path.name}")
            self.models[view] = model
            return model

    def reset_tracking(self):
        with self.lock:
            for model in self.models.values():
                predictor = getattr(model, "predictor", None)
                for tracker in getattr(predictor, "trackers", []):
                    tracker.reset()


inference_service = MultiViewInferenceService()
