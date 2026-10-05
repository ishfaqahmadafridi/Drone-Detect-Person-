"""Wall-clock playback for uploaded files, excluding time spent frozen/idle.

Realtime mode advances to the current media frame if capture is behind.
Sequential mode advances by one frame. Detection scheduling is independent.
"""
import time
from app.core.config import DEFAULT_VIDEO_FPS, VIDEO_PLAYBACK_MODE


class VideoPlaybackClock:
    def __init__(self, fps, frame_count, mode=VIDEO_PLAYBACK_MODE):
        if mode not in {"sequential", "realtime"}:
            raise ValueError("VIDEO_PLAYBACK_MODE must be sequential or realtime")
        self.mode = mode
        self.fps = fps if fps > 0 else DEFAULT_VIDEO_FPS
        self.frame_count = max(1, int(frame_count))
        self.anchor = None
        self.pause_start = None
        self.last_index = -1

    def pause(self):
        if self.anchor is not None and self.pause_start is None:
            self.pause_start = time.monotonic()

    def next_index(self):
        now = time.monotonic()
        if self.anchor is None:
            self.anchor = now
        if self.pause_start is not None:
            self.anchor += now - self.pause_start
            self.pause_start = None
        due = self.anchor + (self.last_index + 1) / self.fps
        if now < due:
            time.sleep(due - now)
            now = time.monotonic()
        absolute_index = (self.last_index + 1 if self.mode == "sequential" else
                          max(self.last_index + 1, int((now - self.anchor) * self.fps)))
        self.last_index = absolute_index
        return absolute_index % self.frame_count
