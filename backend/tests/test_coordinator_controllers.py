"""Regression coverage for coordination across extracted controllers."""
from threading import RLock, Thread, Event
from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException
from app.services.streaming.coordinator.lifecycle_controller import StreamLifecycleController
from app.services.streaming.coordinator.selection_controller import TargetSelectionController
from app.services.streaming.coordinator.tracking_manager import TargetTrackingManager
from app.services.streaming.selection_session import SelectionSession
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.core.config import DetectionConfig


def test_repeated_view_preserves_selection():
    streamer, perspective, tracking = MagicMock(), MagicMock(), MagicMock()
    streamer.selection.lock = RLock()
    streamer.source_lock = RLock()
    perspective.config.view_mode = "ground"
    controller = StreamLifecycleController(streamer, perspective, tracking)
    assert controller.set_view_mode("ground") == "ground"
    streamer.invalidate.assert_not_called()
    tracking.set_tracking_mode.assert_not_called()
    with pytest.raises(HTTPException):
        controller.set_view_mode("aerial", fixed_view="ground")


def test_source_switch_waits_for_capture_lock():
    streamer, perspective, tracking = MagicMock(), MagicMock(), MagicMock()
    streamer.selection.lock = RLock()
    streamer.source_lock = RLock()
    controller = StreamLifecycleController(streamer, perspective, tracking)
    started, finished = Event(), Event()

    def switch():
        started.set()
        controller.set_source("file", "clip.mp4")
        finished.set()

    with streamer.source_lock:
        worker = Thread(target=switch)
        worker.start()
        assert started.wait(1)
        assert not finished.wait(0.05)
        perspective.set_source.assert_not_called()
    worker.join(timeout=2)
    assert finished.is_set()
    perspective.set_source.assert_called_once_with("file", "clip.mp4", transport="tcp")


def test_normalized_manual_mode_cannot_bypass_ground_guard():
    tracking = TargetTrackingManager(DetectionConfig(view_mode="aerial"), TelemetryStateStore())
    controller = TargetSelectionController(tracking, SelectionSession())
    with pytest.raises(HTTPException):
        controller.set_tracking_mode(" MANUAL ", [1])
    assert tracking.config.tracking_mode == "auto"


def test_coordinate_selection_uses_actual_dimensions_and_skips_bad_boxes():
    telemetry = TelemetryStateStore()
    telemetry.update(frame_width=640, frame_height=480, detections=[
        {"id": 9, "bbox": None},
        {"id": 7, "bbox": [280, 200, 360, 280]},
    ])
    tracking = TargetTrackingManager(DetectionConfig(view_mode="ground"), telemetry)
    assert tracking.select_target(x=0.5, y=0.5)["toggled_id"] == 7


def test_promoted_camera_overrides_matching_global_view(monkeypatch):
    from app.services.streaming import channels
    default = SimpleNamespace(config=SimpleNamespace(view_mode="ground"))
    promoted = object()
    monkeypatch.setattr(channels, "stream_service", default)
    monkeypatch.setattr(channels, "_channels", {"ground": promoted})
    assert channels.get_stream_session("ground") is promoted
    assert channels.get_stream_session() is default
