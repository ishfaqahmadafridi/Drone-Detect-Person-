"""
Legacy config alias for backward compatibility.
Canonical configuration is located in app.core.config.
"""
from app.core.config import (
    DetectionConfig,
    BASE_DIR,
    RUNS_DIR,
    SNAPSHOTS_DIR,
    LOGS_DIR,
    SYNTHETIC_VIDEO_PATH,
    DEFAULT_ZONE_NORMALIZED
)

__all__ = [
    "DetectionConfig",
    "BASE_DIR",
    "RUNS_DIR",
    "SNAPSHOTS_DIR",
    "LOGS_DIR",
    "SYNTHETIC_VIDEO_PATH",
    "DEFAULT_ZONE_NORMALIZED"
]
