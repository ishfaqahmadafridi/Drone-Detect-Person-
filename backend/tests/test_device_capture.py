"""Capture failure cleanup and scoped network configuration regressions."""
import os
from unittest.mock import MagicMock, patch

import pytest

from app.services.streaming.sources.device import capture
from app.services.streaming.sources.device_source import DeviceFrameSource


@pytest.mark.parametrize("options", [None, "custom;existing"])
def test_rtsp_open_restores_environment(options, monkeypatch):
    key = "OPENCV_FFMPEG_CAPTURE_OPTIONS"
    if options is None:
        monkeypatch.delenv(key, raising=False)
    else:
        monkeypatch.setenv(key, options)
    handle = MagicMock()

    def open_stream(*args):
        assert args == ("rtsps://camera/live", capture.cv2.CAP_FFMPEG)
        assert "rtsp_transport;udp" in os.environ[key]
        return handle

    with patch.object(capture.cv2, "VideoCapture", side_effect=open_stream):
        assert capture.open_capture("rtsps://camera/live", "udp") is handle
    assert os.environ.get(key) == options


@pytest.mark.parametrize("failure", ["closed", "configure"])
def test_failed_open_releases_handle_and_restores_options(failure, monkeypatch):
    monkeypatch.setenv("OPENCV_FFMPEG_CAPTURE_OPTIONS", "original")
    handle = MagicMock()
    handle.isOpened.return_value = failure != "closed"
    if failure == "configure":
        handle.set.side_effect = RuntimeError("capture disconnected")
    with patch.object(capture.cv2, "VideoCapture", return_value=handle):
        assert capture.open_capture("rtsp://camera/live", "tcp") is None
    handle.release.assert_called_once()
    assert os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] == "original"


def test_disconnected_capture_returns_failure_and_release_is_idempotent():
    handle = MagicMock()
    handle.read.side_effect = RuntimeError("device unplugged")
    with patch("app.services.streaming.sources.device_source.open_capture", return_value=handle):
        source = DeviceFrameSource(2)
    with patch("app.services.streaming.sources.device_source.time.sleep"):
        assert source.read_frame() == (False, None)
    source.release()
    source.release()
    handle.release.assert_called_once()
    assert not source.is_active


def test_missing_opencv_returns_inactive_source(monkeypatch):
    monkeypatch.setattr(capture, "cv2", None)
    source = DeviceFrameSource(2)
    assert not source.is_active
    assert source.read_frame() == (False, None)
    source.release()
