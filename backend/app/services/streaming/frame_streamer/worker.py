"""
Frame Stream Worker: Background ingestion loop, vision pipeline execution,
and JPEG chunk broadcast synchronization.
"""

import time
import threading
from typing import Optional, Callable
from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.source_provider import StreamSourceProvider
from app.services.streaming.pipeline_processor import VisionPipelineProcessor
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster
from app.services.recording import video_recorder


class FrameStreamWorker:
    """
    Dedicated worker running continuous frame acquisition, vision inference,
    telemetry synchronization, and broadcast frame buffer updates.
    """
    def __init__(
        self,
        source_provider: StreamSourceProvider,
        pipeline_processor: VisionPipelineProcessor,
        telemetry_store: TelemetryStateStore,
        broadcaster: MjpegBroadcaster,
        config: CoordinatorConfig,
        on_chunk_produced: Optional[Callable[[bytes, int], None]] = None
    ):
        self.source_provider = source_provider
        self.pipeline_processor = pipeline_processor
        self.telemetry_store = telemetry_store
        self.broadcaster = broadcaster
        self.config = config
        self.on_chunk_produced = on_chunk_produced

        self.is_running: bool = False
        self._worker_thread: Optional[threading.Thread] = None

    def start(self) -> None:
        """Starts the producer thread if not already running."""
        if self._worker_thread is None or not self._worker_thread.is_alive():
            self.is_running = True
            self._worker_thread = threading.Thread(
                target=self._loop,
                daemon=True,
                name="StreamHubWorker"
            )
            self._worker_thread.start()

    def stop(self) -> None:
        """Signals the background producer thread to terminate."""
        self.is_running = False

    def _loop(self) -> None:
        frame_idx = 0
        while self.is_running:
            try:
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

                # 2. Update real-time telemetry state store & feed video recorder
                self.telemetry_store.update(**result.telemetry_payload)
                active_view = result.telemetry_payload.get("view_mode", "aerial")
                video_recorder.push_frame(result.annotated_frame, active_view)

                # 3. Encode annotated frame to JPEG and notify broadcaster
                jpeg_bytes = self.broadcaster.encode_frame(result.annotated_frame)
                if jpeg_bytes is not None and self.on_chunk_produced:
                    chunk = self.broadcaster.format_mjpeg_chunk(jpeg_bytes)
                    self.on_chunk_produced(chunk, frame_idx)

                if self.config.frame_rate_throttle_seconds > 0:
                    time.sleep(self.config.frame_rate_throttle_seconds)

            except Exception as e:
                # Log non-fatal error gracefully without crashing loop
                time.sleep(0.04)
