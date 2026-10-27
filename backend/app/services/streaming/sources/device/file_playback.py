"""File frame scheduling, end-of-video handling, and loop identity."""
from app.services.streaming.sources.device.capture import cv2
from app.services.streaming.sources.playback_clock import VideoPlaybackClock


class FilePlayback:
    def __init__(self, end_behavior):
        if end_behavior not in {"hold", "loop"}:
            raise ValueError("Video end behavior must be hold or loop")
        self.end_behavior = end_behavior
        self.clock = None
        self.epoch = 0
        self.finished = False
        self._clock_cycle = 0
        self._last_frame = None

    def attach(self, capture):
        if capture is not None:
            self.clock = VideoPlaybackClock(capture.get(cv2.CAP_PROP_FPS),
                                            capture.get(cv2.CAP_PROP_FRAME_COUNT))

    def pause(self):
        if self.clock is not None:
            self.clock.pause()

    def _seek_due_frame(self, capture):
        if self.clock is None:
            return
        target = self.clock.next_index()
        if self.end_behavior == "hold":
            target = min(self.clock.last_index, self.clock.frame_count - 1)
        cycle = self.clock.last_index // self.clock.frame_count
        if self.end_behavior == "loop" and cycle != self._clock_cycle:
            self.epoch += 1
            self._clock_cycle = cycle
        current = int(capture.get(cv2.CAP_PROP_POS_FRAMES))
        if target < current:
            capture.set(cv2.CAP_PROP_POS_FRAMES, target)
        else:
            for _ in range(target - current):
                if not capture.grab():
                    break

    def read_frame(self, capture):
        if self.finished:
            return self._last_frame is not None, self._last_frame
        self._seek_due_frame(capture)
        ok, frame = capture.read()
        if not ok or frame is None:
            if self.end_behavior == "hold" and self._last_frame is not None:
                self.finished = True
                return True, self._last_frame
            self.epoch += 1
            capture.set(cv2.CAP_PROP_POS_FRAMES, 0)
            ok, frame = capture.read()
            if not ok or frame is None:
                return self._last_frame is not None, self._last_frame
        self._last_frame = frame
        if self.end_behavior == "hold" and self.clock is not None:
            self.finished = self.clock.last_index >= self.clock.frame_count - 1
        return True, frame
