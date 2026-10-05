"""
Inference Registry Loader: Resolves and parses YOLO model profiles and metadata.
"""

import json
from pathlib import Path
from typing import Dict, Any, Optional
from app.core.config import BASE_DIR, ROOT_DIR, GROUND_MODEL_NAME, AERIAL_MODEL_NAME


def resolve_models_dir() -> Path:
    """Locate the models directory in either BASE_DIR or ROOT_DIR."""
    primary = Path(BASE_DIR) / "models"
    if primary.exists():
        return primary
    return Path(ROOT_DIR) / "models"


MODELS_DIR: Path = resolve_models_dir()
REGISTRY_FILE: Path = MODELS_DIR / "registry.json"


def resolve_registry_path() -> Path:
    """Locate registry.json in either BASE_DIR/models or ROOT_DIR/models."""
    return REGISTRY_FILE


def load_registry_file(filepath: Optional[Path] = None) -> Dict[str, Any]:
    """Safely parse registry.json if present."""
    target_path = filepath or REGISTRY_FILE
    if not target_path.exists():
        return {}

    try:
        with open(target_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data.get("profiles", {})
    except Exception as e:
        print(f"[WARN] Failed to read model registry from {target_path}: {e}")
        return {}


def apply_profile_overrides(profiles: Dict[str, Any]) -> Dict[str, Any]:
    """Applies environment variable overrides for ground and aerial model filenames."""
    if "ground" in profiles and GROUND_MODEL_NAME:
        original = profiles["ground"].get("filename")
        if original != GROUND_MODEL_NAME:
            profiles["ground"]["filename"] = GROUND_MODEL_NAME
            profiles["ground"].pop("sha256", None)
            profiles["ground"].pop("size_bytes", None)

    if "aerial" in profiles and AERIAL_MODEL_NAME:
        original = profiles["aerial"].get("filename")
        if original != AERIAL_MODEL_NAME:
            profiles["aerial"]["filename"] = AERIAL_MODEL_NAME
            profiles["aerial"].pop("sha256", None)
            profiles["aerial"].pop("size_bytes", None)

    return profiles
