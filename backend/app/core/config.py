"""
Core Detection Configuration and Environment Settings.
"""

import os
from dataclasses import dataclass, field
from typing import List, Tuple
from app.core.constants import DEFAULT_ZONE_POLYGON

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT_DIR = os.path.dirname(BASE_DIR)
RUNS_DIR = os.path.join(ROOT_DIR, "runs")
OUTPUT_DIR = os.path.join(RUNS_DIR, "output")
SNAPSHOTS_DIR = os.path.join(OUTPUT_DIR, "snapshots")
LOGS_DIR = os.path.join(OUTPUT_DIR, "logs")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
SYNTHETIC_VIDEO_PATH = os.path.join(BASE_DIR, "test_drone.mp4")

os.makedirs(SNAPSHOTS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

@dataclass
class DetectionConfig:
    # Model parameters
    model_name: str = "yolov8n.pt"
    confidence_threshold: float = 0.35
    iou_threshold: float = 0.45
    target_classes: List[int] = field(default_factory=lambda: [0])  # 0 = person
    device: str = "cpu"
    img_size: int = 640

    # Multi-person gathering alert rules
    multi_person_threshold: int = 2
    enable_multi_person_alert: bool = True
    proximity_alert_distance_px: int = 120
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
    snapshot_cooldown_seconds: float = 3.0

    # Visuals
    show_hud: bool = True
    show_boxes: bool = True
    show_track_trails: bool = True
    show_proximity_lines: bool = True
    show_restricted_zones: bool = True
    enable_audio_alert: bool = False
