"""
Recordings API Endpoints: Video capture controls, status checks, automated clips, and streaming.
"""

import os
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from app.core.config import RECORDINGS_DIR
from app.services.recording import video_recorder
from app.services.stream_service import stream_service

router = APIRouter()


@router.get("/recordings/status")
def get_recording_status():
    """Check if manual or trigger video recording is currently active."""
    return {"is_recording": video_recorder.is_recording}


@router.post("/recordings/start")
def start_video_recording():
    """Start recording optical/tactical stream frames into a compressed MP4 video container."""
    if video_recorder.is_recording:
        return {"message": "Video recording already in progress"}

    active_view = stream_service.telemetry_store.latest.get("view_mode", "aerial")
    filename = video_recorder.start_recording(
        view_mode=active_view,
        threat_level="MANUAL",
        width=1280,
        height=720,
    )
    return {
        "message": "Video recording initiated",
        "filename": filename,
        "view_mode": active_view,
        "is_recording": True,
    }


@router.post("/recordings/stop")
def stop_video_recording():
    """Stop active video recording, commit metadata to SQLite database, and return record."""
    if not video_recorder.is_recording:
        raise HTTPException(status_code=400, detail="No active video recording to stop")

    record = video_recorder.stop_recording()
    if not record:
        raise HTTPException(status_code=500, detail="Failed to finalize and save video recording")

    return {
        "message": "Video recording finalized and persisted to SQLite database",
        "record": record,
    }


@router.post("/recordings/clip")
def record_evidence_clip(
    duration: float = Query(5.0, ge=1.0, le=30.0, description="Duration in seconds"),
):
    """
    Trigger a 5-to-30-second automated video evidence clip from rolling pre-roll buffer.
    """
    active_view = stream_service.telemetry_store.latest.get("view_mode", "aerial")
    threat_level = stream_service.telemetry_store.latest.get("threat_level", "MANUAL")
    video_recorder.record_clip(
        view_mode=active_view,
        threat_level=threat_level,
        duration_seconds=duration,
    )
    return {
        "message": f"Capturing {duration}s video clip for {active_view} perspective",
        "view_mode": active_view,
        "threat_level": threat_level,
    }


@router.get("/recordings/{filename}")
def serve_recording(filename: str):
    """Stream or download evidentiary video files."""
    file_path = os.path.join(RECORDINGS_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Recording file not found")

    media_type = "video/mp4" if filename.endswith(".mp4") else "application/octet-stream"
    return FileResponse(file_path, media_type=media_type, filename=filename)
