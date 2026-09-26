"""Local BIRDS EYE dashboard and two-model inference API.

Run: .venv/Scripts/python.exe app.py
The browser owns camera/video playback. Only selected frames go to this local process.
"""

import argparse
import io
import math
import os
import warnings
from pathlib import Path
from typing import Literal
from uuid import UUID

import cv2
import numpy as np
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from PIL import Image, UnidentifiedImageError
from starlette.concurrency import run_in_threadpool

from inference import PersonInference
from tracking import StaleTrackingFrame

ROOT = Path(__file__).resolve().parent
FRONTEND = ROOT / "frontend"
MAX_BODY = 8 * 1024 * 1024
MAX_PIXELS = 16_000_000


def decode_frame(data: bytes) -> np.ndarray:
    if not data:
        raise ValueError("Send a JPEG or PNG frame in the request body.")
    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(io.BytesIO(data)) as header:
                if header.format not in {"JPEG", "PNG"}:
                    raise ValueError("Only JPEG and PNG frames are supported.")
                if header.width * header.height > MAX_PIXELS:
                    raise ValueError("Frame exceeds the 16 megapixel limit.")
                header.verify()
        frame = cv2.imdecode(np.frombuffer(data, dtype=np.uint8), cv2.IMREAD_COLOR)
    except (UnidentifiedImageError, OSError, Image.DecompressionBombError, Image.DecompressionBombWarning) as error:
        raise ValueError("Could not decode the frame as a valid JPEG or PNG.") from error
    if frame is None:
        raise ValueError("Could not decode the image frame.")
    return frame


def create_app(engine=None) -> FastAPI:
    application = FastAPI(title="BIRDS EYE detection API", version="0.3.0")
    application.state.engine = engine if engine is not None else PersonInference(os.getenv("BIRDSEYE_DEVICE", "cpu"))

    @application.get("/api/health")
    def health():
        return {"status": "ok", "models": application.state.engine.status(), "aerial_tracking": "ByteTrack", "storage": "frames processed in memory; temporary per-video tracker state"}

    @application.delete("/api/tracking/{session_id}")
    def release_tracking(session_id: UUID):
        application.state.engine.release_tracking(str(session_id))
        return {"released": True}

    @application.post("/api/detect/{view}")
    async def detect(
        view: Literal["ground", "aerial"],
        request: Request,
        frame_id: int = Query(0, ge=0, le=2**53 - 1),
        imgsz: int = Query(640),
        confidence: float = Query(0.25, ge=0.05, le=0.95),
        tracking_session: UUID | None = None,
        source_time: float | None = Query(None, ge=0),
    ):
        if imgsz not in {640, 960, 1280}:
            raise HTTPException(422, "imgsz must be 640, 960, or 1280.")
        if tracking_session and (view != "aerial" or source_time is None or not math.isfinite(source_time)):
            raise HTTPException(422, "Tracking requires an aerial frame with a finite source_time.")
        content_type = request.headers.get("content-type", "").split(";")[0].lower()
        if content_type not in {"image/jpeg", "image/png"}:
            raise HTTPException(415, "Content-Type must be image/jpeg or image/png.")
        data = bytearray()
        async for chunk in request.stream():
            if len(data) + len(chunk) > MAX_BODY:
                raise HTTPException(413, "Frame is larger than 8 MB.")
            data.extend(chunk)
        try:
            frame = decode_frame(bytes(data))
        except ValueError as error:
            raise HTTPException(400, str(error)) from error
        try:
            options = {"tracking_session": str(tracking_session), "source_time": source_time} if tracking_session else {}
            return await run_in_threadpool(application.state.engine.predict, view, frame, frame_id, imgsz, confidence, **options)
        except StaleTrackingFrame as error:
            raise HTTPException(409, str(error)) from error
        except FileNotFoundError as error:
            raise HTTPException(503, str(error)) from error
        except Exception as error:
            raise HTTPException(503, f"{view.capitalize()} inference unavailable: {error}") from error

    @application.get("/")
    def index():
        return FileResponse(FRONTEND / "index.html", headers={"Cache-Control": "no-store"})

    @application.get("/styles.css")
    def styles():
        return FileResponse(FRONTEND / "styles.css", headers={"Cache-Control": "no-store"})

    application.mount("/src", StaticFiles(directory=FRONTEND / "src"), name="src")
    application.mount("/assets", StaticFiles(directory=FRONTEND / "assets"), name="assets")
    return application


app = create_app()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="BIRDS EYE local two-model dashboard")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--device", default="cpu", help="cpu or an installed CUDA device, e.g. 0")
    args = parser.parse_args()
    app.state.engine.device = args.device
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=args.port)
