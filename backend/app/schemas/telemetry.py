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

class UntrackedDetectionItem(BaseModel):
    conf: float
    bbox: List[int]

class TelemetryPayload(BaseModel):
    threat_level: str
    alert_msg: str
    total_persons: int
    intruders_count: int
    fps: float
    frame_idx: int
    timestamp: str
    detections: List[DetectionItem]
    untracked_detections: List[UntrackedDetectionItem] = Field(default_factory=list)
    source_type: str
    video_finished: bool = False
    view_mode: str = "aerial"
    model_name: str = ""
    engine: str = ""
    confidence_threshold: float
    zone_polygon: List[Tuple[float, float]]
