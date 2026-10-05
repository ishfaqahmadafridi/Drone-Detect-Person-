"""
Evidence Record Mappers: Transforms SQLite rows into typed Pydantic models.
"""

import json
from typing import Any, Dict, Optional
from app.schemas.evidence import EvidenceRecord


def parse_metadata_json(raw_meta: Any) -> Dict[str, Any]:
    """Safely deserialize JSON metadata string with fallback."""
    if not raw_meta:
        return {}
    if isinstance(raw_meta, dict):
        return raw_meta
    try:
        return json.loads(raw_meta)
    except Exception:
        return {}


def encode_metadata_json(metadata: Optional[Dict[str, Any]]) -> str:
    """Serialize dictionary metadata to JSON string for SQLite storage."""
    try:
        return json.dumps(metadata or {})
    except Exception:
        return "{}"


def row_to_evidence_record(row: Any) -> Optional[EvidenceRecord]:
    """Converts a sqlite3.Row dictionary-like object into an EvidenceRecord schema."""
    if not row:
        return None

    meta = parse_metadata_json(row["metadata_json"] if "metadata_json" in row.keys() else None)

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
