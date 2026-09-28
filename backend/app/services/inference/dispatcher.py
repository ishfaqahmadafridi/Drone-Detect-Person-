"""
Multi-View Model Inference Dispatcher: Ground (CCTV) vs. Aerial (Drone/UAV) Viewpoints.
"""

import threading
from typing import Dict, Any, Optional
from app.services.inference.profiles import MODELS_DIR, DEFAULT_PROFILES, load_inference_profiles


class MultiViewInferenceService:
    """
    Manages lazy loading and active model switching across different camera perspectives.
    """
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.models: Dict[str, Any] = {}
        self.profiles: Dict[str, Any] = load_inference_profiles()
        self.lock = threading.RLock()
        self.active_view: str = "aerial"

    def get_profile(self, view: str) -> Dict[str, Any]:
        return self.profiles.get(view, self.profiles.get("aerial", DEFAULT_PROFILES["aerial"]))

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
            target = str(model_path) if model_path.exists() else profile["filename"]
            print(f"[INFO] Loading YOLO model for view '{view}': {target}")
            model = YOLO(target)
            self.models[view] = model
            return model


# Global inference service singleton
inference_service = MultiViewInferenceService()
