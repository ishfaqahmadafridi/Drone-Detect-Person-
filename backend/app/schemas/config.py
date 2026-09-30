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

class TrackingModeRequest(BaseModel):
    mode: str = Field(..., description="Targeting mode: 'auto' or 'manual'")
    selected_ids: Optional[List[int]] = Field(None, description="Optional target IDs to pre-lock")

class TargetSelectRequest(BaseModel):
    x: Optional[float] = Field(None, ge=0.0, le=1.0, description="Normalized X click coordinate [0.0 - 1.0]")
    y: Optional[float] = Field(None, ge=0.0, le=1.0, description="Normalized Y click coordinate [0.0 - 1.0]")
    target_id: Optional[int] = Field(None, description="Specific target ID to toggle directly")
