"""
Stream Coordinator Facade: Backward-compatible entrypoint for StreamManagerService and CoordinatorConfig.
Decoupled and split into modular subservices under `app.services.streaming.coordinator`.
"""

from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.coordinator import StreamManagerService, TargetTrackingManager

__all__ = [
    "CoordinatorConfig",
    "StreamManagerService",
    "TargetTrackingManager",
]
