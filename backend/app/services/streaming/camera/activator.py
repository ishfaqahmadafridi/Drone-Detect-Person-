"""
Camera Stream Activator: Couples camera perspective and video source with stream coordinator.
"""

from typing import Optional
from app.schemas.camera import CameraModel
from app.services.stream_service import stream_service

class CameraStreamActivator:
    """
    Activates camera feeds into the primary OpenCV vision pipeline.
    """

    @staticmethod
    def activate(camera: CameraModel) -> CameraModel:
        """
        Switches video source, sets perspective view (aerial vs ground), and marks camera online.
        """
        stream_service.set_source(
            camera.source_type,
            camera.stream_url if camera.stream_url else None
        )
        stream_service.set_view_mode(camera.view_mode)
        camera.status = "ONLINE"
        return camera
