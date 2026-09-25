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
    stream_service.active_websockets.append(websocket)
    try:
        while True:
            await websocket.send_json(stream_service.latest_telemetry)
            await asyncio.sleep(0.12)  # ~8 updates/sec
    except (WebSocketDisconnect, Exception):
        if websocket in stream_service.active_websockets:
            stream_service.active_websockets.remove(websocket)
