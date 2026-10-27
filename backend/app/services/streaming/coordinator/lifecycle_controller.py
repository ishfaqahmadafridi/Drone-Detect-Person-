"""Serialize source and perspective changes with capture and inference."""
from fastapi import HTTPException


class StreamLifecycleController:
    def __init__(self, streamer, perspective, tracking):
        self.streamer = streamer
        self.perspective = perspective
        self.tracking = tracking

    def set_view_mode(self, view_mode, fixed_view=None):
        if fixed_view is not None and fixed_view != view_mode:
            raise HTTPException(409, "This channel has a fixed perspective.")
        with self.streamer.selection.lock, self.streamer.source_lock:
            if self.perspective.config.view_mode == view_mode:
                # Newly constructed ground sessions still need source/telemetry sync.
                self.perspective.source_provider.set_view_mode(view_mode)
                self.perspective.telemetry_store.update(view_mode=view_mode)
                return view_mode
            self.streamer.invalidate()
            self.tracking.set_tracking_mode("auto")
            return self.perspective.set_view_mode(view_mode)

    def set_source(self, source_type, source_path=None, transport="tcp"):
        with self.streamer.selection.lock, self.streamer.source_lock:
            self.streamer.invalidate()
            self.perspective.pipeline_processor.detector.reset_tracking()
            self.tracking.set_tracking_mode("auto")
            self.perspective.telemetry_store.update(detections=[], video_finished=False)
            self.perspective.set_source(source_type, source_path, transport=transport)
