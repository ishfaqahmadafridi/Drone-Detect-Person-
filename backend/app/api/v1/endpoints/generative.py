"""
Generative Aerial Diffusion API Endpoints.
Translates Ground CCTV / Street camera snapshots into top-down Aerial Drone perspectives.
"""

import numpy as np
from fastapi import APIRouter, HTTPException
from app.schemas.generative import AerialDiffusionRequest, AerialDiffusionResponse
from app.services.generative_service import generative_service
from app.services.stream_service import stream_service

router = APIRouter(prefix="/generative", tags=["Generative Aerial Diffusion"])


@router.post("/synthesize-aerial", response_model=AerialDiffusionResponse)
async def synthesize_aerial_view(req: AerialDiffusionRequest):
    """
    Synthesize an overhead aerial perspective from a ground CCTV snapshot or active live feed.
    """
    numpy_frame = None

    # If no explicit image path/base64 provided, capture current active camera frame
    if not req.source_image_path and not req.source_image_base64:
        try:
            ret, frame = stream_service.read_frame()
            if ret and frame is not None:
                numpy_frame = frame
        except Exception:
            pass

        # If live stream is currently idle/standby, generate synthetic perimeter test frame
        if numpy_frame is None:
            numpy_frame = np.full((720, 1280, 3), 128, dtype=np.uint8)

    result = generative_service.synthesize_aerial_view(
        image_path=req.source_image_path,
        image_base64=req.source_image_base64,
        numpy_frame=numpy_frame,
        custom_prompt=req.prompt,
        custom_negative_prompt=req.negative_prompt,
        num_inference_steps=req.num_inference_steps,
        guidance_scale=req.guidance_scale,
    )

    if not result.get("success", False):
        raise HTTPException(
            status_code=500,
            detail=result.get("message", "Aerial view synthesis failed.")
        )

    return AerialDiffusionResponse(
        success=True,
        message=result["message"],
        aerial_image_url=result.get("aerial_image_url"),
        aerial_image_path=result.get("aerial_image_path"),
        generation_time_ms=result.get("generation_time_ms", 0.0),
        device_used=result.get("device_used", "unknown"),
        prompt_used=result.get("prompt_used", ""),
    )
