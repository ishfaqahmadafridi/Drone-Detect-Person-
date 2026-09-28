"""
Frame Streamer: Dedicated real-time streaming generator loop.
Pulls from source provider, runs vision pipeline, updates telemetry store, and yields multipart MJPEG chunks.
"""

import time
from typing import Generator
from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.source_provider import StreamSourceProvider
from app.services.streaming.pipeline_processor import VisionPipelineProcessor
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster


class FrameStreamer:
    """
    Manages the continuous frame acquisition, processing, and MJPEG chunk delivery loop.
    """
    def __init__(
        self,
        source_provider: StreamSourceProvider,
        pipeline_processor: VisionPipelineProcessor,
        telemetry_store: TelemetryStateStore,
        broadcaster: MjpegBroadcaster,
        config: CoordinatorConfig
    ):
        self.source_provider = source_provider
        self.pipeline_processor = pipeline_processor
        self.telemetry_store = telemetry_store
        self.broadcaster = broadcaster
        self.config = config
        self.is_running: bool = True

    def generate_frames(self) -> Generator[bytes, None, None]:
        """
        Generator yielding real-time MJPEG multipart frame bytes to connected HTTP client streams.
        Executes without holding global locks over neural network inference.
        """
        frame_idx = 0

        while self.is_running:
            ret, frame = self.source_provider.read_frame()
            if not ret or frame is None:
                time.sleep(self.config.no_frame_retry_sleep_seconds)
                continue

            frame_idx += 1

            # 1. Process frame through vision pipeline
            sim_targets = (
                self.source_provider.get_simulated_targets()
                if self.source_provider.source_type == "synthetic"
                else []
            )
            result = self.pipeline_processor.process_frame(
                frame=frame,
                frame_idx=frame_idx,
                source_type=self.source_provider.source_type,
                sim_targets=sim_targets
            )

            # 2. Update real-time telemetry state store
            self.telemetry_store.update(**result.telemetry_payload)

            # 3. Encode annotated frame to JPEG and stream chunk
            jpeg_bytes = self.broadcaster.encode_frame(result.annotated_frame)
            if jpeg_bytes is None:
                continue

            yield self.broadcaster.format_mjpeg_chunk(jpeg_bytes)

            if self.config.frame_rate_throttle_seconds > 0:
                time.sleep(self.config.frame_rate_throttle_seconds)
