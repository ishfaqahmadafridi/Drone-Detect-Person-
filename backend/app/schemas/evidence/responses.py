"""
Evidence Response Schemas: Paginated query envelopes and detail structures.
"""

from typing import List
from pydantic import BaseModel, Field

from app.schemas.evidence.models import EvidenceRecord


class EvidenceListResponse(BaseModel):
    """Standardized paginated list response for evidentiary records."""
    total: int = Field(..., description="Total count of matching records across database")
    count: int = Field(..., description="Count of records returned in current page")
    records: List[EvidenceRecord] = Field(..., description="List of evidence record entities")
