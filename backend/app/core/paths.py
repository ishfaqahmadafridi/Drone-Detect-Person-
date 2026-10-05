"""
Filesystem Paths and Directory Resolver for AERO-GUARD backend.
"""

import os
from typing import List, Tuple
from app.core.constants import DEFAULT_ZONE_POLYGON

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT_DIR = os.path.dirname(BASE_DIR)
RUNS_DIR = os.path.join(ROOT_DIR, "runs")
OUTPUT_DIR = os.path.join(RUNS_DIR, "output")
SNAPSHOTS_DIR = os.path.join(OUTPUT_DIR, "snapshots")
LOGS_DIR = os.path.join(OUTPUT_DIR, "logs")
RECORDINGS_DIR = os.path.join(OUTPUT_DIR, "recordings")
DATABASE_PATH = os.path.join(OUTPUT_DIR, "evidence.db")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
SYNTHETIC_VIDEO_PATH = os.path.join(BASE_DIR, "test_drone.mp4")
DEFAULT_ZONE_NORMALIZED: List[Tuple[float, float]] = DEFAULT_ZONE_POLYGON


def ensure_storage_directories() -> None:
    """Safely initialize output, snapshots, logs, and upload storage directories."""
    for path in (SNAPSHOTS_DIR, RECORDINGS_DIR, LOGS_DIR, UPLOADS_DIR):
        os.makedirs(path, exist_ok=True)
