"""
Modular Camera Registry Subsystem.
"""

from app.services.streaming.camera.seed import build_default_fleet
from app.services.streaming.camera.repository import CameraRepository
from app.services.streaming.camera.activator import CameraStreamActivator
from app.services.streaming.camera.service import CameraRegistryService, camera_registry_service

__all__ = [
    "build_default_fleet",
    "CameraRepository",
    "CameraStreamActivator",
    "CameraRegistryService",
    "camera_registry_service",
]
