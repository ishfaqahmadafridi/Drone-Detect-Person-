"""Bounded video storage and decode validation before changing the active feed."""
from pathlib import Path
from uuid import uuid4

import cv2
from fastapi import HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool

from app.core.config import (
    UPLOADS_DIR, VIDEO_UPLOAD_MAX_BYTES, VIDEO_UPLOAD_CHUNK_BYTES,
    VIDEO_UPLOAD_EXTENSIONS,
)


def validate_video(path: Path) -> None:
    capture = cv2.VideoCapture(str(path))
    try:
        ok, frame = capture.read()
        if not ok or frame is None:
            raise HTTPException(422, "This file cannot be decoded as video. Try an MP4 with H.264 video.")
    finally:
        capture.release()


async def save_video(file: UploadFile) -> Path:
    suffix = Path(file.filename or "").suffix.lower()
    if suffix not in VIDEO_UPLOAD_EXTENSIONS:
        await file.close()
        raise HTTPException(415, "Supported videos: MP4, AVI, MOV, MKV, WebM and M4V.")
    path = Path(UPLOADS_DIR) / f"{uuid4().hex}{suffix}"
    size = 0
    try:
        with path.open("wb") as output:
            while chunk := await file.read(VIDEO_UPLOAD_CHUNK_BYTES):
                size += len(chunk)
                if size > VIDEO_UPLOAD_MAX_BYTES:
                    raise HTTPException(413, "Video exceeds the upload size limit.")
                await run_in_threadpool(output.write, chunk)
        await run_in_threadpool(validate_video, path)
        return path
    except BaseException:
        path.unlink(missing_ok=True)
        raise
    finally:
        await file.close()
