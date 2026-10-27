"""
Core Detection Configuration and Environment Settings.
Consolidates modular paths, environment parameters, hardware device selection,
ReID parameters, and detection dataclass settings.
"""

import os
import json
from app.core.env import load_environment
from dataclasses import dataclass, field
from typing import List, Tuple, Optional

load_environment()

API_HOST = os.getenv("API_HOST", "0.0.0.0")
API_PORT = int(os.getenv("API_PORT", "8000"))
API_RELOAD = os.getenv("API_RELOAD", "true").lower() == "true"
CAMERA_PROBE_TIMEOUT_SECONDS = float(os.getenv("CAMERA_PROBE_TIMEOUT_SECONDS", "2.0"))


@dataclass(frozen=True)
class TelloControlConfig:
    mode: str = os.getenv("DRONE_CONTROL_MODE", "simulation")
    host: str = os.getenv("TELLO_HOST", "192.168.10.1")
    port: int = int(os.getenv("TELLO_COMMAND_PORT", "8889"))
    local_port: int = int(os.getenv("TELLO_LOCAL_PORT", "9000"))
    command_timeout: float = float(os.getenv("TELLO_COMMAND_TIMEOUT_SECONDS", "10"))
    send_interval: float = float(os.getenv("TELLO_SEND_INTERVAL_SECONDS", "0.05"))
    input_timeout: float = float(os.getenv("TELLO_INPUT_TIMEOUT_SECONDS", "0.6"))

    def __post_init__(self):
        if self.mode not in {"simulation", "tello"}:
            raise ValueError("DRONE_CONTROL_MODE must be simulation or tello")
        if min(self.command_timeout, self.send_interval, self.input_timeout) <= 0:
            raise ValueError("Tello control timeouts must be positive")
        if self.input_timeout <= self.send_interval:
            raise ValueError("Tello input timeout must exceed send interval")

TARGET_CLICK_MARGIN_PX = float(os.getenv("TARGET_CLICK_MARGIN_PX", "35"))
TARGET_CLICK_RADIUS_PX = float(os.getenv("TARGET_CLICK_RADIUS_PX", "80"))
DEVICE_RTSP_TIMEOUT_US = int(os.getenv("DEVICE_RTSP_TIMEOUT_US", "5000000"))
DEVICE_CAPTURE_BUFFER_SIZE = int(os.getenv("DEVICE_CAPTURE_BUFFER_SIZE", "1"))
DEVICE_READ_RETRY_SECONDS = float(os.getenv("DEVICE_READ_RETRY_SECONDS", "0.04"))

# Constants
from app.core.constants import (
    DEFAULT_ZONE_POLYGON,
    DEFAULT_CAMERA_FLEET,
    DEFAULT_CONFIDENCE_THRESHOLD,
    DEFAULT_SNAPSHOT_COOLDOWN_SECONDS,
    DEFAULT_GROUND_MODEL_NAME,
    DEFAULT_AERIAL_MODEL_NAME,
    XTFCLIP_CHECKPOINT_SHA256,
)

# Modular Path Resolution
from app.core.paths import (
    BASE_DIR,
    ROOT_DIR,
    RUNS_DIR,
    OUTPUT_DIR,
    SNAPSHOTS_DIR,
    LOGS_DIR,
    RECORDINGS_DIR,
    DATABASE_PATH,
    UPLOADS_DIR,
    SYNTHETIC_VIDEO_PATH,
    DEFAULT_ZONE_NORMALIZED,
    ensure_storage_directories,
)

# Modular Environment Variables
from app.core.env import (
    REPLICATE_API_TOKEN,
    GROUND_MODEL_NAME,
    AERIAL_MODEL_NAME,
    load_env_file,
)

# Modular Hardware Device Selection
from app.core.device import get_optimal_device

# Initialize storage paths
ensure_storage_directories()

VIDEO_UPLOAD_MAX_BYTES = int(os.getenv("VIDEO_UPLOAD_MAX_BYTES", 500 * 1024 * 1024))
VIDEO_UPLOAD_CHUNK_BYTES = 1024 * 1024
VIDEO_UPLOAD_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv", ".webm", ".m4v"}
SELECTION_TIMEOUT_SECONDS = int(os.getenv("SELECTION_TIMEOUT_SECONDS", 120))
STREAM_SUBSCRIBER_WAIT_SECONDS = 1.0
STREAM_IDLE_WAIT_SECONDS = 0.1
PREVIEW_MAX_EDGE = int(os.getenv("PREVIEW_MAX_EDGE", 1280))
DEFAULT_VIDEO_FPS = 25.0
VIDEO_PLAYBACK_MODE = os.getenv("VIDEO_PLAYBACK_MODE", "realtime")
VIDEO_END_BEHAVIOR = os.getenv("VIDEO_END_BEHAVIOR", "loop")
if VIDEO_END_BEHAVIOR not in {"hold", "loop"}:
    raise ValueError("VIDEO_END_BEHAVIOR must be hold or loop")
STREAM_ASYNC_PREVIEW = os.getenv("STREAM_ASYNC_PREVIEW", "true").lower() == "true"
STREAM_PREVIEW_FPS = max(1, int(os.getenv("STREAM_PREVIEW_FPS", "25")))
STREAM_BOX_MAX_AGE_SECONDS = float(os.getenv("STREAM_BOX_MAX_AGE_SECONDS", "1.0"))
STREAM_JPEG_QUALITY = int(os.getenv("STREAM_JPEG_QUALITY", "80"))
STREAM_RETRY_SECONDS = float(os.getenv("STREAM_RETRY_SECONDS", "0.04"))
STREAM_THROTTLE_SECONDS = float(os.getenv("STREAM_THROTTLE_SECONDS", "0.015"))
STREAM_HTTP_TIMEOUT_SECONDS = float(os.getenv("STREAM_HTTP_TIMEOUT_SECONDS", "2.5"))
STREAM_MAX_FRAME_WIDTH = int(os.getenv("STREAM_MAX_FRAME_WIDTH", "1280"))
SIMULATION_WIDTH = int(os.getenv("SIMULATION_WIDTH", "1280"))
SIMULATION_HEIGHT = int(os.getenv("SIMULATION_HEIGHT", "720"))
SIMULATION_PERSON_COUNT = int(os.getenv("SIMULATION_PERSON_COUNT", "4"))
SIMULATION_INTERVAL_SECONDS = float(os.getenv("SIMULATION_INTERVAL_SECONDS", "0.035"))
BLOCKED_WEBCAM_DEVICE = os.getenv("BLOCKED_WEBCAM_DEVICE", "0")
FPS_WINDOW_SECONDS = float(os.getenv("FPS_WINDOW_SECONDS", "0.5"))
WORKER_SHUTDOWN_SECONDS = float(os.getenv("WORKER_SHUTDOWN_SECONDS", "3"))
REID_PROCESS_SHUTDOWN_SECONDS = float(os.getenv("REID_PROCESS_SHUTDOWN_SECONDS", "2"))
WS_TELEMETRY_INTERVAL_SECONDS = float(os.getenv("WS_TELEMETRY_INTERVAL_SECONDS", "0.12"))
DB_CONNECTION_TIMEOUT_SECONDS = float(os.getenv("DB_CONNECTION_TIMEOUT_SECONDS", "20"))
DB_BUSY_TIMEOUT_MS = int(os.getenv("DB_BUSY_TIMEOUT_MS", "10000"))

AERIAL_DETECTION_PROFILE = os.getenv("AERIAL_DETECTION_PROFILE", "visdrone")
if AERIAL_DETECTION_PROFILE not in {"visdrone", "general"}:
    raise ValueError("AERIAL_DETECTION_PROFILE must be visdrone or general")


@dataclass(frozen=True)
class ReIDConfig:
    """X-TFCLIP inference on CPU or CUDA, enabled explicitly through the environment."""

    enabled: bool = os.getenv("REID_ENABLED", "false").lower() == "true"
    source_dir: str = os.getenv("REID_SOURCE_DIR", os.path.join(ROOT_DIR, ".runtime", "X-TFCLIP"))
    checkpoint: str = os.getenv("REID_CHECKPOINT", os.path.join(BASE_DIR, "models", "xtfclip.pth.tar"))
    checkpoint_sha256: str = os.getenv("REID_CHECKPOINT_SHA256", XTFCLIP_CHECKPOINT_SHA256)
    device: str = os.getenv("REID_DEVICE", "cpu")
    cpu_threads: int = int(os.getenv("REID_CPU_THREADS", "2"))
    camera_mode: str = os.getenv("REID_CAMERA_MODE", "mapped")
    # These are training-domain labels, not application track IDs. Set from checkpoint metadata.
    ground_camera_id: int = int(os.getenv("REID_GROUND_CAMERA_ID", "0"))
    aerial_camera_id: int = int(os.getenv("REID_AERIAL_CAMERA_ID", "4"))
    sequence_length: int = int(os.getenv("REID_SEQUENCE_LENGTH", "8"))
    crop_height: int = int(os.getenv("REID_CROP_HEIGHT", "288"))
    crop_width: int = int(os.getenv("REID_CROP_WIDTH", "144"))
    sample_seconds: float = float(os.getenv("REID_SAMPLE_SECONDS", "0.3"))
    update_seconds: float = float(os.getenv("REID_UPDATE_SECONDS", "2"))
    track_ttl_seconds: float = float(os.getenv("REID_TRACK_TTL_SECONDS", "120"))
    max_tracks: int = int(os.getenv("REID_MAX_TRACKS", "48"))
    max_targets: int = int(os.getenv("REID_MAX_TARGETS", "4"))
    top_k: int = int(os.getenv("REID_TOP_K", "4"))
    batch_size: int = int(os.getenv("REID_BATCH_SIZE", "1"))
    min_crop_height: int = int(os.getenv("REID_MIN_CROP_HEIGHT", "32"))
    min_crop_width: int = int(os.getenv("REID_MIN_CROP_WIDTH", "12"))
    min_detection_confidence: float = float(os.getenv("REID_MIN_DETECTION_CONFIDENCE", "0.4"))
    # Uncalibrated ranking by default. Set only after measuring same/different-person scores.
    min_similarity: float = float(os.getenv("REID_MIN_SIMILARITY", "-1"))
    worker_timeout_seconds: float = float(os.getenv("REID_WORKER_TIMEOUT_SECONDS", "180"))
    jpeg_quality: int = int(os.getenv("REID_JPEG_QUALITY", "80"))
    flip_augmentation: bool = os.getenv("REID_FLIP_AUGMENTATION", "true").lower() == "true"

    def __post_init__(self):
        if self.camera_mode not in {"neutral", "mapped"}:
            raise ValueError("REID_CAMERA_MODE must be neutral or mapped")
        if self.device != "cpu" and not self.device.startswith("cuda"):
            raise ValueError("REID_DEVICE must be cpu or cuda[:index]")
        for name in ("sequence_length", "crop_height", "crop_width", "sample_seconds", "update_seconds",
                     "track_ttl_seconds", "max_tracks", "max_targets", "batch_size", "min_crop_height",
                     "min_crop_width", "worker_timeout_seconds", "cpu_threads"):
            if getattr(self, name) <= 0:
                raise ValueError(f"REID {name} must be positive")
        if not 1 <= self.top_k <= 4:
            raise ValueError("REID_TOP_K must be between 1 and 4")
        if not -1 <= self.min_similarity <= 1 or not 0 <= self.min_detection_confidence <= 1:
            raise ValueError("Invalid ReID similarity or detection confidence")
        if not 1 <= self.jpeg_quality <= 100:
            raise ValueError("Invalid ReID JPEG quality")


@dataclass
class DetectionConfig:
    """
    Central operational configuration for detection, tracking, zoning, and alerts.
    """
    # Model parameters
    view_mode: str = "aerial"
    model_name: str = ""
    model_path_override: Optional[str] = None
    confidence_threshold: Optional[float] = None
    iou_threshold: Optional[float] = None
    target_classes: List[int] = field(default_factory=lambda: [0])  # 0 = person
    device: str = field(default_factory=get_optimal_device)
    img_size: Optional[int] = None

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
    show_hud: bool = False
    show_boxes: bool = True
    show_track_trails: bool = False
    track_trail_length: int = 30
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


# Default model profiles; deployment registries may override these defaults.
INFERENCE_DEFAULT_PROFILES = {
    "ground": {
        "name": "Ground View (YOLO26n Person)",
        "architecture": "YOLO26n",
        "dataset": "COCO",
        "filename": GROUND_MODEL_NAME,
        "recommended_imgsz": 640,
        "confidence": 0.35,
        "iou": 0.50,
        "person_classes": [0],
        "person_labels": ["person"],
        "tracker": "bytetrack.yaml",
        "engine": "YOLO26n + ByteTrack",
        "description": "General-purpose person detection for ground cameras and uploaded videos."
    },
    "aerial": {
        "name": "Aerial Drone View (YOLO11n VisDrone Person)",
        "architecture": "YOLO11n",
        "dataset": "VisDrone",
        "filename": AERIAL_MODEL_NAME,
        "recommended_imgsz": 640,
        "confidence": 0.25,
        "iou": 0.45,
        "person_classes": [0],
        "person_labels": ["person"],
        "tracker": "bytetrack.yaml",
        "engine": "YOLO11n + ByteTrack",
        "description": "pratap424's YOLO11n checkpoint fine-tuned on VisDrone, merging pedestrian and people into a single person class."
    }
}


INFERENCE_PROFILE_OVERRIDES = {
    view: {key: cast(os.environ[name]) for key, name, cast in (
        ("confidence", f"{view.upper()}_CONFIDENCE", float),
        ("iou", f"{view.upper()}_IOU", float),
        ("recommended_imgsz", f"{view.upper()}_IMAGE_SIZE", int),
    ) if name in os.environ} for view in ("ground", "aerial")
}

CAMERA_FLEET = json.loads(os.getenv("CAMERA_FLEET_JSON", json.dumps(DEFAULT_CAMERA_FLEET)))


@dataclass
class AerialDiffusionConfig:
    """
    Configuration parameters for local & cloud-accelerated AerialDiffusion inference.
    """
    model_id: str = os.getenv("AERIAL_DIFFUSION_MODEL_ID", "CompVis/stable-diffusion-v1-4")
    default_prompt: str = (
        "an aerial overhead drone surveillance view of the perimeter scene, "
        "top-down satellite perspective, high-altitude tactical defense map, crisp details"
    )
    default_negative_prompt: str = (
        "blurry, low quality, distorted horizon, eye-level street view, ground camera angle, "
        "tilted camera, bad anatomy, watermarks"
    )
    image_size: int = 512
    num_inference_steps: int = 30
    guidance_scale: float = 7.5
    device: str = get_optimal_device()
    output_dir: str = SNAPSHOTS_DIR
    enable_xformers: bool = True
    enable_attention_slicing: bool = True
    enable_fp16: bool = True
