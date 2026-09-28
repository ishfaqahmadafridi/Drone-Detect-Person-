"""
Inference Service Facade: Re-exports from app.services.inference.
Preserves backward compatibility with legacy scripts and tests.
"""

from app.services.inference import (
    DEFAULT_PROFILES,
    load_inference_profiles,
    MultiViewInferenceService,
    inference_service
)

__all__ = [
    "DEFAULT_PROFILES",
    "load_inference_profiles",
    "MultiViewInferenceService",
    "inference_service"
]
