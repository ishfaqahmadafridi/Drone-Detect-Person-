"""
Telemetry State Store: Thread-safe repository for live detection metrics and active WebSocket client tracking.
"""

import threading
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import WebSocket

from app.core.constants import (
    DEFAULT_ZONE_POLYGON,
    DEFAULT_MULTI_PERSON_THRESHOLD,
    DEFAULT_CONFIDENCE_THRESHOLD,
    DEFAULT_PROXIMITY_ALERT_DISTANCE_PX,
)

class TelemetryStateStore:
    """
    Manages live telemetry snapshots and WebSocket subscriber pools.
    """
    def __init__(self):
        self._lock = threading.Lock()
        self.active_websockets: List[WebSocket] = []
        self._state: Dict = {
            "threat_level": "CLEAR",
            "alert_msg": "SYSTEM INITIALIZING",
            "total_persons": 0,
            "intruders_count": 0,
            "gathering_pairs": 0,
            "fps": 0.0,
            "frame_idx": 0,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "detections": [],
            "source_type": "synthetic",
            "view_mode": "aerial",
            "multi_person_threshold": DEFAULT_MULTI_PERSON_THRESHOLD,
            "confidence_threshold": DEFAULT_CONFIDENCE_THRESHOLD,
            "proximity_distance_px": DEFAULT_PROXIMITY_ALERT_DISTANCE_PX,
            "zone_polygon": [list(pt) for pt in DEFAULT_ZONE_POLYGON]
        }

    @property
    def latest(self) -> Dict:
        with self._lock:
            return self._state.copy()

    def update(self, **kwargs):
        """
        Updates live telemetry attributes safely under lock.
        """
        with self._lock:
            self._state.update(kwargs)
            if "timestamp" not in kwargs:
                self._state["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def register_websocket(self, websocket: WebSocket):
        """
        Adds a new connected WebSocket client to the broadcast pool.
        """
        with self._lock:
            if websocket not in self.active_websockets:
                self.active_websockets.append(websocket)

    def unregister_websocket(self, websocket: WebSocket):
        """
        Removes a disconnected WebSocket client.
        """
        with self._lock:
            if websocket in self.active_websockets:
                self.active_websockets.remove(websocket)
