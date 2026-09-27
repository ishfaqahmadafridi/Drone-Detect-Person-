"""
V1 API Router Aggregator.
"""

from fastapi import APIRouter
from app.api.v1.endpoints import stream, ws, config, alerts, snapshots

api_router = APIRouter()

api_router.include_router(stream.router, tags=["Stream & Video"])
api_router.include_router(ws.router, tags=["WebSocket Telemetry"])
api_router.include_router(config.router, tags=["Surveillance Config"])
api_router.include_router(alerts.router, tags=["Incident Alerts"])
api_router.include_router(snapshots.router, tags=["Evidence Snapshots"])
