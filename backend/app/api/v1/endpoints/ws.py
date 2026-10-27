"""
WebSocket Endpoints: High-Frequency Telemetry Stream.
"""

import asyncio
from app.core.config import WS_TELEMETRY_INTERVAL_SECONDS
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
            await asyncio.sleep(WS_TELEMETRY_INTERVAL_SECONDS)
    except (WebSocketDisconnect, Exception):
        session.telemetry_store.unregister_websocket(websocket)
