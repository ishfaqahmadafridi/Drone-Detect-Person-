"""
V1 API Router Aggregator.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import (
    stream,
    ws,
    config,
    alerts,
    snapshots,
    drone,
    recordings,
    evidence,
    tracking,
    cameras,
    generative,
)

api_router = APIRouter()

api_router.include_router(cameras.router)
api_router.include_router(stream.router, tags=["Stream & Video"])
api_router.include_router(generative.router, tags=["Generative Aerial Diffusion"])
api_router.include_router(tracking.router, tags=["Targeting & Detection Mode"])
api_router.include_router(drone.router, tags=["Drone Flight & Avionics"])
api_router.include_router(ws.router, tags=["WebSocket Telemetry"])
api_router.include_router(config.router, tags=["Surveillance Config"])
api_router.include_router(alerts.router, tags=["Incident Alerts"])
api_router.include_router(snapshots.router, tags=["Evidence Snapshots"])
api_router.include_router(recordings.router, tags=["Video Recordings & Clips"])
api_router.include_router(evidence.router, tags=["Evidence Database Archive"])

