"""
Pipeline Services Container: Coordinates lifecycle and dependency injection for vision sub-services.
"""

import threading
from typing import Optional

from app.core.config import DetectionConfig
from app.core.constants import DEFAULT_FRAME_WIDTH, DEFAULT_FRAME_HEIGHT
from app.services.detector_service import DronePersonDetectorService
from app.services.zone_service import ZoneMonitorService
from app.services.alert_service import AlertManagerService

from app.services.streaming.pipeline_processor.stages.target_tracker import PipelineTargetTracker
from app.services.streaming.pipeline_processor.stages.hazard_evaluator import PipelineHazardEvaluator
from app.services.streaming.pipeline_processor.stages.threat_classifier import PipelineThreatClassifier
from app.services.streaming.pipeline_processor.stages.hud_annotator import PipelineHudAnnotator
from app.services.streaming.pipeline_processor.stages.avionics_syncer import PipelineAvionicsSyncer


class PipelineServicesContainer:
    """
    Instantiates and encapsulates all sub-services and atomic pipeline stage handlers.
    """

    def __init__(self, config: Optional[DetectionConfig] = None):
        self.config = config or DetectionConfig()
        self.lock = threading.Lock()

        # Core microservices
        self.detector = DronePersonDetectorService(self.config)
        self.zone_monitor = ZoneMonitorService(
            DEFAULT_FRAME_WIDTH,
            DEFAULT_FRAME_HEIGHT,
            self.config.default_zone_normalized
        )
        self.alert_manager = AlertManagerService(
            output_dir=self.config.output_dir,
            snapshots_dir=self.config.snapshots_dir,
            logs_dir=self.config.logs_dir,
            multi_person_threshold=self.config.multi_person_threshold,
            snapshot_cooldown=self.config.snapshot_cooldown_seconds,
            enable_audio=self.config.enable_audio_alert
        )

        # Atomic Stage Handlers
        self.tracker = PipelineTargetTracker()
        self.hazard_evaluator = PipelineHazardEvaluator()
        self.threat_classifier = PipelineThreatClassifier()
        self.hud_annotator = PipelineHudAnnotator()
        self.avionics_syncer = PipelineAvionicsSyncer()
