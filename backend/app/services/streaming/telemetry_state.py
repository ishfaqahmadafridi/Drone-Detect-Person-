"""
Telemetry State Store: Thread-safe repository for live detection metrics and active WebSocket client tracking.
"""

import threading
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import WebSocket

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
            "multi_person_threshold": 2,
            "confidence_threshold": 0.35,
            "proximity_distance_px": 120,
            "zone_polygon": [[0.25, 0.25], [0.75, 0.25], [0.75, 0.75], [0.25, 0.75]]
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
