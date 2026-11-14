"""
Evidence Request DTOs: Ingestion and creation payloads.
"""

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.evidence.models import EvidenceRecordBase


class EvidenceRecordCreate(EvidenceRecordBase):
    """Payload required to create/index an evidence snapshot or video recording."""
    pass


class EvidenceCleanupRequest(BaseModel):
    """Delete evidence of one media type captured more than ``older_than_days`` days ago."""
    older_than_days: int = Field(..., ge=1, le=3650)
    media_type: Literal["image", "video"] = "image"
