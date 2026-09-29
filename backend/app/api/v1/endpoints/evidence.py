"""
Evidence API Endpoints: Persistent SQLite database queries, audit details, and record purging.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.schemas.evidence import EvidenceRecord, EvidenceListResponse
from app.db import evidence_repository

router = APIRouter()


@router.get("/evidence", response_model=EvidenceListResponse)
def get_evidence(
    view: Optional[str] = Query(None, description="'aerial', 'ground', or 'all'"),
    media_type: Optional[str] = Query(None, description="'image', 'video', or 'all'"),
    threat_level: Optional[str] = Query(None, description="'INTRUSION', 'MULTI_PERSON', 'CLEAR', etc."),
    limit: int = Query(60, ge=1, le=500),
    offset: int = Query(0, ge=0),
):
    """
    Retrieve paginated evidence records from persistent SQLite database.
    Supports filtering by camera perspective, media type (video vs. image), and threat tier.
    """
    records = evidence_repository.list_records(
        view_mode=view,
        media_type=media_type,
        threat_level=threat_level,
        limit=limit,
        offset=offset,
    )
    total = evidence_repository.count_records(
        view_mode=view,
        media_type=media_type,
        threat_level=threat_level,
    )
    return {
        "total": total,
        "count": len(records),
        "records": records,
    }


@router.get("/evidence/{record_id}", response_model=EvidenceRecord)
def get_evidence_detail(record_id: int):
    """Retrieve full audit metadata for a specific evidence record by ID."""
    record = evidence_repository.get_by_id(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Evidence record not found")
    return record


@router.delete("/evidence/{record_id}")
def delete_evidence(record_id: int):
    """Permanently delete an evidence record from SQLite database and disk storage."""
    success = evidence_repository.delete(record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Evidence record not found or could not be removed")
    return {"message": f"Evidence record {record_id} successfully purged"}
