"""
Inference Subpackage: Dual-view model management, profile registry, and YOLO dispatching.
"""

from app.services.inference.profiles import DEFAULT_PROFILES, load_inference_profiles
from app.services.inference.dispatcher import MultiViewInferenceService, inference_service

__all__ = [
    "DEFAULT_PROFILES",
    "load_inference_profiles",
    "MultiViewInferenceService",
    "inference_service"
]
