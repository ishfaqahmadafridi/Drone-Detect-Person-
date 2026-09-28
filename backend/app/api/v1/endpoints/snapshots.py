"""
Snapshots Endpoints: Evidentiary Image Gallery & File Serving.
"""

import os
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.core.config import SNAPSHOTS_DIR

from typing import Optional
from app.services.stream_service import stream_service

router = APIRouter()

@router.get("/snapshots")
def get_snapshots(view: Optional[str] = None):
    files = []
    if os.path.exists(SNAPSHOTS_DIR):
        for f in os.listdir(SNAPSHOTS_DIR):
            if f.endswith(('.jpg', '.jpeg', '.png')):
                full_p = os.path.join(SNAPSHOTS_DIR, f)
                stat = os.stat(full_p)
                view_mode = "ground" if "_ground_" in f else ("aerial" if "_aerial_" in f else "ground")
                if view and view.lower() != "all" and view_mode != view.lower():
                    continue
                files.append({
                    "filename": f,
                    "url": f"/snapshots/{f}",
                    "view_mode": view_mode,
                    "created_at": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                    "size_kb": round(stat.st_size / 1024, 1)
                })
    files.sort(key=lambda x: x["created_at"], reverse=True)
    return {"snapshots": files[:60]}

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
