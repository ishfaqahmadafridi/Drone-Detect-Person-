"""Independent preview capture and sampled detection with a one-frame mailbox.

Detection retains the selection lock, so frozen snapshots and ReID crops stay
consistent. Capture never waits for that lock during ordinary playback.
"""
import logging
import threading
import time

from app.core.config import STREAM_PREVIEW_FPS, STREAM_IDLE_WAIT_SECONDS
from app.services.streaming.frame_streamer import FrameStreamer
from app.services.streaming.pipeline_processor.stages.frame_normalizer import FrameNormalizer
from app.services.annotation.preview_overlay import draw_preview_boxes
from app.services.recording import video_recorder


class PreviewStreamer(FrameStreamer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.source_lock = threading.RLock()
        self._condition = threading.Condition()
        self._pending = None
        self._overlay = None
        self._generation = 0
        self._capture_index = 0
        self._inference = None
        self._work = threading.Event()
        self.selection.frame_is_current = self._selection_frame_is_current

    def _selection_frame_is_current(self):
        with self.source_lock:
            identity = getattr(self.source_provider, "source_identity", None)
            return self._overlay is not None and self._overlay[0] == identity

    def invalidate(self):
        # Callers own selection.lock then source_lock, in that order.
        with self.source_lock, self._condition:
            self._generation += 1
            self._pending = self._overlay = None
            super().invalidate()

    def _produce(self):
        self._inference = threading.Thread(target=self._detect, daemon=True, name="sampled-detection")
        self._inference.start()
        try:
            while self.is_running:
                started = time.monotonic()
                try:
                    with self.source_lock:
                        # Reading the token does not acquire the inference lock.
                        # The detection loop handles selection expiry under that lock.
                        if not self._subscribers or self.selection.token is not None:
                            self.source_provider.pause_playback()
                            if self.selection.token is not None and self.selection.latest:
                                self._publish_preview(self.selection.latest["jpeg"])
                        elif getattr(self.source_provider, "video_finished", False) is True:
                            self.telemetry_store.update(video_finished=True)
                            if self.selection.latest:
                                self._publish_preview(self.selection.latest["jpeg"])
                            else:
                                with self._condition:
                                    self._sequence += 1
                                    self._condition.notify_all()
                        else:
                            ok, frame = self.source_provider.read_frame()
                            if ok and frame is not None:
                                valid, frame, _, _ = FrameNormalizer.validate_and_normalize(frame)
                                if valid:
                                    identity = getattr(self.source_provider, "source_identity", None)
                                    source_type = getattr(self.source_provider, "frame_source_type", self.source_provider.source_type)
                                    targets = self.source_provider.get_simulated_targets() if source_type == "synthetic" else []
                                    self._capture_index += 1
                                    self.telemetry_store.update(video_finished=False)
                                    captured = time.monotonic()
                                    self._pending = (self._generation, identity, self._capture_index,
                                                     frame.copy(), source_type, targets, captured)
                                    self._work.set()
                                    overlay = self._overlay
                                    preview = draw_preview_boxes(frame, overlay, identity, captured,
                                                                 self.pipeline_processor.config)
                                    jpeg = self.broadcaster.encode_frame(preview)
                                    if jpeg is not None:
                                        self._publish_preview(jpeg)
                except Exception:
                    logging.exception("Preview capture failed")
                time.sleep(max(0.001, 1 / STREAM_PREVIEW_FPS - (time.monotonic() - started)))
        finally:
            self._work.set()
            self._inference.join(timeout=3)

    def _publish_preview(self, jpeg):
        with self._condition:
            self._chunk = self.broadcaster.format_mjpeg_chunk(jpeg)
            self._sequence += 1
            self._condition.notify_all()

    def _detect(self):
        while self.is_running:
            self._work.wait(timeout=STREAM_IDLE_WAIT_SECONDS)
            self._work.clear()
            try:
                with self.selection.lock:
                    if not self.is_running or self.selection.paused or not self._subscribers:
                        continue
                    with self.source_lock:
                        job, self._pending = self._pending, None
                        if job is None:
                            continue
                        generation, identity, index, frame, source_type, targets, captured = job
                        if identity != self._source_identity:
                            if self._source_identity is not None:
                                self.invalidate()
                                self.pipeline_processor.detector.reset_tracking()
                                self.pipeline_processor.config.selected_target_ids = []
                                self.pipeline_processor.config.tracking_mode = "auto"
                            self._source_identity = identity
                            generation = self._generation
                    result = self.pipeline_processor.process_frame(
                        frame=frame, frame_idx=index, source_type=source_type, sim_targets=targets)
                    jpeg = self.broadcaster.encode_frame(result.annotated_frame)
                    with self.source_lock:
                        # Capture can cross a file loop while detection is running.
                        current_identity = getattr(self.source_provider, "source_identity", None)
                        if generation != self._generation or current_identity != identity:
                            self.selection.latest = None
                            continue
                        self.telemetry_store.update(**result.telemetry_payload)
                        self.telemetry_store.update(video_finished=getattr(self.source_provider, "video_finished", False) is True)
                        if self.record_frames:
                            video_recorder.push_frame(result.annotated_frame, result.telemetry_payload.get("view_mode", "aerial"))
                        if jpeg is not None:
                            self.selection.publish(jpeg, result)
                            self._overlay = (identity, captured, result.telemetry_payload)
            except Exception:
                logging.exception("Sampled detection failed; preview continues")
