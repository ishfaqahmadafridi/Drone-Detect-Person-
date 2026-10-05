"""
Pydantic Schemas for Runtime Configuration & Stream Switching.
"""

from typing import List, Optional
from pydantic import BaseModel, Field

class ConfigUpdateRequest(BaseModel):
    confidence_threshold: Optional[float] = Field(None, ge=0.05, le=1.0)
    zone_polygon: Optional[List[List[float]]] = None

class StreamSourceRequest(BaseModel):
    source_type: str = Field(..., description="synthetic, webcam, file, or rtsp")
    source_path: Optional[str] = None
    device_type: Optional[str] = Field(None, description="wall_cctv or mobile_phone")
    connection_mode: Optional[str] = Field(None, description="wired or wireless")
    host: Optional[str] = None
    port: Optional[int] = None
    stream_path: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    transport: Optional[str] = Field("tcp", description="tcp or udp")

class StreamTestConnectionResponse(BaseModel):
    success: bool = Field(..., description="Whether test connection succeeded")
    latency_ms: Optional[float] = None
    message: str
    effective_url: Optional[str] = None

class TrackingModeRequest(BaseModel):
    mode: str = Field(..., description="Targeting mode: 'auto' or 'manual'")
    selected_ids: Optional[List[int]] = Field(None, description="Optional target IDs to pre-lock")

class TargetSelectRequest(BaseModel):
    x: Optional[float] = Field(None, ge=0.0, le=1.0, description="Normalized X click coordinate [0.0 - 1.0]")
    y: Optional[float] = Field(None, ge=0.0, le=1.0, description="Normalized Y click coordinate [0.0 - 1.0]")
    target_id: Optional[int] = Field(None, description="Specific target ID to toggle directly")
