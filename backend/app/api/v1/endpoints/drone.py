"""
Drone Endpoints: Mission Flight Control, Avionics Telemetry, and Camera Health Diagnostics.
"""

from fastapi import APIRouter, HTTPException
from app.services.stream_service import stream_service
from app.schemas.drone import DroneCommandRequest, DroneCommandResponse, DroneAvionicsData
from app.services.streaming.drone_service import drone_avionics_service

router = APIRouter()

@router.get("/drone/avionics", response_model=DroneAvionicsData)
def get_drone_avionics():
    """
    Returns real-time drone avionics, 6S LiPo battery health, altitude, and RF link metrics.
    """
    snapshot = drone_avionics_service.get_avionics_snapshot()
    return snapshot

@router.post("/drone/command", response_model=DroneCommandResponse)
def execute_flight_command(req: DroneCommandRequest):
    """
    Executes flight operations (takeoff, patrol, hover, return to launch, camera connect).
    """
    valid_actions = ["takeoff", "launch", "patrol", "hover", "rtl", "return_to_launch", "land", "connect_drone", "connect_webcam"]
    action_clean = req.action.lower().strip()
    if action_clean not in valid_actions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid flight action '{req.action}'. Permitted directives: {valid_actions}"
        )

    # If action is connect_webcam, also switch stream source to webcam
    if action_clean == "connect_webcam":
        stream_service.set_source("webcam", "0")
        stream_service.set_view_mode("ground")
    elif action_clean in ["takeoff", "patrol"]:
        # If launching drone flight, ensure stream source is aerial drone
        stream_service.set_source("synthetic")
        stream_service.set_view_mode("aerial")

    res = stream_service.execute_drone_command(action_clean, req.target_altitude)
    return res

@router.get("/drone/camera/status")
def get_camera_status():
    """
    Provides camera sensor link health, resolution, working condition, and active detection state.
    """
    avionics = drone_avionics_service.get_avionics_snapshot()
    return {
        "camera_online": avionics["camera_online"],
        "camera_resolution": avionics["camera_resolution"],
        "camera_fps": avionics["camera_fps"],
        "camera_sensor_temp_c": avionics["camera_sensor_temp_c"],
        "camera_detecting": avionics["camera_detecting"],
        "source_type": stream_service.source_type,
        "view_mode": stream_service.detector.active_view
    }
