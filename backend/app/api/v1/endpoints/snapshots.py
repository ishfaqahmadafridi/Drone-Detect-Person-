"""
Snapshots Endpoints: Evidentiary Image Gallery & File Serving.
"""

import os
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.core.config import SNAPSHOTS_DIR
from app.db import evidence_repository

from typing import Optional
from app.services.stream_service import stream_service

router = APIRouter()

@router.get("/snapshots")
def get_snapshots(view: Optional[str] = None):
    records = evidence_repository.list_records(
        view_mode=view,
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
def capture_snapshot():
    ret, frame = stream_service.source_provider.read_frame()
    if not ret or frame is None:
        raise HTTPException(status_code=500, detail="Failed to capture frame from optical stream")
    res = stream_service.pipeline_processor.process_frame(frame, 0, stream_service.source_type)
    active_view = stream_service.telemetry_store.latest.get("view_mode", "aerial")
    filename = stream_service.alert_manager.evidence_recorder.capture_manual_snapshot(
        res.annotated_frame,
        view_mode=active_view
    )
    return {
        "message": f"Evidentiary snapshot captured for {active_view} perspective",
        "filename": filename,
        "url": f"/snapshots/{filename}",
        "view_mode": active_view
    }

@router.get("/snapshots/{filename}")
def serve_snapshot(filename: str):
    file_path = os.path.join(SNAPSHOTS_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return FileResponse(file_path, media_type="image/jpeg")
