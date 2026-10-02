"""
Camera Registry Subsystem Entrypoint and Backward-Compatible Facade.
Delegates to modular camera subpackage at app.services.streaming.camera.
"""

from app.services.streaming.camera import (
    CameraRegistryService,
    camera_registry_service,
    CameraRepository,
    CameraStreamActivator,
    build_default_fleet,
)

__all__ = [
    "CameraRegistryService",
    "camera_registry_service",
    "CameraRepository",
    "CameraStreamActivator",
    "build_default_fleet",
]
