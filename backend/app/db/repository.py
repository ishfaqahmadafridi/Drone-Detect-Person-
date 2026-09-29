"""
Evidence Repository: Persistent SQLite storage operations for tactical recordings and snapshots.
"""

import os
import json
from datetime import datetime
from typing import List, Optional, Dict, Any

from app.core.config import SNAPSHOTS_DIR, RECORDINGS_DIR
from app.db.connection import db_manager
from app.db.models import EvidenceRecord, EvidenceRecordCreate


class EvidenceRepository:
    """Handles all SQL CRUD operations for evidentiary media recordings."""

    def __init__(self):
        self.init_db()
        self.sync_filesystem_records()

    def init_db(self) -> None:
        """Create tables and perform index optimization if not present."""
        with db_manager.session() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS evidence_records (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    media_type TEXT NOT NULL,
                    filename TEXT NOT NULL UNIQUE,
                    file_path TEXT NOT NULL,
                    url TEXT NOT NULL,
                    thumbnail_url TEXT,
                    view_mode TEXT NOT NULL,
                    threat_level TEXT NOT NULL,
                    threat_type TEXT NOT NULL,
                    duration_seconds REAL DEFAULT 0.0,
                    file_size_kb REAL DEFAULT 0.0,
                    width INTEGER DEFAULT 1280,
                    height INTEGER DEFAULT 720,
                    fps REAL DEFAULT 25.0,
                    created_at TEXT NOT NULL,
                    metadata_json TEXT DEFAULT '{}'
                );
                """
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_evidence_created ON evidence_records(created_at DESC);"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_evidence_view ON evidence_records(view_mode);"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence_records(media_type);"
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_evidence_threat ON evidence_records(threat_level);"
            )

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
            ORDER BY created_at DESC, id DESC
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
        """Remove record from database and delete underlying file if present."""
        record = self.get_by_id(record_id)
        if not record:
            return False

        with db_manager.session() as conn:
            conn.execute("DELETE FROM evidence_records WHERE id = ?;", (record_id,))

        if os.path.exists(record.file_path):
            try:
                os.remove(record.file_path)
            except OSError:
                pass
        return True

    def sync_filesystem_records(self) -> int:
        """
        Scan physical directories on disk (snapshots + recordings) and populate
        any unindexed files into SQLite database.
        """
        synced_count = 0

        # 1. Sync snapshots directory
        if os.path.exists(SNAPSHOTS_DIR):
            for fname in os.listdir(SNAPSHOTS_DIR):
                if fname.lower().endswith((".jpg", ".jpeg", ".png")):
                    full_p = os.path.join(SNAPSHOTS_DIR, fname)
                    stat = os.stat(full_p)
                    view_mode = "ground" if "_ground_" in fname else ("aerial" if "_aerial_" in fname else "ground")
                    threat_level = "INTRUSION" if "intrusion" in fname.lower() else ("MULTI_PERSON" if "multi" in fname.lower() else "CLEAR")
                    threat_type = "ZONE INTRUSION" if threat_level == "INTRUSION" else ("MULTI-PERSON GATHERING" if threat_level == "MULTI_PERSON" else "SECURITY ALERT")
                    created_at = datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S")

                    create_dto = EvidenceRecordCreate(
                        media_type="image",
                        filename=fname,
                        file_path=full_p,
                        url=f"/snapshots/{fname}",
                        thumbnail_url=f"/snapshots/{fname}",
                        view_mode=view_mode,
                        threat_level=threat_level,
                        threat_type=threat_type,
                        duration_seconds=0.0,
                        file_size_kb=round(stat.st_size / 1024, 1),
                        created_at=created_at,
                    )
                    self.insert(create_dto)
                    synced_count += 1

        # 2. Sync recordings directory
        if os.path.exists(RECORDINGS_DIR):
            for fname in os.listdir(RECORDINGS_DIR):
                if fname.lower().endswith((".mp4", ".avi", ".mkv", ".webm")):
                    full_p = os.path.join(RECORDINGS_DIR, fname)
                    stat = os.stat(full_p)
                    view_mode = "ground" if "_ground_" in fname else ("aerial" if "_aerial_" in fname else "ground")
                    threat_level = "INTRUSION" if "intrusion" in fname.lower() else ("MULTI_PERSON" if "multi" in fname.lower() else "MONITORING")
                    threat_type = "EVIDENTIARY VIDEO RECORDING"
                    created_at = datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S")

                    create_dto = EvidenceRecordCreate(
                        media_type="video",
                        filename=fname,
                        file_path=full_p,
                        url=f"/recordings/{fname}",
                        thumbnail_url=None,
                        view_mode=view_mode,
                        threat_level=threat_level,
                        threat_type=threat_type,
                        duration_seconds=0.0,
                        file_size_kb=round(stat.st_size / 1024, 1),
                        created_at=created_at,
                    )
                    self.insert(create_dto)
                    synced_count += 1

        return synced_count

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
