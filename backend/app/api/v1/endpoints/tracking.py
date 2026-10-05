"""
Targeting & Detection Operational Mode Endpoints.
Supports AUTO detection (continuous surveillance) and MANUAL target acquisition (operator click-to-box).
"""

from fastapi import Depends, APIRouter
from app.services.streaming.channels import get_stream_session
from app.schemas.config import TrackingModeRequest, TargetSelectRequest
from app.schemas.selection import SelectionCommitRequest, SelectionCancelRequest

router = APIRouter(prefix="/tracking", tags=["Targeting & Detection Mode"])


@router.get("/status")
def get_tracking_status(stream_service=Depends(get_stream_session)):
    """
    Returns active targeting mode and currently designated target IDs.
    """
    cfg = stream_service.config
    return {
        "mode": getattr(cfg, "tracking_mode", "auto"),
        "selected_ids": getattr(cfg, "selected_target_ids", [])
    }


@router.post("/mode")
def set_tracking_mode(req: TrackingModeRequest, stream_service=Depends(get_stream_session)):
    """
    Switches between AUTO and MANUAL target detection modes.
    """
    return stream_service.set_tracking_mode(
        mode=req.mode,
        selected_ids=req.selected_ids
    )


@router.post("/select")
def select_target(req: TargetSelectRequest, stream_service=Depends(get_stream_session)):
    """
    Designates or toggles a specific target by click coordinate or ID in manual mode.
    """
    return stream_service.select_target(
        x=req.x,
        y=req.y,
        target_id=req.target_id
    )


@router.post("/clear")
def clear_targets(stream_service=Depends(get_stream_session)):
    """
    Clears all designated targets in manual mode.
    """
    return stream_service.clear_manual_targets()



@router.post("/freeze")
def freeze_selection(stream_service=Depends(get_stream_session)):
    return stream_service.frame_streamer.selection.freeze(stream_service.config)


@router.post("/commit")
def commit_selection(req: SelectionCommitRequest, stream_service=Depends(get_stream_session)):
    return stream_service.frame_streamer.selection.commit(
        req.token, req.selected_ids, stream_service.config, stream_service.telemetry_store
    )


@router.post("/resume")
def resume_selection(req: SelectionCancelRequest, stream_service=Depends(get_stream_session)):
    return stream_service.frame_streamer.selection.cancel(req.token)
