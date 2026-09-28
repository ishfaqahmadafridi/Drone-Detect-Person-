"""
Stream Service: High-level Entrypoint and Singleton Coordinator.
Delegates to the modular streaming subsystem under app.services.streaming.
"""

from app.services.streaming.stream_coordinator import StreamManagerService
from app.services.streaming.drone_service import DroneAvionicsManager, drone_avionics_service

# Global Singleton Instance for application-wide access across endpoints
stream_service = StreamManagerService()

# Aliases for backward compatibility
DroneStreamService = StreamManagerService
drone_stream_service = stream_service

__all__ = [
    "StreamManagerService",
    "stream_service",
    "DroneStreamService",
    "drone_stream_service",
    "DroneAvionicsManager",
    "drone_avionics_service"
]


