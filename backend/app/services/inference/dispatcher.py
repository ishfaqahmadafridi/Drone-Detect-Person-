"""
Multi-View Model Inference Dispatcher: Ground (CCTV) vs. Aerial (Drone/UAV) Viewpoints.
Coordinates model caching, tracker resets, and perspective switches.
"""

import threading
from pathlib import Path
from typing import Any, Dict, Optional

from app.services.inference.profiles import (
    DEFAULT_PROFILES,
    MODELS_DIR,
    load_inference_profiles,
)
from app.services.inference.model_loader import ModelWeightLoader
from app.services.inference.status_reporter import InferenceStatusReporter


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
            return InferenceStatusReporter.build_status(
                profiles=self.profiles,
                loaded_models=self.models,
                active_view=self.active_view,
                device=self.device,
                models_dir=MODELS_DIR
            )

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
            model = ModelWeightLoader.verify_and_load(
                view=view,
                profile=profile,
                models_dir=MODELS_DIR
            )
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
