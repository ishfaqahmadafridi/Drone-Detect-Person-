"""
Inference Service: Dual-View Model Management & Lightweight YOLO Dispatcher.
Supports Ground (CCTV) vs. Aerial (Drone/UAV) Viewpoints.
"""

import os
import json
import threading
from pathlib import Path
from typing import Dict, Any, Optional

from app.core.config import ROOT_DIR

MODELS_DIR = Path(ROOT_DIR) / "models"
REGISTRY_FILE = MODELS_DIR / "registry.json"

DEFAULT_PROFILES = {
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

class MultiViewInferenceService:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.models: Dict[str, Any] = {}
        self.profiles: Dict[str, Any] = self._load_profiles()
        self.lock = threading.RLock()
        self.active_view: str = "aerial"

    def _load_profiles(self) -> Dict[str, Any]:
        if REGISTRY_FILE.exists():
            try:
                with open(REGISTRY_FILE, "r") as f:
                    data = json.load(f)
                    return data.get("profiles", DEFAULT_PROFILES)
            except Exception as e:
                print(f"[WARN] Failed to read {REGISTRY_FILE}: {e}")
        return DEFAULT_PROFILES

    def get_profile(self, view: str) -> Dict[str, Any]:
        return self.profiles.get(view, self.profiles["aerial"])

    def get_status(self) -> Dict[str, Any]:
        status_info = {}
        for view, profile in self.profiles.items():
            model_path = MODELS_DIR / profile["filename"]
            status_info[view] = {
                "name": profile["name"],
                "filename": profile["filename"],
                "available": model_path.exists(),
                "loaded": view in self.models,
                "is_active": view == self.active_view,
                "confidence": profile["confidence"],
                "iou": profile["iou"],
                "description": profile.get("description", "")
            }
        return {
            "active_view": self.active_view,
            "device": self.device,
            "profiles": status_info
        }

    def set_active_view(self, view: str, preload: bool = False) -> str:
        if view not in self.profiles:
            raise ValueError(f"Unknown view: '{view}'. Must be one of {list(self.profiles.keys())}")
        with self.lock:
            self.active_view = view
            if preload:
                try:
                    self.get_model(view)
                except Exception as e:
                    print(f"[WARN] Lazy-loading model for {view}: {e}")
        return self.active_view

    def get_model(self, view: Optional[str] = None) -> Any:
        view = view or self.active_view
        with self.lock:
            if view in self.models:
                return self.models[view]
            
            profile = self.get_profile(view)
            model_path = MODELS_DIR / profile["filename"]
            
            from ultralytics import YOLO
            # If local model exists use it, otherwise ultralytics automatically downloads
            target = str(model_path) if model_path.exists() else profile["filename"]
            print(f"[INFO] Loading YOLO model for view '{view}': {target}")
            model = YOLO(target)
            self.models[view] = model
            return model

# Global singleton
inference_service = MultiViewInferenceService()
