"""
Stream Coordinator: Senior-level Orchestrator for Real-time Computer Vision Pipelines.
Coordinates ingestion, pipeline processing, telemetry distribution, and MJPEG broadcasting.
"""

from typing import List, Dict, Tuple, Optional, Generator
from fastapi import WebSocket

from app.core.config import DetectionConfig, SYNTHETIC_VIDEO_PATH
from app.services.streaming.source_provider import StreamSourceProvider
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.streaming.drone_service import drone_avionics_service
from app.services.streaming.pipeline_processor import VisionPipelineProcessor
from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.frame_streamer import FrameStreamer


class StreamManagerService:
    """
    High-level orchestrator coordinating video ingestion, multi-perspective object tracking,
    zone intrusion monitoring, incident logging, and MJPEG frame broadcasting.
    """
    def __init__(
        self,
        config: Optional[DetectionConfig] = None,
        coordinator_config: Optional[CoordinatorConfig] = None
    ):
        self.coordinator_config = coordinator_config or CoordinatorConfig()
        self.pipeline_processor = VisionPipelineProcessor(config)
        self.source_provider = StreamSourceProvider(
            default_source_type="synthetic",
            default_path=SYNTHETIC_VIDEO_PATH
        )
        self.telemetry_store = TelemetryStateStore()
        self.broadcaster = MjpegBroadcaster(jpeg_quality=self.coordinator_config.jpeg_quality)

        # Dedicated Frame Streamer Loop
        self.frame_streamer = FrameStreamer(
            source_provider=self.source_provider,
            pipeline_processor=self.pipeline_processor,
            telemetry_store=self.telemetry_store,
            broadcaster=self.broadcaster,
            config=self.coordinator_config
        )

    @property
    def is_running(self) -> bool:
        return self.frame_streamer.is_running

    @is_running.setter
    def is_running(self, val: bool):
        self.frame_streamer.is_running = val

    @property
    def config(self) -> DetectionConfig:
        return self.pipeline_processor.config

    @property
    def detector(self):
        return self.pipeline_processor.detector

    @property
    def zone_monitor(self):
        return self.pipeline_processor.zone_monitor

    @property
    def alert_manager(self):
        return self.pipeline_processor.alert_manager

    @property
    def source_type(self) -> str:
        return self.source_provider.source_type

    @property
    def source_path(self) -> str:
        return self.source_provider.source_path

    @property
    def latest_telemetry(self) -> Dict:
        return self.telemetry_store.latest

    @property
    def active_websockets(self) -> List[WebSocket]:
        return self.telemetry_store.active_websockets

    def set_view_mode(self, view_mode: str) -> str:
        """
        Switches AI inference model perspective between aerial drone and ground-level CCTV.
        """
        active_view = self.pipeline_processor.set_view(view_mode)
        self.source_provider.set_view_mode(active_view)
        self.telemetry_store.update(view_mode=active_view)
        print(f"[COORDINATOR] Switched perspective view to: {active_view}")
        return active_view

    def set_source(self, source_type: str, source_path: Optional[str] = None):
        """
        Updates underlying video source stream.
        """
        self.source_provider.set_source(source_type, source_path)
        self.telemetry_store.update(source_type=source_type)

    def update_config(
        self,
        multi_person_thresh: Optional[int] = None,
        conf_thresh: Optional[float] = None,
        prox_dist: Optional[int] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ):
        """
        Applies dynamic surveillance tuning parameters across detection, zoning, and alerts.
        """
        self.pipeline_processor.update_config(
            multi_person_thresh=multi_person_thresh,
            conf_thresh=conf_thresh,
            prox_dist=prox_dist,
            zone_polygon=zone_polygon
        )
        self.telemetry_store.update(
            multi_person_threshold=self.config.multi_person_threshold,
            confidence_threshold=self.config.confidence_threshold,
            proximity_distance_px=self.config.proximity_alert_distance_px,
            zone_polygon=self.config.default_zone_normalized
        )

    def execute_drone_command(self, action: str, target_alt: Optional[float] = None) -> Dict:
        """
        Transmits tactical flight directive to drone avionics subsystem.
        """
        res = drone_avionics_service.execute_command(action, target_alt)
        snapshot = drone_avionics_service.get_avionics_snapshot()
        self.telemetry_store.update(avionics=snapshot)
        return res

    def generate_frames(self) -> Generator[bytes, None, None]:
        """
        Delegates real-time frame generation to the dedicated FrameStreamer.
        """
        return self.frame_streamer.generate_frames()
