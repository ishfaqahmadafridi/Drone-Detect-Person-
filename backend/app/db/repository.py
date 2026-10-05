"""
Evidence Repository: Persistent SQLite storage operations for tactical recordings and snapshots.
"""

import os
from typing import List, Optional

from app.db.connection import db_manager
from app.db.schema import initialize_schema
from app.db.syncer import FilesystemSyncer
from app.db.mappers import row_to_evidence_record, encode_metadata_json
from app.db.query_builder import build_list_query, build_count_query
from app.schemas.evidence import EvidenceRecord, EvidenceRecordCreate


class EvidenceRepository:
    """Handles all SQL CRUD operations for evidentiary media recordings."""

    def __init__(self, auto_sync: bool = True):
        initialize_schema()
        if auto_sync:
            FilesystemSyncer.sync(self)

    def insert(self, record: EvidenceRecordCreate) -> EvidenceRecord:
        """Persist a new evidence record into SQLite."""
        meta_str = encode_metadata_json(record.metadata_json)
        with db_manager.session() as conn:
            cursor = conn.execute(
                """
                INSERT INTO evidence_records (
                    media_type, filename, file_path, url, thumbnail_url,
                    view_mode, threat_level, threat_type, duration_seconds,
                    file_size_kb, width, height, fps, created_at, metadata_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(filename) DO UPDATE SET
                    file_size_kb=excluded.file_size_kb,
                    thumbnail_url=COALESCE(excluded.thumbnail_url, evidence_records.thumbnail_url);
                """,
                (
                    record.media_type,
                    record.filename,
                    record.file_path,
                    record.url,
                    record.thumbnail_url,
                    record.view_mode,
                    record.threat_level,
                    record.threat_type,
                    record.duration_seconds,
                    record.file_size_kb,
                    record.width,
                    record.height,
                    record.fps,
                    record.created_at,
                    meta_str,
                ),
            )
            record_id = cursor.lastrowid or self.get_by_filename(record.filename).id

        return self.get_by_id(record_id)

    def list_records(
        self,
        view_mode: Optional[str] = None,
        media_type: Optional[str] = None,
        threat_level: Optional[str] = None,
        limit: int = 100,
        offset: int = 0,
    ) -> List[EvidenceRecord]:
        """Query evidence records with optional filtering and pagination."""
        query, params = build_list_query(
            view_mode=view_mode,
            media_type=media_type,
            threat_level=threat_level,
            limit=limit,
            offset=offset,
        )

        with db_manager.session() as conn:
            cursor = conn.execute(query, params)
            rows = cursor.fetchall()

        return [row_to_evidence_record(row) for row in rows if row]

    def count_records(
        self,
        view_mode: Optional[str] = None,
        media_type: Optional[str] = None,
        threat_level: Optional[str] = None,
    ) -> int:
        """Count total matching records for pagination metadata."""
        query, params = build_count_query(
            view_mode=view_mode,
            media_type=media_type,
            threat_level=threat_level,
        )

        with db_manager.session() as conn:
            cursor = conn.execute(query, params)
            row = cursor.fetchone()
            return row["total"] if row else 0

    def get_by_id(self, record_id: int) -> Optional[EvidenceRecord]:
        """Fetch a single record by primary key."""
        with db_manager.session() as conn:
            cursor = conn.execute("SELECT * FROM evidence_records WHERE id = ?;", (record_id,))
            row = cursor.fetchone()
        return row_to_evidence_record(row)

    def get_by_filename(self, filename: str) -> Optional[EvidenceRecord]:
        """Fetch a single record by filename."""
        with db_manager.session() as conn:
            cursor = conn.execute("SELECT * FROM evidence_records WHERE filename = ?;", (filename,))
            row = cursor.fetchone()
        return row_to_evidence_record(row)

    def delete(self, record_id: int) -> bool:
        """Remove a record by ID and unlink its underlying file from storage."""
        record = self.get_by_id(record_id)
        if not record:
            return False

        with db_manager.session() as conn:
            conn.execute("DELETE FROM evidence_records WHERE id = ?;", (record_id,))

        if record.file_path and os.path.exists(record.file_path):
            try:
                os.remove(record.file_path)
            except OSError as err:
                print(f"[REPOSITORY] Failed to delete file {record.file_path}: {err}")

        return True

    def sync_filesystem_records(self) -> int:
        """Manual trigger to synchronize filesystem files into SQLite."""
        return FilesystemSyncer.sync(self)


evidence_repository = EvidenceRepository()
