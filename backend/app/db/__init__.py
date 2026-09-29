"""
Database Subsystem: SQLite Connection Management, Schema Definition, Syncer, and Repository.
"""

from app.db.connection import db_manager, DatabaseManager
from app.db.schema import initialize_schema
from app.db.syncer import FilesystemSyncer
from app.db.repository import evidence_repository, EvidenceRepository
from app.schemas.evidence import (
    EvidenceRecordBase,
    EvidenceRecordCreate,
    EvidenceRecord,
    EvidenceListResponse,
)

__all__ = [
    "db_manager",
    "DatabaseManager",
    "initialize_schema",
    "FilesystemSyncer",
    "evidence_repository",
    "EvidenceRepository",
    "EvidenceRecordBase",
    "EvidenceRecordCreate",
    "EvidenceRecord",
    "EvidenceListResponse",
]
