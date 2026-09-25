"""
Configuration Endpoints: Runtime Thresholds & Perimeter Zone Tuning.
"""

from fastapi import APIRouter
from app.services.stream_service import stream_service
from app.schemas.config import ConfigUpdateRequest

router = APIRouter()

@router.get("/config")
def get_config():
    cfg = stream_service.config
    return {
        "model_name": cfg.model_name,
        "confidence_threshold": cfg.confidence_threshold,
        "multi_person_threshold": cfg.multi_person_threshold,
        "proximity_alert_distance_px": cfg.proximity_alert_distance_px,
        "zone_polygon": cfg.default_zone_normalized,
        "source_type": stream_service.source_type
    }

@router.post("/config")
def update_config(req: ConfigUpdateRequest):
    poly = None
    if req.zone_polygon is not None:
        poly = [(float(pt[0]), float(pt[1])) for pt in req.zone_polygon]
    
    stream_service.update_config(
        multi_person_thresh=req.multi_person_threshold,
        conf_thresh=req.confidence_threshold,
        prox_dist=req.proximity_alert_distance_px,
        zone_polygon=poly
    )
    return {
        "message": "Configuration successfully updated",
        "config": get_config()
    }
