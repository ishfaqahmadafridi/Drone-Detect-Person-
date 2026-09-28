"""
FPS Profiler for real-time video stream throughput measurement.
"""

import time


class FPSProfiler:
    """
    Sliding-window framerate profiler.
    """
    def __init__(self, window_seconds: float = 0.5):
        self.window_seconds = window_seconds
        self.last_time = time.time()
        self.frame_count = 0
        self.current_fps = 0.0

    def tick(self) -> float:
        self.frame_count += 1
        now = time.time()
        dt = now - self.last_time
        if dt >= self.window_seconds:
            self.current_fps = self.frame_count / dt
            self.frame_count = 0
            self.last_time = now
        return self.current_fps
