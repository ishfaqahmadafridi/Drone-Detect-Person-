"""
Stream Manager Service: High-level Orchestrator coordinating video ingestion,
vision pipeline processing, target tracking modes, telemetry distribution, and MJPEG broadcasting.
"""

from typing import List, Dict, Tuple, Optional, Generator
from fastapi import WebSocket

from app.core.config import DetectionConfig, SYNTHETIC_VIDEO_PATH
from app.services.streaming.source_provider import StreamSourceProvider
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.streaming.pipeline_processor import VisionPipelineProcessor
from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.frame_streamer import FrameStreamer
from app.services.streaming.coordinator.tracking_manager import TargetTrackingManager
from app.services.streaming.coordinator.perspective_controller import PerspectiveController
from app.services.streaming.coordinator.flight_controller import DroneFlightController


class StreamManagerService:
    """
    High-level orchestrator coordinating video ingestion, multi-perspective object tracking,
    zone intrusion monitoring, incident logging, manual target designation, and MJPEG frame broadcasting.
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

        # Dedicated Frame Streamer Pipeline
        self.frame_streamer = FrameStreamer(
            source_provider=self.source_provider,
            pipeline_processor=self.pipeline_processor,
            telemetry_store=self.telemetry_store,
            broadcaster=self.broadcaster,
            config=self.coordinator_config
        )

        # Dedicated Target Tracking Manager (Auto vs Manual Target Designation)
        self.tracking_manager = TargetTrackingManager(
            config=self.config,
            telemetry_store=self.telemetry_store
        )

        # Dedicated Perspective & Ingestion Controller
        self.perspective_controller = PerspectiveController(
            pipeline_processor=self.pipeline_processor,
            source_provider=self.source_provider,
            telemetry_store=self.telemetry_store,
            config=self.config
        )

        # Dedicated Drone Flight Directives Controller
        self.flight_controller = DroneFlightController(
            telemetry_store=self.telemetry_store
        )

    # -------------------------------------------------------------------------
    # Core Subsystem Properties
    # -------------------------------------------------------------------------

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

    # -------------------------------------------------------------------------
    # Ingestion & Perspective Operations
    # -------------------------------------------------------------------------

    def set_view_mode(self, view_mode: str) -> str:
        return self.perspective_controller.set_view_mode(view_mode)

    def set_source(self, source_type: str, source_path: Optional[str] = None, transport: str = "tcp"):
        self.perspective_controller.set_source(source_type, source_path, transport=transport)

    def update_config(
        self,
        multi_person_thresh: Optional[int] = None,
        conf_thresh: Optional[float] = None,
        prox_dist: Optional[int] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ):
        self.perspective_controller.update_config(
            multi_person_thresh=multi_person_thresh,
            conf_thresh=conf_thresh,
            prox_dist=prox_dist,
            zone_polygon=zone_polygon
        )

    # -------------------------------------------------------------------------
    # Target Tracking & Operator Designation Operations
    # -------------------------------------------------------------------------

    def set_tracking_mode(self, mode: str, selected_ids: Optional[List[int]] = None) -> Dict:
        return self.tracking_manager.set_tracking_mode(mode=mode, selected_ids=selected_ids)

    def select_target(
        self,
        x: Optional[float] = None,
        y: Optional[float] = None,
        target_id: Optional[int] = None
    ) -> Dict:
        return self.tracking_manager.select_target(x=x, y=y, target_id=target_id)

    def clear_manual_targets(self) -> Dict:
        return self.tracking_manager.clear_manual_targets()

    # -------------------------------------------------------------------------
    # Flight Directives & Frame Stream Generator
    # -------------------------------------------------------------------------

    def execute_drone_command(self, action: str, target_alt: Optional[float] = None) -> Dict:
        return self.flight_controller.execute_command(action, target_alt)

    def generate_frames(self) -> Generator[bytes, None, None]:
        return self.frame_streamer.generate_frames()
