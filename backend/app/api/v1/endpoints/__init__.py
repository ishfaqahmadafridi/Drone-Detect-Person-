"""
API v1 Endpoints Package.
"""

from app.api.v1.endpoints import (
    alerts,
    config,
    drone,
    evidence,
    recordings,
    snapshots,
    stream,
    ws,
)

__all__ = [
    "alerts",
    "config",
    "drone",
    "evidence",
    "recordings",
    "snapshots",
    "stream",
    "ws",
]
