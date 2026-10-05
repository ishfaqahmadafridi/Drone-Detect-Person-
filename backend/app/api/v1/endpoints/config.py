"""
Configuration Endpoints: Runtime Thresholds & Perimeter Zone Tuning.
"""

from fastapi import APIRouter, Depends
from app.services.streaming.channels import get_stream_session
from app.schemas.config import ConfigUpdateRequest

router = APIRouter()

@router.get("/config")
def get_config(stream_service=Depends(get_stream_session)):
    cfg = stream_service.config
    return {
        "model_name": cfg.model_name,
        "confidence_threshold": cfg.confidence_threshold,
        "zone_polygon": cfg.default_zone_normalized,
        "source_type": stream_service.source_type
    }

@router.post("/config")
def update_config(req: ConfigUpdateRequest, stream_service=Depends(get_stream_session)):
    poly = None
    if req.zone_polygon is not None:
        poly = [(float(pt[0]), float(pt[1])) for pt in req.zone_polygon]
    
    stream_service.update_config(
        conf_thresh=req.confidence_threshold,
        zone_polygon=poly
    )
    return {
        "message": "Configuration successfully updated",
        "config": get_config(stream_service)
    }
