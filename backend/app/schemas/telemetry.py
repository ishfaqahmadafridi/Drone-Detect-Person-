"""
Pydantic Schemas for Live Detection Telemetry.
"""

from typing import List, Tuple
from pydantic import BaseModel, Field

class DetectionItem(BaseModel):
    id: int
    conf: float
    bbox: List[int] = Field(..., description="[x1, y1, x2, y2]")
    is_intruder: bool = False

class TelemetryPayload(BaseModel):
    threat_level: str
    alert_msg: str
    total_persons: int
    intruders_count: int
    gathering_pairs: int
    fps: float
    frame_idx: int
    timestamp: str
    detections: List[DetectionItem]
    source_type: str
    multi_person_threshold: int
    confidence_threshold: float
    proximity_distance_px: int
    zone_polygon: List[Tuple[float, float]]
