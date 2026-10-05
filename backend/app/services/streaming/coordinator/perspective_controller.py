"""
Perspective Controller: Manages camera stream ingestion source, view mode switching, and config tuning.
"""

from typing import Optional, List, Tuple

from app.core.config import DetectionConfig
from app.services.streaming.source_provider import StreamSourceProvider
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.streaming.pipeline_processor import VisionPipelineProcessor


class PerspectiveController:
    """
    Coordinates viewpoint perspective transitions, stream source updates, and runtime config tuning.
    """

    def __init__(
        self,
        pipeline_processor: VisionPipelineProcessor,
        source_provider: StreamSourceProvider,
        telemetry_store: TelemetryStateStore,
        config: DetectionConfig,
    ):
        self.pipeline_processor = pipeline_processor
        self.source_provider = source_provider
        self.telemetry_store = telemetry_store
        self.config = config

    def set_view_mode(self, view_mode: str) -> str:
        """
        Switches AI inference model perspective between aerial drone and ground-level CCTV.
        """
        active_view = self.pipeline_processor.set_view(view_mode)
        self.source_provider.set_view_mode(active_view)
        detector = getattr(self.pipeline_processor, "detector", None)
        model_name = getattr(getattr(detector, "config", None), "model_name", "")
        engine = getattr(detector, "engine", "")
        self.telemetry_store.update(view_mode=active_view, model_name=model_name, engine=engine)
        print(f"[COORDINATOR] Switched perspective view to: {active_view} ({model_name} | {engine})")
        return active_view

    def set_source(self, source_type: str, source_path: Optional[str] = None, transport: str = "tcp"):
        """
        Updates underlying video source stream.
        """
        self.source_provider.set_source(source_type, source_path, transport=transport)
        self.telemetry_store.update(source_type=source_type)

    def update_config(
        self,
        conf_thresh: Optional[float] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ):
        """
        Applies dynamic surveillance tuning parameters across detection, zoning, and alerts.
        """
        self.pipeline_processor.update_config(
            conf_thresh=conf_thresh,
            zone_polygon=zone_polygon
        )
        self.telemetry_store.update(
            confidence_threshold=self.config.confidence_threshold,
            zone_polygon=self.config.default_zone_normalized
        )
