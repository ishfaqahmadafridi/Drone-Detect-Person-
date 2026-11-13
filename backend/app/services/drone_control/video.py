"""Connect the existing aerial pipeline to Tello's UDP camera receiver."""
import time

from app.core.config import TELLO_VIDEO_URL, TELLO_VIDEO_STALE_SECONDS
from app.schemas.drone import DroneVideoStatus


def video_status(stream):
    requested = stream.source_type == "tello"
    last_frame = stream.source_provider.last_frame_at if requested else None
    receiving = last_frame is not None and time.monotonic() - last_frame < TELLO_VIDEO_STALE_SECONDS
    return DroneVideoStatus(
        requested=requested,
        receiving=receiving,
        message=("Live Tello camera frames are arriving." if receiving else
                 "Waiting for Tello camera frames; simulation fallback may be displayed." if requested else
                 "Tello camera is not selected."),
    )


def start_video(controller, session_id, stream):
    controller.start_video(session_id)
    stream.set_source("tello", TELLO_VIDEO_URL, transport="udp")
    return video_status(stream)
