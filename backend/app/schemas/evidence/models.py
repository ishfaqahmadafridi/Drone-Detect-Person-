"""
Evidence Models: Core evidentiary entity definitions.
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, ConfigDict


class EvidenceRecordBase(BaseModel):
    media_type: str = Field(..., description="'image' or 'video'")
    filename: str = Field(..., description="Unique file basename on disk")
    file_path: str = Field(..., description="Absolute filesystem location")
    url: str = Field(..., description="Relative HTTP endpoint path")
    thumbnail_url: Optional[str] = Field(None, description="URL for video preview thumbnail or self for image")
    view_mode: str = Field("aerial", description="'aerial' or 'ground'")
    threat_level: str = Field("CLEAR", description="Alert Level: INTRUSION, MULTI_PERSON, MONITORING, CLEAR")
    threat_type: str = Field("SECURITY ALERT", description="Descriptive classification e.g. ZONE INTRUSION")
    duration_seconds: float = Field(0.0, description="Duration in seconds (for video recordings)")
    file_size_kb: float = Field(0.0, description="File size on disk in Kilobytes")
    width: int = Field(1280, description="Frame width in pixels")
    height: int = Field(720, description="Frame height in pixels")
    fps: float = Field(25.0, description="Recording framerate")
    created_at: str = Field(..., description="Formatted capture timestamp YYYY-MM-DD HH:MM:SS")
    metadata_json: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Arbitrary threat telemetry payload")


class EvidenceRecord(EvidenceRecordBase):
    id: int = Field(..., description="Primary key identifier in SQLite database")
    model_config = ConfigDict(from_attributes=True)
