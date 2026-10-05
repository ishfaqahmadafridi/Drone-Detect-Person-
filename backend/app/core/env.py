"""
Environment variable parser and loader for AERO-GUARD backend.
"""

import os
from typing import Optional
from app.core.constants import (
    DEFAULT_GROUND_MODEL_NAME,
    DEFAULT_AERIAL_MODEL_NAME,
)
from app.core.paths import BASE_DIR, ROOT_DIR


def load_env_file(filepath: str) -> None:
    """Safely parse a .env file and populate os.environ without overwriting existing vars."""
    if not os.path.exists(filepath):
        return

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, val = line.split("=", 1)
                key = key.strip()
                val = val.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = val
    except Exception as e:
        print(f"[WARN] Failed to read env file {filepath}: {e}")


def load_environment() -> None:
    """Loads environment files from BASE_DIR and ROOT_DIR."""
    load_env_file(os.path.join(BASE_DIR, ".env"))
    load_env_file(os.path.join(ROOT_DIR, ".env"))


# Execute loading on initial module import
load_environment()

REPLICATE_API_TOKEN: str = os.getenv("REPLICATE_API_TOKEN", "")
GROUND_MODEL_NAME: str = os.getenv("GROUND_MODEL_NAME", DEFAULT_GROUND_MODEL_NAME)
AERIAL_MODEL_NAME: str = os.getenv("AERIAL_MODEL_NAME", DEFAULT_AERIAL_MODEL_NAME)
