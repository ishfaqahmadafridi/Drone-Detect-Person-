"""
Evidence API Endpoints: Persistent SQLite database queries, audit details, and record purging.
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from app.schemas.evidence import EvidenceRecord, EvidenceListResponse, EvidenceCleanupRequest
from app.db import evidence_repository

router = APIRouter()


@router.get("/evidence", response_model=EvidenceListResponse)
def get_evidence(
    view: Optional[str] = Query(None, description="'aerial', 'ground', or 'all'"),
    media_type: Optional[str] = Query(None, description="'image', 'video', or 'all'"),
    threat_level: Optional[str] = Query(None, description="'INTRUSION', 'MONITORING', 'CLEAR', etc."),
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


@router.get("/evidence/stats")
def get_evidence_stats():
    """Stored evidence count and size per media type (snapshots = image, recordings = video)."""
    return evidence_repository.storage_stats()


@router.post("/evidence/cleanup")
def cleanup_evidence(req: EvidenceCleanupRequest):
    """Permanently delete evidence older than the requested number of days."""
    cutoff = (datetime.now() - timedelta(days=req.older_than_days)).strftime("%Y-%m-%d %H:%M:%S")
    deleted, freed_kb = evidence_repository.delete_older_than(cutoff, req.media_type)
    return {"deleted": deleted, "freed_kb": round(freed_kb, 1), "cutoff": cutoff}


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
