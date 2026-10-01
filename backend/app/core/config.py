"""
Core Detection Configuration and Environment Settings.
"""

import os
from dataclasses import dataclass, field
from typing import List, Tuple, Optional
from app.core.constants import (
    DEFAULT_ZONE_POLYGON,
    DEFAULT_CONFIDENCE_THRESHOLD,
    DEFAULT_MULTI_PERSON_THRESHOLD,
    DEFAULT_PROXIMITY_ALERT_DISTANCE_PX,
    DEFAULT_SNAPSHOT_COOLDOWN_SECONDS,
    DEFAULT_GROUND_MODEL_NAME,
    DEFAULT_AERIAL_MODEL_NAME,
)

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
DEFAULT_ZONE_NORMALIZED = DEFAULT_ZONE_POLYGON

def _load_env_file(filepath: str):
    if os.path.exists(filepath):
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, val = line.split("=", 1)
                        key = key.strip()
                        val = val.strip().strip('"').strip("'")
                        if key and key not in os.environ:
                            os.environ[key] = val
        except Exception as e:
            print(f"[WARN] Failed to read env file {filepath}: {e}")

_load_env_file(os.path.join(BASE_DIR, ".env"))
_load_env_file(os.path.join(ROOT_DIR, ".env"))

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN", "")

GROUND_MODEL_NAME = os.getenv("GROUND_MODEL_NAME", DEFAULT_GROUND_MODEL_NAME)
AERIAL_MODEL_NAME = os.getenv("AERIAL_MODEL_NAME", DEFAULT_AERIAL_MODEL_NAME)

os.makedirs(SNAPSHOTS_DIR, exist_ok=True)
os.makedirs(RECORDINGS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)


@dataclass
class DetectionConfig:
    # Model parameters
    view_mode: str = "aerial"
    model_name: str = ""
    model_path_override: Optional[str] = None
    confidence_threshold: Optional[float] = None
    iou_threshold: Optional[float] = None
    target_classes: List[int] = field(default_factory=lambda: [0])  # 0 = person
    device: str = "cpu"
    img_size: Optional[int] = None

    # Multi-person gathering alert rules
    multi_person_threshold: int = DEFAULT_MULTI_PERSON_THRESHOLD
    enable_multi_person_alert: bool = True
    proximity_alert_distance_px: int = DEFAULT_PROXIMITY_ALERT_DISTANCE_PX
    enable_proximity_alert: bool = True

    # Zone intrusion
    enable_zone_intrusion: bool = True
    default_zone_normalized: List[Tuple[float, float]] = field(
        default_factory=lambda: list(DEFAULT_ZONE_POLYGON)
    )

    # Storage & Cooldown
    output_dir: str = OUTPUT_DIR
    snapshots_dir: str = SNAPSHOTS_DIR
    logs_dir: str = LOGS_DIR
    save_snapshots_on_alert: bool = True
    snapshot_cooldown_seconds: float = DEFAULT_SNAPSHOT_COOLDOWN_SECONDS

    # Visuals & Targeting
    show_hud: bool = True
    show_boxes: bool = True
    show_track_trails: bool = True
    track_trail_length: int = 30
    show_proximity_lines: bool = True
    show_restricted_zones: bool = False
    enable_audio_alert: bool = False

    # Detection & Tracking Operational Modes
    tracking_mode: str = "auto"  # "auto" or "manual"
    selected_target_ids: List[int] = field(default_factory=list)

    def __post_init__(self):
        if not self.model_name:
            self.model_name = (
                GROUND_MODEL_NAME if self.view_mode == "ground" else AERIAL_MODEL_NAME
            )
