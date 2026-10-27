"""CLI adapter over the same frame pipeline used by streaming."""
from typing import Dict, Tuple, Optional
import numpy as np
from app.core.config import DetectionConfig
from app.services.streaming.pipeline_processor import VisionPipelineProcessor


class DetectionPipeline:
    def __init__(self, config: Optional[DetectionConfig] = None):
        # CLI recorder dimensions follow the input; streaming previews remain capped.
        self.processor = VisionPipelineProcessor(config, normalize_max_edge=None)
        self.config = self.processor.config
        self.detector = self.processor.detector
        self.zone_monitor = self.processor.zone_monitor
        self.alert_manager = self.processor.alert_manager
        self.annotator = self.detector.annotator

    def process_frame(self, frame: np.ndarray, frame_idx: int = 0) -> Tuple[np.ndarray, Dict, Optional[str]]:
        result = self.processor.process_frame(frame, frame_idx=frame_idx, source_type="cli")
        telemetry = {**result.telemetry_payload, "detections": result.detected_persons, "details": result.details}
        return result.annotated_frame, telemetry, result.snapshot_filepath
