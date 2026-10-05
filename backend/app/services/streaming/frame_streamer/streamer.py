"""
Frame Streamer Service: Multi-client MJPEG broadcaster and worker manager.
"""

import threading
from typing import Generator, Optional
from app.services.streaming.coordinator_config import CoordinatorConfig
from app.services.streaming.source_provider import StreamSourceProvider
from app.services.streaming.pipeline_processor import VisionPipelineProcessor
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.streaming.mjpeg_broadcaster import MjpegBroadcaster
from app.services.streaming.frame_streamer.worker import FrameStreamWorker


class FrameStreamer:
    """
    Manages continuous background frame acquisition, processing, and zero-overhead
    multi-client MJPEG broadcasting.
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

        self._latest_chunk: Optional[bytes] = None
        self._frame_seq: int = 0
        self._condition = threading.Condition()

        self._worker = FrameStreamWorker(
            source_provider=self.source_provider,
            pipeline_processor=self.pipeline_processor,
            telemetry_store=self.telemetry_store,
            broadcaster=self.broadcaster,
            config=self.config,
            on_chunk_produced=self._on_chunk_produced
        )
        self._worker.start()

    @property
    def is_running(self) -> bool:
        return self._worker.is_running

    @is_running.setter
    def is_running(self, val: bool) -> None:
        if val:
            self._worker.start()
        else:
            self._worker.stop()

    def _on_chunk_produced(self, chunk: bytes, frame_idx: int) -> None:
        """Callback invoked by worker when a new MJPEG chunk is ready."""
        with self._condition:
            self._latest_chunk = chunk
            self._frame_seq = frame_idx
            self._condition.notify_all()

    def generate_frames(self) -> Generator[bytes, None, None]:
        """
        Generator yielding real-time MJPEG multipart frame bytes to connected HTTP client streams.
        Zero redundant inference overhead across multiple browser tabs.
        """
        self._worker.start()
        last_seen_seq = -1

        while self._worker.is_running:
            chunk_to_send: Optional[bytes] = None
            with self._condition:
                if self._frame_seq == last_seen_seq or self._latest_chunk is None:
                    self._condition.wait(timeout=0.1)

                if self._frame_seq != last_seen_seq and self._latest_chunk is not None:
                    last_seen_seq = self._frame_seq
                    chunk_to_send = self._latest_chunk

            if chunk_to_send is not None:
                yield chunk_to_send

    def stop(self) -> None:
        """Gracefully stop worker background loop."""
        self._worker.stop()
