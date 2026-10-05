"""Read ranked candidates and retry a failed model load without restarting video."""
from fastapi import APIRouter
from app.schemas.reid import ReIDStatus
from app.services.reid.service import reid_service

router = APIRouter(prefix="/reid", tags=["Person Re-identification"])


@router.get("/status", response_model=ReIDStatus)
def get_reid_status():
    return reid_service.snapshot()


@router.post("/retry", response_model=ReIDStatus)
def retry_reid():
    return reid_service.retry()
