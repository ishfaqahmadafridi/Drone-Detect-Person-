"""
WebSocket Endpoints: High-Frequency Telemetry Stream.
"""

import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.stream_service import stream_service

router = APIRouter()

@router.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    stream_service.telemetry_store.register_websocket(websocket)
    try:
        while True:
            await websocket.send_json(stream_service.latest_telemetry)
            await asyncio.sleep(0.12)  # ~8 updates/sec
    except (WebSocketDisconnect, Exception):
        stream_service.telemetry_store.unregister_websocket(websocket)
