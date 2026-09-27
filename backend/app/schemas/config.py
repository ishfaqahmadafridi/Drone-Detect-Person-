"""
Pydantic Schemas for Runtime Configuration & Stream Switching.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class ConfigUpdateRequest(BaseModel):
    multi_person_threshold: Optional[int] = Field(None, ge=1, le=20)
    confidence_threshold: Optional[float] = Field(None, ge=0.05, le=1.0)
    proximity_alert_distance_px: Optional[int] = Field(None, ge=20, le=500)
    zone_polygon: Optional[List[List[float]]] = None

class StreamSourceRequest(BaseModel):
    source_type: str = Field(..., description="synthetic, webcam, file, or rtsp")
    source_path: Optional[str] = None
