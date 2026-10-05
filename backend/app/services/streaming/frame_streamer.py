"""One inference producer shared by every MJPEG subscriber.

Freezing holds the current frame and tracker state for all viewers. Subscribers
never run their own inference loops or advance an uploaded video independently.
"""
import threading
import time
import logging
from app.core.config import STREAM_SUBSCRIBER_WAIT_SECONDS, STREAM_IDLE_WAIT_SECONDS
from app.services.streaming.selection_session import SelectionSession
from app.services.recording import video_recorder


class FrameStreamer:
    def __init__(self, source_provider, pipeline_processor, telemetry_store, broadcaster, config):
        self.source_provider = source_provider
        self.pipeline_processor = pipeline_processor
        self.telemetry_store = telemetry_store
        self.broadcaster = broadcaster
        self.config = config
        self.record_frames = True
        self.is_running = True
        self.selection = SelectionSession()
        self.source_lock = self.selection.lock
        self._condition = threading.Condition(self.selection.lock)
        self._producer = None
        self._chunk = None
        self._sequence = 0
        self._subscribers = 0
        self.on_invalidate = None
        self._source_identity = None

    def _produce(self):
        frame_idx = 0
        while self.is_running:
            processed = False
            cycle_start = time.monotonic()
            try:
                with self._condition:
                    if self._subscribers == 0 or self.selection.paused:
                        self.source_provider.pause_playback()
                        self._condition.wait(timeout=STREAM_IDLE_WAIT_SECONDS)
                        continue
                    if getattr(self.source_provider, "video_finished", False) is True:
                        self.telemetry_store.update(video_finished=True)
                        self._sequence += 1
                        self._condition.notify_all()
                        self._condition.wait(timeout=STREAM_IDLE_WAIT_SECONDS)
                        continue
                    ret, frame = self.source_provider.read_frame()
                    identity = getattr(self.source_provider, "source_identity", None)
                    if identity is not None and identity != self._source_identity:
                        if self._source_identity is not None:
                            self.invalidate()
                            self.pipeline_processor.detector.reset_tracking()
                            self.pipeline_processor.config.selected_target_ids = []
                            self.pipeline_processor.config.tracking_mode = "auto"
                        self._source_identity = identity
                    if ret and frame is not None:
                        processed = True
                        frame_idx += 1
                        source_type = getattr(self.source_provider, "frame_source_type", self.source_provider.source_type)
                        targets = self.source_provider.get_simulated_targets() if source_type == "synthetic" else []
                        result = self.pipeline_processor.process_frame(
                            frame=frame, frame_idx=frame_idx, source_type=source_type, sim_targets=targets
                        )
                        self.telemetry_store.update(**result.telemetry_payload)
                        self.telemetry_store.update(video_finished=getattr(self.source_provider, "video_finished", False) is True)
                        if self.record_frames:
                            video_recorder.push_frame(result.annotated_frame, result.telemetry_payload.get("view_mode", "aerial"))
                        jpeg = self.broadcaster.encode_frame(result.annotated_frame)
                        if jpeg is not None:
                            self.selection.publish(jpeg, result)
                            self._chunk = self.broadcaster.format_mjpeg_chunk(jpeg)
                            self._sequence += 1
                            self._condition.notify_all()
            except Exception:
                logging.exception("Video frame processing failed")
            delay = max(0, self.config.frame_rate_throttle_seconds - (time.monotonic() - cycle_start)) if processed else self.config.no_frame_retry_sleep_seconds
            if delay:
                time.sleep(delay)

    def invalidate(self):
        """Called under the frame lock when source or perspective changes."""
        self.selection.invalidate()
        self._chunk = None
        if self.on_invalidate is not None:
            self.on_invalidate()

    def generate_frames(self):
        with self._condition:
            self._subscribers += 1
            if self._producer is None or not self._producer.is_alive():
                self._producer = threading.Thread(target=self._produce, daemon=True, name="vision-producer")
                self._producer.start()
            self._condition.notify_all()
        seen = -1
        try:
            while self.is_running:
                with self._condition:
                    self._condition.wait_for(
                        lambda: (self._chunk is not None and self._sequence != seen) or not self.is_running,
                        timeout=STREAM_SUBSCRIBER_WAIT_SECONDS
                    )
                    chunk = self._chunk
                    seen = self._sequence
                if chunk is not None:
                    yield chunk
        finally:
            with self._condition:
                self._subscribers -= 1


__all__ = ["FrameStreamer"]
