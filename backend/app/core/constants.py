"""
Core Constants for Drone Aerial Surveillance & Intrusion Detection System.
"""

class AlertLevel:
    CLEAR = "CLEAR"               # 0 targets detected in airspace
    MONITORING = "MONITORING"     # 1 target detected (routine surveillance)
    INTRUSION = "INTRUSION"       # 1+ persons breaching restricted polygon perimeter

DEFAULT_ZONE_POLYGON = []

DEFAULT_FRAME_WIDTH = 1280
DEFAULT_FRAME_HEIGHT = 720
MIN_ZONE_VERTICES = 3

DEFAULT_CONFIDENCE_THRESHOLD = 0.35
DEFAULT_SNAPSHOT_COOLDOWN_SECONDS = 3.0

TRACKING_MODE_AUTO = "auto"
TRACKING_MODE_MANUAL = "manual"

DEFAULT_GROUND_MODEL_NAME = "yolo26n.pt"
DEFAULT_AERIAL_MODEL_NAME = "visdrone_person_best.pt"

# Reviewed X-TFCLIP inference contract (module 3).
XTFCLIP_REPOSITORY = "https://github.com/BiDAlab/X-TFCLIP.git"
XTFCLIP_REVISION = "cb7e0c97c3c76714fe1ce662ca9104c5318a59b2"
XTFCLIP_CONFIG = "configs/vit_clipreid_288x144.yml"
# Match make_eval_rrs_dataloader, which overrides YAML normalization values.
XTFCLIP_PIXEL_MEAN = (0.485, 0.456, 0.406)
XTFCLIP_PIXEL_STD = (0.229, 0.224, 0.225)
XTFCLIP_DRIVE_FILE_ID = "1TBPWxh5Nl93QpBAwvVdYtfmfHR0BHrKQ"
XTFCLIP_CHECKPOINT_BYTES = 434122970
# Filled from the official artifact; setup verifies before installing it.
XTFCLIP_CHECKPOINT_SHA256 = "7371584d202e57cc3f27404f37d2a61678be071881ec4ffbe13ebff32d08bd07"
CLIP_TOKENIZER_URL = "https://raw.githubusercontent.com/openai/CLIP/main/clip/bpe_simple_vocab_16e6.txt.gz"
CLIP_TOKENIZER_SHA256 = "924691ac288e54409236115652ad4aa250f48203de50a9e4722a6ecd48d6804a"
CLIP_TOKENIZER_PATH = "model/clip/bpe_simple_vocab_16e6.txt.gz"
