"""
Camera Fleet Management Endpoints: Multi-Camera Registration, Location Metadata, and Feed Activation.
"""

from fastapi import APIRouter, HTTPException, status
from app.schemas.camera import (
    CameraModel,
    CameraCreateRequest,
    CameraListResponse,
    CameraSwitchResponse,
)
from app.services.streaming.camera_registry import camera_registry_service

router = APIRouter(prefix="/cameras", tags=["Camera Fleet & Multi-Sensor"])

@router.get("", response_model=CameraListResponse)
def list_cameras():
    """
    Retrieve all configured tactical cameras with distinct deployment locations and statuses.
    """
    return CameraListResponse(
        cameras=camera_registry_service.get_all_cameras(),
        active_camera_id=camera_registry_service.get_active_camera().id,
    )

@router.get("/active", response_model=CameraModel)
def get_active_camera():
    """
    Retrieve the currently active camera feed details and deployment sector.
    """
    return camera_registry_service.get_active_camera()

@router.get("/{camera_id}", response_model=CameraModel)
def get_camera_by_id(camera_id: str):
    """
    Retrieve a specific camera by ID.
    """
    cam = camera_registry_service.get_camera(camera_id)
    if not cam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Camera with ID '{camera_id}' not found.",
        )
    return cam

@router.post("", response_model=CameraModel, status_code=status.HTTP_201_CREATED)
def register_new_camera(req: CameraCreateRequest):
    """
    Register a newly deployed ground CCTV, Wi-Fi camera, or smartphone sensor.
    """
    return camera_registry_service.add_camera(req)

@router.post("/{camera_id}/activate", response_model=CameraSwitchResponse)
def activate_camera_feed(camera_id: str):
    """
    Switch active video feed, perspective model, and HUD location to the selected camera.
    """
    cam = camera_registry_service.activate_camera(camera_id)
    if not cam:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Camera with ID '{camera_id}' not found.",
        )

    return CameraSwitchResponse(
        success=True,
        message=f"Active sensor feed successfully switched to {cam.channel_num} ({cam.name}) at {cam.location}.",
        active_camera=cam,
    )
