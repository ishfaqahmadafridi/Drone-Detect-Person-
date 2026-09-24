"""
Configuration settings for Drone-Detect-Person system.
Provides tunable parameters for aerial person detection, multi-person gathering alerts,
restricted intrusion zones, tracking, and evidence logging.
"""

from dataclasses import dataclass, field
from typing import List, Tuple
import os

@dataclass
class DetectionConfig:
    # Model parameters
    model_name: str = "yolov8n.pt"  # Can be yolov8n.pt, yolov8s.pt, yolov8m.pt, or custom drone weights
    confidence_threshold: float = 0.35  # Confidence threshold for small aerial targets
    iou_threshold: float = 0.45
    target_classes: List[int] = field(default_factory=lambda: [0])  # Class 0 = person in COCO
    device: str = "cpu"  # 'cpu', 'cuda', or 'mps' (for Apple Silicon)
    img_size: int = 640

    # Multi-person gathering & intrusion alert rules
    multi_person_threshold: int = 2  # Trigger alert when >= this number of people are present
    enable_multi_person_alert: bool = True
    
    # Proximity & gathering detection (in pixels, scaled to frame resolution)
    proximity_alert_distance_px: int = 120  # Distance threshold to consider people as clustered/gathering
    enable_proximity_alert: bool = True

    # Zone intrusion
    enable_zone_intrusion: bool = True
    # Default restricted zone (normalized coordinates [0.0 - 1.0] [x, y] polygon)
    # Default is a central area: [(0.25, 0.25), (0.75, 0.25), (0.75, 0.75), (0.25, 0.75)]
    default_zone_normalized: List[Tuple[float, float]] = field(
        default_factory=lambda: [
            (0.25, 0.25),
            (0.75, 0.25),
            (0.75, 0.75),
            (0.25, 0.75),
        ]
    )

    # Output & Evidence Storage
    output_dir: str = "runs/output"
    snapshots_dir: str = "runs/output/snapshots"
    logs_dir: str = "runs/output/logs"
    save_snapshots_on_alert: bool = True
    snapshot_cooldown_seconds: float = 3.0  # Avoid saving duplicate snapshots every millisecond

    # Display & Visuals
    show_hud: bool = True
    show_boxes: bool = True
    show_track_trails: bool = True
    show_proximity_lines: bool = True
    show_restricted_zones: bool = True
    enable_audio_alert: bool = False

    def __post_init__(self):
        os.makedirs(self.output_dir, exist_ok=True)
        os.makedirs(self.snapshots_dir, exist_ok=True)
        os.makedirs(self.logs_dir, exist_ok=True)
