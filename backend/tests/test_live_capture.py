"""Live video never queues decoded frames behind a slow consumer."""
import threading
from unittest.mock import Mock

from app.services.streaming.sources.device.live_capture import LatestLiveCapture


def test_slow_consumer_gets_newest_frame_and_capture_is_released_once():
    drained = threading.Event()
    finish = threading.Event()
    frames = iter([object(), object(), object()])
    newest = None

    def read():
        nonlocal newest
        try:
            newest = next(frames)
            return True, newest
        except StopIteration:
            drained.set()
            finish.wait(2)
            return False, None

    capture = Mock(read=Mock(side_effect=read))
    live = LatestLiveCapture(capture)
    try:
        assert drained.wait(2), "Reader did not drain incoming frames"
        ok, frame = live.read_frame()
        assert ok and frame is newest
        assert live.last_frame_at is not None
        assert live.read_frame() == (False, None)
    finally:
        finish.set()
        live.release()
    live.release()
    capture.release.assert_called_once()
    assert live.read_frame() == (False, None)
