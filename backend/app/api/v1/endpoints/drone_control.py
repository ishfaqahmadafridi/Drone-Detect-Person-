"""Manual control API; video source selection is intentionally independent."""
from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import ValidationError
from starlette.concurrency import run_in_threadpool
from app.schemas.drone import DroneControlSession, DroneControlConnect, DroneControlAction, DroneControlInput, DroneControlStatus, DroneVideoStatus
from app.services.drone_control.controller import drone_movement_controller

router = APIRouter(prefix="/drone/manual", tags=["Manual Drone Control"])


@router.get("/status", response_model=DroneControlStatus)
def status():
    return drone_movement_controller.status()


@router.post("/connect", response_model=DroneControlStatus)
def connect(request: DroneControlConnect):
    return drone_movement_controller.connect(request.session_id, confirmed_landed=request.confirmed_landed)


@router.post("/input", response_model=DroneControlStatus)
def movement(request: DroneControlInput):
    return drone_movement_controller.input(request)


@router.websocket("/input")
async def movement_socket(websocket: WebSocket):
    """Persistent movement channel; ownership and sequence checks match HTTP input."""
    await websocket.accept()
    try:
        while True:
            try:
                request = DroneControlInput.model_validate(await websocket.receive_json())
                result = await run_in_threadpool(drone_movement_controller.input, request)
            except (ValidationError, ValueError):
                await websocket.send_json({"error": "Invalid movement input."})
                await websocket.close(code=1008)
                return
            except HTTPException as exc:
                await websocket.send_json({"error": str(exc.detail)})
                await websocket.close(code=1008)
                return
            await websocket.send_json({"sequence": request.sequence, "status": result.model_dump(mode="json")})
    except WebSocketDisconnect:
        pass  # Existing input lease expires without further browser heartbeats.


@router.post("/action", response_model=DroneControlStatus)
def action(request: DroneControlAction):
    return drone_movement_controller.action(request.session_id, request.action)


@router.post("/emergency", response_model=DroneControlStatus)
def emergency(request: DroneControlSession):
    return drone_movement_controller.emergency(request.session_id)


@router.post("/disconnect", response_model=DroneControlStatus)
def disconnect(request: DroneControlSession):
    return drone_movement_controller.disconnect(request.session_id)


def _aerial_stream():
    # Lazy import keeps isolated controller tests independent of vision startup.
    from app.services.streaming.channels import get_stream_session
    return get_stream_session(channel="aerial")


@router.post("/video", response_model=DroneVideoStatus)
def start_camera(request: DroneControlSession):
    from app.services.drone_control.video import start_video
    return start_video(drone_movement_controller, request.session_id, _aerial_stream())


@router.get("/video", response_model=DroneVideoStatus)
def camera_status():
    from app.services.drone_control.video import video_status
    return video_status(_aerial_stream())
