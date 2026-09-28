"""
Services Subpackage: Modular computer vision, telemetry, alert, tracking, and inference services.
"""

from app.services.alert_service import AlertManagerService
from app.services.annotation_service import TacticalFrameAnnotator, TacticalAnnotationTheme
from app.services.detector_service import DronePersonDetectorService, FPSProfiler
from app.services.inference_service import MultiViewInferenceService, inference_service
from app.services.stream_service import DroneStreamService, drone_stream_service
from app.services.tracking_service import TargetTrackerService, tracking_service
from app.services.zone_service import ZoneMonitorService

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
]
