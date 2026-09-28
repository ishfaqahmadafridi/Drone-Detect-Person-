"""
Detector Service Facade: Re-exports from app.services.detector.
Preserves backward compatibility with legacy scripts and tests.
"""

from app.services.detector import FPSProfiler, DronePersonDetectorService

__all__ = ["FPSProfiler", "DronePersonDetectorService"]
