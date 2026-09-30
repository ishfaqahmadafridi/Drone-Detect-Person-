"""
Targeting & Detection Operational Mode Endpoints.
Supports AUTO detection (continuous surveillance) and MANUAL target acquisition (operator click-to-box).
"""

from fastapi import APIRouter
from app.services.stream_service import stream_service
from app.schemas.config import TrackingModeRequest, TargetSelectRequest

router = APIRouter(prefix="/tracking", tags=["Targeting & Detection Mode"])


@router.get("/status")
def get_tracking_status():
    """
    Returns active targeting mode and currently designated target IDs.
    """
    cfg = stream_service.config
    return {
        "mode": getattr(cfg, "tracking_mode", "auto"),
        "selected_ids": getattr(cfg, "selected_target_ids", [])
    }


@router.post("/mode")
def set_tracking_mode(req: TrackingModeRequest):
    """
    Switches between AUTO and MANUAL target detection modes.
    """
    return stream_service.set_tracking_mode(
        mode=req.mode,
        selected_ids=req.selected_ids
    )


@router.post("/select")
def select_target(req: TargetSelectRequest):
    """
    Designates or toggles a specific target by click coordinate or ID in manual mode.
    """
    return stream_service.select_target(
        x=req.x,
        y=req.y,
        target_id=req.target_id
    )


@router.post("/clear")
def clear_targets():
    """
    Clears all designated targets in manual mode.
    """
    return stream_service.clear_manual_targets()
