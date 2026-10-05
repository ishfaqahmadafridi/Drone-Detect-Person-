"""
WebSocket Endpoints: High-Frequency Telemetry Stream.
"""

import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.streaming.channels import get_stream_session, Channel
from typing import Optional

router = APIRouter()

@router.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket, channel: Optional[Channel] = None):
    session = get_stream_session(channel)
    await websocket.accept()
    session.telemetry_store.register_websocket(websocket)
    try:
        while True:
            current_session = get_stream_session(channel)
            if current_session is not session:
                session.telemetry_store.unregister_websocket(websocket)
                session = current_session
                session.telemetry_store.register_websocket(websocket)
            await websocket.send_json(session.latest_telemetry)
            await asyncio.sleep(0.12)  # ~8 updates/sec
    except (WebSocketDisconnect, Exception):
        session.telemetry_store.unregister_websocket(websocket)
