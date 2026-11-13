"""Camera orchestration uses mocked capture and control; no aircraft traffic."""
import time
from types import SimpleNamespace
from unittest.mock import Mock, patch

from app.core.config import TELLO_VIDEO_URL, TELLO_VIDEO_TIMEOUT_MS
from app.services.drone_control.video import start_video, video_status
from app.services.streaming.sources.device import capture


def test_camera_request_switches_existing_pipeline_and_waits_for_real_frames():
    controller = Mock()
    stream = SimpleNamespace(source_type="tello", source_provider=SimpleNamespace(last_frame_at=None), set_source=Mock())
    result = start_video(controller, "session", stream)
    controller.start_video.assert_called_once_with("session")
    stream.set_source.assert_called_once_with("tello", TELLO_VIDEO_URL, transport="udp")
    assert result.requested and not result.receiving
    stream.source_provider.last_frame_at = time.monotonic()
    assert video_status(stream).receiving
    stream.source_provider.last_frame_at = 0
    assert not video_status(stream).receiving
    stream.source_type = "synthetic"
    assert not video_status(stream).requested


def test_udp_capture_has_bounded_open_and_read_and_is_not_a_file():
    assert not capture.is_video_file(TELLO_VIDEO_URL)
    handle = Mock()
    with patch.object(capture.cv2, "VideoCapture", return_value=handle) as opened:
        assert capture.open_capture(TELLO_VIDEO_URL, "udp") is handle
    opened.assert_called_once_with(TELLO_VIDEO_URL, capture.cv2.CAP_FFMPEG, [
        capture.cv2.CAP_PROP_OPEN_TIMEOUT_MSEC, TELLO_VIDEO_TIMEOUT_MS,
        capture.cv2.CAP_PROP_READ_TIMEOUT_MSEC, TELLO_VIDEO_TIMEOUT_MS,
    ])
