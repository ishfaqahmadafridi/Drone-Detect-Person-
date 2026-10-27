"""Build the deployment fleet from validated central configuration."""
from typing import List
from app.core.config import CAMERA_FLEET
from app.schemas.camera import CameraModel


def build_default_fleet() -> List[CameraModel]:
    return [CameraModel.model_validate(camera) for camera in CAMERA_FLEET]
