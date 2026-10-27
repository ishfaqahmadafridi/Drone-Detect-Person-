"""
Core Constants for Drone Aerial Surveillance & Intrusion Detection System.
"""

import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ROOT_DIR = os.path.dirname(BASE_DIR)
DEFAULT_IOU_THRESHOLD = 0.45
DEFAULT_TRACKER_NAME = "bytetrack.yaml"

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

DEFAULT_CAMERA_FLEET = [{'id': 'CAM-01',
  'channel_num': 'CH-01',
  'name': 'UAV-01 Aerial Gimbal',
  'location': 'North Airspace - Sector 04',
  'device_type': 'drone_uav',
  'view_mode': 'aerial',
  'source_type': 'synthetic',
  'status': 'ONLINE',
  'resolution': '1080p FHD @ 25 FPS',
  'ip_address': '10.10.10.1 (Avionics Link)'},
 {'id': 'CAM-02',
  'channel_num': 'CH-02',
  'name': 'Gate 01 Perimeter CCTV',
  'location': 'North Perimeter - Gate 01',
  'device_type': 'poe_cctv',
  'view_mode': 'ground',
  'source_type': 'rtsp',
  'stream_url': 'rtsp://192.168.1.100:554/live',
  'status': 'STANDBY',
  'resolution': '1080p FHD @ 25 FPS',
  'ip_address': '192.168.1.100:554'},
 {'id': 'CAM-03',
  'channel_num': 'CH-03',
  'name': 'East Perimeter Fence CCTV',
  'location': 'Perimeter East - Fence Line',
  'device_type': 'poe_cctv',
  'view_mode': 'ground',
  'source_type': 'rtsp',
  'stream_url': 'rtsp://192.168.1.101:554/live',
  'status': 'STANDBY',
  'resolution': '1080p FHD @ 25 FPS',
  'ip_address': '192.168.1.101:554'},
 {'id': 'CAM-04',
  'channel_num': 'CH-04',
  'name': 'South Loading Dock CCTV',
  'location': 'Loading Dock South - Post 07',
  'device_type': 'poe_cctv',
  'view_mode': 'ground',
  'source_type': 'rtsp',
  'stream_url': 'rtsp://192.168.1.102:554/live',
  'status': 'STANDBY',
  'resolution': '1080p FHD @ 25 FPS',
  'ip_address': '192.168.1.102:554'},
 {'id': 'CAM-05',
  'channel_num': 'CH-05',
  'name': 'Mobile Patrol Unit (Pixel 6A)',
  'location': 'West Perimeter - Mobile Patrol',
  'device_type': 'mobile_phone',
  'view_mode': 'ground',
  'source_type': 'rtsp',
  'stream_url': 'http://10.10.20.117:8080/video',
  'status': 'STANDBY',
  'resolution': '1080p FHD @ 30 FPS',
  'ip_address': '10.10.20.117:8080'}]
PRIMARY_CAMERA_VIEWS = {"CAM-01": "aerial", "CAM-02": "ground"}
