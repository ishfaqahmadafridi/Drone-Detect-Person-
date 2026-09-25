"""
Legacy detector alias for backward compatibility.
Canonical service is located in app.services.detector_service.
"""
from app.services.detector_service import DronePersonDetectorService as DronePersonDetector

__all__ = ["DronePersonDetector"]
