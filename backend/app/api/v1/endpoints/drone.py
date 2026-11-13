"""
Legacy simulated mission commands (CCTV presets and the simulated flight deck).
Real Tello control lives in drone_control.py.
"""

from fastapi import APIRouter, HTTPException
from app.services.stream_service import stream_service
from app.schemas.drone import DroneCommandRequest, DroneCommandResponse

router = APIRouter()

@router.post("/drone/command", response_model=DroneCommandResponse)
def execute_flight_command(req: DroneCommandRequest):
    """
    Executes flight operations (takeoff, patrol, hover, return to launch, camera connect).
    """
    valid_actions = [
        "takeoff", "launch", "patrol", "hover", "rtl", "return_to_launch", "land",
        "connect_drone", "connect_webcam", "preset_gate", "preset_patrol", "ir_filter", "reboot_sensor"
    ]
    action_clean = req.action.lower().strip()
    if action_clean not in valid_actions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid flight action '{req.action}'. Permitted directives: {valid_actions}"
        )

    # If action is connect_webcam, also switch stream source to webcam
    if action_clean == "connect_webcam":
        stream_service.set_view_mode("ground")
        stream_service.set_source("webcam", "0")
    elif action_clean in ["takeoff", "patrol"]:
        # If launching drone flight, ensure stream source is aerial drone
        stream_service.set_source("synthetic")
        stream_service.set_view_mode("aerial")

    res = stream_service.execute_drone_command(action_clean, req.target_altitude)
    return res
