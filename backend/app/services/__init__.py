"""
Services Subpackage: Modular computer vision, telemetry, alert, tracking, and inference services.
"""

from importlib import import_module

# These cheap aliases share names with their modules; bind them explicitly to
# preserve the legacy instance exports regardless of later submodule imports.
from app.services.inference_service import MultiViewInferenceService, inference_service
from app.services.tracking_service import TargetTrackerService, tracking_service

_LAZY_EXPORTS = {
    "AlertManagerService": "alert_service",
    "TacticalFrameAnnotator": "annotation_service",
    "TacticalAnnotationTheme": "annotation_service",
    "DronePersonDetectorService": "detector_service",
    "FPSProfiler": "detector_service",
    "DroneStreamService": "stream_service",
    "drone_stream_service": "stream_service",
    "ZoneMonitorService": "zone_service",
    "AerialDiffusionService": "generative_service",
    "generative_service": "generative_service",
}


def __getattr__(name):
    # A model worker must not initialize YOLO, camera sources or the evidence DB.
    if name not in _LAZY_EXPORTS:
        raise AttributeError(name)
    value = getattr(import_module(f"app.services.{_LAZY_EXPORTS[name]}"), name)
    globals()[name] = value
    return value


__all__ = [
    "AlertManagerService",
    "TacticalFrameAnnotator",
    "TacticalAnnotationTheme",
    "DronePersonDetectorService",
    "FPSProfiler",
    "MultiViewInferenceService",
    "inference_service",
    "DroneStreamService",
    "drone_stream_service",
    "TargetTrackerService",
    "tracking_service",
    "ZoneMonitorService",
    "AerialDiffusionService",
    "generative_service",
]
