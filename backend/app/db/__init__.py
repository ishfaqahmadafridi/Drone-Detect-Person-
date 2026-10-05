"""
Database Subsystem: SQLite Connection Management, Schema Definition, Syncer, and Repository.
"""

from app.db.connection import db_manager, DatabaseManager
from app.db.schema import initialize_schema
from app.db.syncer import FilesystemSyncer
from app.db.repository import evidence_repository, EvidenceRepository
from app.db.mappers import row_to_evidence_record, parse_metadata_json, encode_metadata_json
from app.db.query_builder import build_evidence_filters, build_list_query, build_count_query
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
    "row_to_evidence_record",
    "parse_metadata_json",
    "encode_metadata_json",
    "build_evidence_filters",
    "build_list_query",
    "build_count_query",
    "EvidenceRecordBase",
    "EvidenceRecordCreate",
    "EvidenceRecord",
    "EvidenceListResponse",
]
