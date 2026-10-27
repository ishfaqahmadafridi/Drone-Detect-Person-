"""Behavior contracts for the composed frame pipeline, without model loading."""
from threading import Lock
from types import SimpleNamespace
from unittest.mock import Mock

import numpy as np
import pytest

from app.core.config import DetectionConfig
from app.services.streaming.pipeline_processor.frame_orchestrator import PipelineFrameOrchestrator


def make_services(view="ground", mode="manual", observer_failure=False):
    events = []
    config = DetectionConfig(view_mode=view, tracking_mode=mode, selected_target_ids=[7],
                             confidence_threshold=.35)
    person = {"id": 7, "bbox": [1, 1, 8, 8], "conf": .9}
    pending = {"id": None, "bbox": [10, 10, 15, 15], "conf": .7}

    def record(name, result):
        def call(*args, **kwargs):
            events.append(name)
            return result
        return Mock(side_effect=call)

    def observe(frame, detections, index, source, selected):
        events.append("observe")
        assert not np.any(frame)
        assert detections == [person]
        assert selected == [7]
        if observer_failure:
            raise RuntimeError("observer unavailable")

    def render(**kwargs):
        events.append("render")
        kwargs["frame"][:] = 90
        return kwargs["frame"]

    services = SimpleNamespace(
        lock=Lock(), config=config,
        detector=SimpleNamespace(active_view=view, config=config, fps=float("nan"),
                                 untracked_detections=[pending], engine="test-engine"),
        zone_monitor=SimpleNamespace(update_resolution=record("resolution", None)),
        tracker=SimpleNamespace(detect_and_track=record("detect", [person])),
        frame_observer=Mock(side_effect=observe),
        hazard_evaluator=SimpleNamespace(evaluate=record("zone", [person])),
        alert_manager=object(),
        threat_classifier=SimpleNamespace(
            evaluate_state=record("classify", ("INTRUSION", "ALERT", {"event": 1})),
            persist_evidence=record("evidence", None)),
        hud_annotator=SimpleNamespace(render=Mock(side_effect=render)),
        avionics_syncer=SimpleNamespace(sync=record("avionics", {"battery": 80})),
    )
    return services, events


@pytest.mark.parametrize("view", ["ground", "aerial"])
@pytest.mark.parametrize("mode", ["auto", "manual"])
@pytest.mark.parametrize("source", ["synthetic", "file"])
def test_stage_order_and_result_contract(view, mode, source):
    services, events = make_services(view, mode)
    result = PipelineFrameOrchestrator(services).process(
        np.zeros((24, 32, 3), dtype=np.uint8), 11, source_type=source
    )
    assert events == ["resolution", "detect", "observe", "zone", "classify",
                      "render", "evidence", "avionics"]
    payload = result.telemetry_payload
    assert payload["frame_width"] == 32 and payload["frame_height"] == 24
    assert payload["view_mode"] == view and payload["source_type"] == source
    assert payload["tracking_mode"] == mode
    assert payload["threat_level"] == ("MANUAL" if mode == "manual" else "INTRUSION")
    assert payload["fps"] == 0 and payload["frame_idx"] == 11
    assert payload["engine"] == "test-engine"
    assert payload["avionics"] == {"battery": 80}
    assert len(payload["detections"]) == 1
    assert len(payload["untracked_detections"]) == (source != "synthetic")
    rendered = services.hud_annotator.render.call_args.kwargs["detected_persons"]
    assert len(rendered) == (1 if source == "synthetic" else 2)
    assert np.all(result.annotated_frame == 90)


def test_observer_failure_keeps_detection_and_output_running():
    services, events = make_services(observer_failure=True)
    result = PipelineFrameOrchestrator(services).process(np.zeros((24, 32, 3), np.uint8), 1)
    assert events[-1] == "avionics"
    assert result.detected_persons[0]["id"] == 7


@pytest.mark.parametrize("stage,method", [
    ("tracker", "detect_and_track"), ("hazard_evaluator", "evaluate"),
    ("threat_classifier", "evaluate_state"), ("hud_annotator", "render"),
    ("avionics_syncer", "sync"),
])
def test_stage_failure_returns_safe_fallback(stage, method):
    services, _ = make_services()
    getattr(getattr(services, stage), method).side_effect = RuntimeError("stage unavailable")
    result = PipelineFrameOrchestrator(services).process(
        np.zeros((24, 32, 3), np.uint8), 1, source_type="file"
    )
    assert result.alert_msg == "FRAME DROP / STANDBY"
    assert result.telemetry_payload["view_mode"] == "ground"
    assert result.telemetry_payload["source_type"] == "file"
    assert result.annotated_frame.shape == (24, 32, 3)


def test_empty_annotation_uses_normalized_frame():
    services, _ = make_services()
    services.hud_annotator.render.side_effect = None
    services.hud_annotator.render.return_value = None
    frame = np.zeros((24, 32, 3), np.uint8)
    result = PipelineFrameOrchestrator(services).process(frame, 1)
    assert result.annotated_frame is frame
    services.threat_classifier.persist_evidence.assert_called_once()
