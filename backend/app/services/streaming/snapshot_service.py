"""Save evidence from the shared producer without advancing capture or tracking."""
from fastapi import HTTPException


def capture_stream_snapshot(stream):
    selection = stream.frame_streamer.selection
    with selection.lock:
        if selection.frame_is_current is not None and not selection.frame_is_current():
            raise HTTPException(409, "Wait for detection on the current camera source.")
        latest = selection.latest
        if not latest or not latest.get("jpeg"):
            raise HTTPException(409, "Wait for a video frame before capturing evidence.")
        jpeg = latest.get("jpeg")
        view = latest.get("view_mode") or stream.config.view_mode
    try:
        filename = stream.alert_manager.evidence_recorder.capture_manual_snapshot(view_mode=view, jpeg=jpeg)
    except OSError as exc:
        raise HTTPException(503, "Failed to save snapshot evidence.") from exc
    return {
        "message": f"Evidentiary snapshot captured for {view} perspective",
        "filename": filename,
        "url": f"/snapshots/{filename}",
        "view_mode": view,
    }
