"""
Coordinator Package: Real-Time Stream Ingestion, Vision Processing, and Target Tracking Orchestration.
"""

from app.services.streaming.coordinator.tracking_manager import TargetTrackingManager
from app.services.streaming.coordinator.manager import StreamManagerService

__all__ = [
    "TargetTrackingManager",
    "StreamManagerService",
]
