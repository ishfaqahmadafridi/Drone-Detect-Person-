"""
Stream Endpoints: MJPEG Live Video Feed & Source Control.
"""

import os
import time
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.services.stream_service import stream_service
from app.schemas.config import StreamSourceRequest
from app.core.config import UPLOADS_DIR

router = APIRouter()

@router.get("/stream/video_feed")
def get_video_feed():
    return StreamingResponse(
        stream_service.generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.post("/stream/source")
def switch_source(req: StreamSourceRequest):
    valid_types = ["synthetic", "webcam", "file", "rtsp"]
    if req.source_type not in valid_types:
        raise HTTPException(status_code=400, detail=f"Invalid source_type. Must be one of {valid_types}")
    
    stream_service.set_source(req.source_type, req.source_path)
    return {
        "message": f"Source updated to {req.source_type}",
        "source_type": stream_service.source_type,
        "source_path": stream_service.source_path
    }

@router.post("/video/upload")
async def upload_video(file: UploadFile = File(...)):
    filename = f"{int(time.time())}_{file.filename}"
    save_path = os.path.join(UPLOADS_DIR, filename)
    with open(save_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    stream_service.set_source("file", save_path)
    return {
        "message": "File uploaded successfully. Streaming started.",
        "filename": filename,
        "filepath": save_path
    }
