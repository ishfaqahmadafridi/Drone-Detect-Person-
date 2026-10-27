"""
Inference Profiles & Registry Loader for Multi-View Computer Vision.
"""

from typing import Dict, Any
from app.core.config import (
    INFERENCE_DEFAULT_PROFILES, AERIAL_DETECTION_PROFILE,
    GROUND_MODEL_NAME, AERIAL_MODEL_NAME,  # Backward-compatible configuration exports.
)
from app.services.inference.registry_loader import (
    MODELS_DIR,
    REGISTRY_FILE,
    resolve_models_dir,
    resolve_registry_path,
    load_registry_file,
    apply_profile_overrides,
)

DEFAULT_PROFILES = INFERENCE_DEFAULT_PROFILES


def load_inference_profiles() -> Dict[str, Any]:
    """
    Loads inference profiles from models/registry.json if present,
    falling back to DEFAULT_PROFILES, and applies any environment overrides.
    """
    profiles = {k: dict(v) for k, v in DEFAULT_PROFILES.items()}
    loaded = load_registry_file(REGISTRY_FILE)
    for k, v in loaded.items():
        profiles[k] = dict(v)

    profiles = apply_profile_overrides(profiles)

    if AERIAL_DETECTION_PROFILE == "general":
        profiles["aerial"] = dict(profiles["ground"])
        profiles["aerial"]["name"] = "Aerial / Elevated View (General Person)"
        profiles["aerial"]["description"] = "General person detection for nearby or elevated footage; evaluate high-altitude footage separately."

    return profiles


__all__ = [
    "MODELS_DIR",
    "REGISTRY_FILE",
    "DEFAULT_PROFILES",
    "resolve_models_dir",
    "resolve_registry_path",
    "load_inference_profiles",
]
