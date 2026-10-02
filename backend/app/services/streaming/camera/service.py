"""
Camera Registry Service: High-level Coordinator Facade.
"""

from typing import List, Optional
from app.schemas.camera import CameraModel, CameraCreateRequest
from app.services.streaming.camera.repository import CameraRepository
from app.services.streaming.camera.activator import CameraStreamActivator

class CameraRegistryService:
    """
    Coordinates camera repository lookups and pipeline activation.
    """

    def __init__(self, repository: Optional[CameraRepository] = None):
        self._repo = repository or CameraRepository()

    def get_all_cameras(self) -> List[CameraModel]:
        return self._repo.get_all()

    def get_camera(self, camera_id: str) -> Optional[CameraModel]:
        return self._repo.get_by_id(camera_id)

    def get_active_camera(self) -> CameraModel:
        return self._repo.get_active()

    def add_camera(self, req: CameraCreateRequest) -> CameraModel:
        return self._repo.add(req)

    def activate_camera(self, camera_id: str) -> Optional[CameraModel]:
        target = self._repo.get_by_id(camera_id)
        if not target:
            return None

        # Set active pointer in repository
        self._repo.set_active_id(camera_id)

        # Delegate activation to pipeline activator
        return CameraStreamActivator.activate(target)

camera_registry_service = CameraRegistryService()
