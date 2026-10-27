"""Coordinate validation, scene analysis, and output in a single frame pass."""
from typing import Dict, List, Optional
import numpy as np
from app.core.config import PREVIEW_MAX_EDGE

from app.services.streaming.pipeline_models import PipelineResult
from app.services.streaming.pipeline_processor.services_container import PipelineServicesContainer
from app.services.streaming.pipeline_processor.stages.frame_normalizer import FrameNormalizer
from app.services.streaming.pipeline_processor.stages.frame_analysis import FrameAnalysisStage
from app.services.streaming.pipeline_processor.stages.frame_output import FrameOutputStage


class PipelineFrameOrchestrator:
    """Preserve stage ordering and provide fallback for transient pipeline errors."""

    def __init__(self, services: PipelineServicesContainer):
        self.services = services
        self.analysis_stage = FrameAnalysisStage(services)
        self.output_stage = FrameOutputStage(services)

    def process(
        self,
        frame: np.ndarray,
        frame_idx: int,
        source_type: str = "synthetic",
        sim_targets: Optional[List[Dict]] = None,
    ) -> PipelineResult:
        active_view = getattr(self.services.detector, "active_view", "aerial")
        valid, normalized, height, width = FrameNormalizer.validate_and_normalize(
            frame, max_edge=getattr(self.services, "normalize_max_edge", PREVIEW_MAX_EDGE)
        )
        if not valid or normalized is None:
            return PipelineResult.empty_fallback(frame, source_type=source_type, view_mode=active_view)

        try:
            with self.services.lock:
                cfg = self.services.config
                confidence = cfg.confidence_threshold
                zone = cfg.default_zone_normalized
                active_view = getattr(self.services.detector, "active_view", "aerial")
                self.services.zone_monitor.update_resolution(width, height)

            analysis = self.analysis_stage.analyze(
                frame=normalized, frame_idx=frame_idx, source_type=source_type,
                sim_targets=sim_targets, active_view=active_view,
            )
            return self.output_stage.build(
                frame=normalized, analysis=analysis, frame_idx=frame_idx,
                source_type=source_type, active_view=active_view,
                confidence_threshold=confidence, zone_polygon=zone,
            )
        except Exception as exc:
            print(f"[ERROR] Pipeline orchestration error on frame #{frame_idx}: {exc}")
            return PipelineResult.empty_fallback(normalized, source_type=source_type, view_mode=active_view)
