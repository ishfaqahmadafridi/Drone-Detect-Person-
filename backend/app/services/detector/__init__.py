"""
Detector Subpackage: Computer vision inference and tracking coordinator.
"""

from app.services.detector.profiler import FPSProfiler
from app.services.detector.detector import DronePersonDetectorService

__all__ = ["FPSProfiler", "DronePersonDetectorService"]
