"""
Core Constants for Drone Aerial Surveillance & Intrusion Detection System.
"""

class AlertLevel:
    CLEAR = "CLEAR"               # 0 targets detected in airspace
    MONITORING = "MONITORING"     # 1 target detected (routine surveillance)
    MULTI_PERSON = "MULTI_PERSON" # >= 2 persons gathering / clustered
    INTRUSION = "INTRUSION"       # 1+ persons breaching restricted polygon perimeter

DEFAULT_ZONE_POLYGON = []

DEFAULT_FRAME_WIDTH = 1280
DEFAULT_FRAME_HEIGHT = 720
MIN_ZONE_VERTICES = 3

DEFAULT_CONFIDENCE_THRESHOLD = 0.35
DEFAULT_MULTI_PERSON_THRESHOLD = 2
DEFAULT_PROXIMITY_ALERT_DISTANCE_PX = 120
DEFAULT_SNAPSHOT_COOLDOWN_SECONDS = 3.0

TRACKING_MODE_AUTO = "auto"
TRACKING_MODE_MANUAL = "manual"
