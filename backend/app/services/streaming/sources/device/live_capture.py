"""Drain live UDP video independently of inference, keeping one decoded frame."""
import threading
import time

from app.core.config import DEVICE_READ_RETRY_SECONDS, TELLO_VIDEO_TIMEOUT_MS
from app.services.streaming.sources.device.capture import release_capture


class LatestLiveCapture:
    def __init__(self, capture):
        self.capture = capture
        self.last_frame_at = None
        self._frame = None
        self._condition = threading.Condition()
        self._stop = threading.Event()
        self._thread = threading.Thread(target=self._read, name="live-video-capture", daemon=True)
        self._thread.start()

    def _read(self):
        try:
            while not self._stop.is_set():
                ok, frame = self.capture.read()
                if not ok or frame is None:
                    with self._condition:
                        self._frame = None
                    self._stop.wait(DEVICE_READ_RETRY_SECONDS)
                    continue
                with self._condition:
                    if self._stop.is_set():
                        break
                    self._frame = frame
                    self.last_frame_at = time.monotonic()
                    self._condition.notify_all()
        except Exception:
            pass  # Source provider supplies the existing simulation fallback.
        finally:
            release_capture(self.capture)
            with self._condition:
                self._stop.set()
                self._frame = None
                self._condition.notify_all()

    def read_frame(self):
        with self._condition:
            self._condition.wait_for(
                lambda: self._frame is not None or self._stop.is_set(),
                timeout=DEVICE_READ_RETRY_SECONDS,
            )
            frame, self._frame = self._frame, None
            return frame is not None, frame

    def release(self):
        self._stop.set()
        with self._condition:
            self._frame = None
            self._condition.notify_all()
        # Only the reader releases OpenCV: never release concurrently with read().
        self._thread.join(timeout=TELLO_VIDEO_TIMEOUT_MS / 1000 + DEVICE_READ_RETRY_SECONDS)
