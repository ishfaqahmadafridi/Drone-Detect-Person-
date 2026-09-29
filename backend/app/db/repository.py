"""
Evidence Repository: Persistent SQLite storage operations for tactical recordings and snapshots.
"""

import os
import json
from typing import List, Optional, Any

from app.db.connection import db_manager
from app.db.schema import initialize_schema
from app.db.syncer import FilesystemSyncer
from app.schemas.evidence import EvidenceRecord, EvidenceRecordCreate


class EvidenceRepository:
    """Handles all SQL CRUD operations for evidentiary media recordings."""

    def __init__(self, auto_sync: bool = True):
        initialize_schema()
        if auto_sync:
            FilesystemSyncer.sync(self)

    def insert(self, record: EvidenceRecordCreate) -> EvidenceRecord:
        """Persist a new evidence record into SQLite."""
        meta_str = json.dumps(record.metadata_json or {})
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
        clauses = []
        params: List[Any] = []

        if view_mode and view_mode.lower() != "all":
            clauses.append("view_mode = ?")
            params.append(view_mode.lower().strip())

        if media_type and media_type.lower() != "all":
            clauses.append("media_type = ?")
            params.append(media_type.lower().strip())

        if threat_level and threat_level.upper() != "ALL":
            clauses.append("threat_level = ?")
            params.append(threat_level.upper().strip())

        where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        query = f"""
            SELECT * FROM evidence_records
            {where_sql}
            ORDER BY CASE WHEN media_type = 'video' THEN 0 ELSE 1 END, created_at DESC, id DESC
            LIMIT ? OFFSET ?;
        """
        params.extend([limit, offset])

        with db_manager.session() as conn:
            cursor = conn.execute(query, params)
            rows = cursor.fetchall()

        return [self._row_to_model(row) for row in rows]

    def count_records(
        self,
        view_mode: Optional[str] = None,
        media_type: Optional[str] = None,
        threat_level: Optional[str] = None,
    ) -> int:
        """Count total matching records for pagination metadata."""
        clauses = []
        params: List[Any] = []

        if view_mode and view_mode.lower() != "all":
            clauses.append("view_mode = ?")
            params.append(view_mode.lower().strip())

        if media_type and media_type.lower() != "all":
            clauses.append("media_type = ?")
            params.append(media_type.lower().strip())

        if threat_level and threat_level.upper() != "ALL":
            clauses.append("threat_level = ?")
            params.append(threat_level.upper().strip())

        where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
        query = f"SELECT COUNT(*) AS total FROM evidence_records {where_sql};"

        with db_manager.session() as conn:
            cursor = conn.execute(query, params)
            row = cursor.fetchone()
            return row["total"] if row else 0

    def get_by_id(self, record_id: int) -> Optional[EvidenceRecord]:
        """Fetch a single record by primary key."""
        with db_manager.session() as conn:
            cursor = conn.execute("SELECT * FROM evidence_records WHERE id = ?;", (record_id,))
            row = cursor.fetchone()
        return self._row_to_model(row) if row else None

    def get_by_filename(self, filename: str) -> Optional[EvidenceRecord]:
        """Fetch a single record by filename."""
        with db_manager.session() as conn:
            cursor = conn.execute("SELECT * FROM evidence_records WHERE filename = ?;", (filename,))
            row = cursor.fetchone()
        return self._row_to_model(row) if row else None

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

    def _row_to_model(self, row: Any) -> EvidenceRecord:
        """Convert a sqlite3.Row to an EvidenceRecord model."""
        meta = {}
        if row["metadata_json"]:
            try:
                meta = json.loads(row["metadata_json"])
            except Exception:
                meta = {}

        return EvidenceRecord(
            id=row["id"],
            media_type=row["media_type"],
            filename=row["filename"],
            file_path=row["file_path"],
            url=row["url"],
            thumbnail_url=row["thumbnail_url"],
            view_mode=row["view_mode"],
            threat_level=row["threat_level"],
            threat_type=row["threat_type"],
            duration_seconds=float(row["duration_seconds"] or 0.0),
            file_size_kb=float(row["file_size_kb"] or 0.0),
            width=int(row["width"] or 1280),
            height=int(row["height"] or 720),
            fps=float(row["fps"] or 25.0),
            created_at=str(row["created_at"]),
            metadata_json=meta,
        )


evidence_repository = EvidenceRepository()
