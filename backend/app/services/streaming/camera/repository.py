"""
Camera State Repository: In-memory store for registered cameras and active camera pointers.
"""

from typing import Dict, List, Optional
from app.schemas.camera import CameraModel, CameraCreateRequest
from app.services.streaming.camera.seed import build_default_fleet

class CameraRepository:
    """
    Manages in-memory storage, querying, and dynamic registration of cameras.
    """

    def __init__(self):
        self._cameras: Dict[str, CameraModel] = {}
        self._active_camera_id: str = "CAM-01"
        self._seed_fleet()

    def _seed_fleet(self) -> None:
        for cam in build_default_fleet():
            self._cameras[cam.id] = cam

    def get_all(self) -> List[CameraModel]:
        return list(self._cameras.values())

    def get_by_id(self, camera_id: str) -> Optional[CameraModel]:
        return self._cameras.get(camera_id)

    def get_active(self) -> CameraModel:
        return self._cameras.get(
            self._active_camera_id,
            next(iter(self._cameras.values()))
        )

    def set_active_id(self, camera_id: str) -> None:
        self._active_camera_id = camera_id

    def add(self, req: CameraCreateRequest) -> CameraModel:
        next_idx = len(self._cameras) + 1
        cam_id = f"CAM-{next_idx:02d}"
        ch_num = f"CH-{next_idx:02d}"

        new_cam = CameraModel(
            id=cam_id,
            channel_num=ch_num,
            name=req.name,
            location=req.location,
            device_type=req.device_type,
            view_mode=req.view_mode,
            source_type=req.source_type,
            stream_url=req.stream_url,
            ip_address=req.ip_address,
            status="STANDBY",
            resolution=req.resolution or "1080p FHD @ 25 FPS",
        )
        self._cameras[cam_id] = new_cam
        return new_cam
