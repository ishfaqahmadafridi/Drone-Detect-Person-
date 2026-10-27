"""Resolve normalized operator clicks in processed-frame coordinates."""
import math
from app.core.config import TARGET_CLICK_MARGIN_PX, TARGET_CLICK_RADIUS_PX
from app.core.constants import DEFAULT_FRAME_WIDTH, DEFAULT_FRAME_HEIGHT


def match_normalized_target(x, y, telemetry):
    width = telemetry.get("frame_width", DEFAULT_FRAME_WIDTH)
    height = telemetry.get("frame_height", DEFAULT_FRAME_HEIGHT)
    px, py = float(x) * width, float(y) * height
    if not all(math.isfinite(v) for v in (px, py)):
        return None
    best_id, min_dist = None, TARGET_CLICK_RADIUS_PX
    for detection in telemetry.get("detections", []) or []:
        if not isinstance(detection, dict) or detection.get("id") is None:
            continue
        bbox = detection.get("bbox")
        if not isinstance(bbox, (list, tuple)) or len(bbox) != 4:
            continue
        if not all(isinstance(v, (int, float)) and math.isfinite(v) for v in bbox):
            continue
        x1, y1, x2, y2 = bbox
        margin = TARGET_CLICK_MARGIN_PX
        if x1 - margin <= px <= x2 + margin and y1 - margin <= py <= y2 + margin:
            return detection.get("id")
        distance = math.hypot(px - (x1 + x2) / 2, py - (y1 + y2) / 2)
        if distance < min_dist:
            best_id, min_dist = detection.get("id"), distance
    return best_id
