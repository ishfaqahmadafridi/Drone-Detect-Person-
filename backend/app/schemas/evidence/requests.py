"""
Evidence Request DTOs: Ingestion and creation payloads.
"""

from app.schemas.evidence.models import EvidenceRecordBase


class EvidenceRecordCreate(EvidenceRecordBase):
    """Payload required to create/index an evidence snapshot or video recording."""
    pass
