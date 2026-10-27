"""
Filesystem Paths and Directory Resolver for AERO-GUARD backend.
"""

import os
from typing import List, Tuple
from app.core.constants import DEFAULT_ZONE_POLYGON

from app.core.constants import BASE_DIR, ROOT_DIR
from app.core.env import load_environment

load_environment()

RUNS_DIR = os.getenv("RUNS_DIR", os.path.join(ROOT_DIR, "runs"))
OUTPUT_DIR = os.getenv("OUTPUT_DIR", os.path.join(RUNS_DIR, "output"))
SNAPSHOTS_DIR = os.getenv("SNAPSHOTS_DIR", os.path.join(OUTPUT_DIR, "snapshots"))
LOGS_DIR = os.getenv("LOGS_DIR", os.path.join(OUTPUT_DIR, "logs"))
RECORDINGS_DIR = os.getenv("RECORDINGS_DIR", os.path.join(OUTPUT_DIR, "recordings"))
DATABASE_PATH = os.getenv("DATABASE_PATH", os.path.join(OUTPUT_DIR, "evidence.db"))
UPLOADS_DIR = os.getenv("UPLOADS_DIR", os.path.join(BASE_DIR, "uploads"))
SYNTHETIC_VIDEO_PATH = os.getenv("SYNTHETIC_VIDEO_PATH", os.path.join(BASE_DIR, "test_drone.mp4"))
DEFAULT_ZONE_NORMALIZED: List[Tuple[float, float]] = DEFAULT_ZONE_POLYGON


def ensure_storage_directories() -> None:
    """Safely initialize output, snapshots, logs, and upload storage directories."""
    for path in (SNAPSHOTS_DIR, RECORDINGS_DIR, LOGS_DIR, UPLOADS_DIR):
        os.makedirs(path, exist_ok=True)
