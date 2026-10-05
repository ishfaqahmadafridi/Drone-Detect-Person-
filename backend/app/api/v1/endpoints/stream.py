"""
Stream Endpoints: MJPEG Live Video Feed & Source Control.
"""

import os
import time
from fastapi import Depends, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.services.streaming.channels import get_stream_session, select_camera_session
from app.services.streaming.connection_prober import stream_connection_service
from app.schemas.config import StreamSourceRequest, StreamTestConnectionResponse
from app.core.config import UPLOADS_DIR

router = APIRouter()

@router.post("/stream/camera")
def select_primary_camera(camera_id: str):
    session = select_camera_session(camera_id)
    return {"active_view": session.config.view_mode, "source_type": session.source_type, "camera_id": camera_id}

@router.get("/stream/video_feed")
def get_video_feed(stream_service=Depends(get_stream_session)):
    return StreamingResponse(
        stream_service.generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.post("/stream/source")
def switch_source(req: StreamSourceRequest, stream_service=Depends(get_stream_session)):
    valid_types = ["synthetic", "webcam", "file", "rtsp", "http"]
    if req.source_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid source_type. Must be one of {valid_types}")
    
    effective_path = stream_connection_service.build_effective_stream_path(req)
    stream_service.set_source(
        req.source_type,
        effective_path if effective_path else None,
        transport=req.transport or "tcp"
    )
    return {
        "message": f"Source updated to {req.source_type}",
        "source_type": stream_service.source_type,
        "source_path": stream_service.source_path,
        "effective_url": effective_path,
        "device_type": req.device_type,
        "connection_mode": req.connection_mode,
    }

@router.post("/stream/test-connection", response_model=StreamTestConnectionResponse)
def test_stream_connection(req: StreamSourceRequest):
    """
    Test link reachability and port latency for wired or wireless CCTV/phone stream.
    Delegates diagnostics to StreamConnectionProberService.
    """
    return stream_connection_service.probe_connection(req)

@router.get("/stream/models/status")
def get_models_status():
    from app.services.inference_service import inference_service
    return inference_service.get_status()

@router.post("/stream/view")
def switch_view(view: str, stream_service=Depends(get_stream_session)):
    valid_views = ["aerial", "ground"]
    if view not in valid_views:
        raise HTTPException(status_code=400, detail=f"Invalid view '{view}'. Must be one of {valid_views}")
    
    active = stream_service.set_view_mode(view)
    return {
        "message": f"Perspective view switched to {active}",
        "active_view": active
    }

@router.post("/video/upload")
async def upload_video(file: UploadFile = File(...), stream_service=Depends(get_stream_session)):
    from app.services.video_upload import save_video
    from starlette.concurrency import run_in_threadpool

    save_path = await save_video(file)
    await run_in_threadpool(stream_service.set_source, "file", str(save_path))
    return {
        "message": "Video validated. Model testing started.",
        "filename": save_path.name,
        "filepath": str(save_path),
    }

@router.get("/stream/status")
def stream_status(stream_service=Depends(get_stream_session)):
    return {**stream_service.latest_telemetry,
            "source_type": stream_service.source_type,
            "view_mode": stream_service.config.view_mode,
            "model_name": stream_service.config.model_name,
            "selected_target_ids": stream_service.config.selected_target_ids}


@router.post("/stream/replay")
def replay_video(stream_service=Depends(get_stream_session)):
    if stream_service.source_type != "file":
        raise HTTPException(409, "Replay is available only for an uploaded video.")
    stream_service.set_source("file", stream_service.source_path)
    return {"status": "ok", "message": "Video restarted; select a fresh ground reference."}

@router.get("/stream/snapshot")
def stream_snapshot(stream_service=Depends(get_stream_session)):
    from fastapi.responses import Response
    selection = stream_service.frame_streamer.selection
    with selection.lock:
        if not selection.latest:
            raise HTTPException(409, "Wait for a video frame first.")
        return Response(content=selection.latest["jpeg"], media_type="image/jpeg",
                        headers={"Content-Disposition": "attachment; filename=frame.jpg"})
