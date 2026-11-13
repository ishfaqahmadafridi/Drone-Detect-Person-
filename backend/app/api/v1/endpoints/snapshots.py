"""
Snapshots Endpoints: Evidentiary Image Gallery & File Serving.
"""

import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from app.core.config import SNAPSHOTS_DIR
from app.db import evidence_repository

from typing import Optional
from app.services.streaming.channels import get_stream_session
from app.services.streaming.snapshot_service import capture_stream_snapshot

router = APIRouter()

@router.get("/snapshots")
def get_snapshots(view: Optional[str] = None):
    records = evidence_repository.list_records(
        view_mode=view,
        media_type="image",
        limit=100,
    )
    return {
        "snapshots": [
            {
                "id": r.id,
                "media_type": r.media_type,
                "filename": r.filename,
                "url": r.url,
                "thumbnail_url": r.thumbnail_url or r.url,
                "view_mode": r.view_mode,
                "threat_level": r.threat_level,
                "threat_type": r.threat_type,
                "created_at": r.created_at,
                "size_kb": r.file_size_kb,
                "duration_seconds": r.duration_seconds,
            }
            for r in records
        ]
    }

@router.post("/snapshots/capture")
def capture_snapshot(stream_service=Depends(get_stream_session)):
    return capture_stream_snapshot(stream_service)

@router.get("/snapshots/{filename}")
def serve_snapshot(filename: str):
    file_path = os.path.join(SNAPSHOTS_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return FileResponse(file_path, media_type="image/jpeg")
