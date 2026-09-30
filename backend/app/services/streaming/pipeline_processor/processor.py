"""
Vision Pipeline Processor: High-level entrypoint and facade for the modular vision pipeline.
Composes dedicated subservice container, config manager, and frame orchestrator.
"""

from typing import List, Dict, Tuple, Optional
import numpy as np

from app.core.config import DetectionConfig
from app.services.streaming.pipeline_models import PipelineResult
from app.services.streaming.pipeline_processor.services_container import PipelineServicesContainer
from app.services.streaming.pipeline_processor.config_manager import PipelineConfigManager
from app.services.streaming.pipeline_processor.frame_orchestrator import PipelineFrameOrchestrator


class VisionPipelineProcessor:
    """
    Unified entrypoint facade coordinating modular computer vision sub-services.
    Delegates configuration lifecycle to PipelineConfigManager and frame execution to PipelineFrameOrchestrator.
    """

    def __init__(self, config: Optional[DetectionConfig] = None):
        self._services = PipelineServicesContainer(config)
        self._config_mgr = PipelineConfigManager(
            config=self._services.config,
            detector=self._services.detector,
            zone_monitor=self._services.zone_monitor,
            alert_manager=self._services.alert_manager,
            lock=self._services.lock
        )
        self._orchestrator = PipelineFrameOrchestrator(self._services)

    # -------------------------------------------------------------------------
    # Public Subsystem Properties (Strict DRY & Backward Compatibility)
    # -------------------------------------------------------------------------

    @property
    def config(self) -> DetectionConfig:
        return self._services.config

    @property
    def detector(self):
        return self._services.detector

    @property
    def zone_monitor(self):
        return self._services.zone_monitor

    @property
    def alert_manager(self):
        return self._services.alert_manager

    # -------------------------------------------------------------------------
    # Public Lifecycle Operations
    # -------------------------------------------------------------------------

    def set_view(self, view_mode: str) -> str:
        """Switches vision detection profiles between aerial drone and ground CCTV."""
        return self._config_mgr.set_view(view_mode)

    def update_config(
        self,
        multi_person_thresh: Optional[int] = None,
        conf_thresh: Optional[float] = None,
        prox_dist: Optional[int] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ) -> None:
        """Thread-safely updates live detection thresholds and restricted perimeter boundaries."""
        self._config_mgr.update_config(
            multi_person_thresh=multi_person_thresh,
            conf_thresh=conf_thresh,
            prox_dist=prox_dist,
            zone_polygon=zone_polygon
        )

    def process_frame(
        self,
        frame: np.ndarray,
        frame_idx: int,
        source_type: str = "synthetic",
        sim_targets: Optional[List[Dict]] = None
    ) -> PipelineResult:
        """Executes complete detection, zoning, alert, HUD annotation, and telemetry pipeline."""
        return self._orchestrator.process(
            frame=frame,
            frame_idx=frame_idx,
            source_type=source_type,
            sim_targets=sim_targets
        )


__all__ = ["VisionPipelineProcessor", "PipelineResult"]
