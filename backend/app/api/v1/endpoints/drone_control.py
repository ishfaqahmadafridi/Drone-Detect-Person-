"""Manual control API; video source selection is intentionally independent."""
from fastapi import APIRouter
from app.schemas.drone import DroneControlSession, DroneControlAction, DroneControlInput, DroneControlStatus
from app.services.drone_control.controller import drone_movement_controller

router = APIRouter(prefix="/drone/manual", tags=["Manual Drone Control"])


@router.get("/status", response_model=DroneControlStatus)
def status():
    return drone_movement_controller.status()


@router.post("/connect", response_model=DroneControlStatus)
def connect(request: DroneControlSession):
    return drone_movement_controller.connect(request.session_id)


@router.post("/input", response_model=DroneControlStatus)
def movement(request: DroneControlInput):
    return drone_movement_controller.input(request)


@router.post("/action", response_model=DroneControlStatus)
def action(request: DroneControlAction):
    return drone_movement_controller.action(request.session_id, request.action)


@router.post("/disconnect", response_model=DroneControlStatus)
def disconnect(request: DroneControlSession):
    return drone_movement_controller.disconnect(request.session_id)
