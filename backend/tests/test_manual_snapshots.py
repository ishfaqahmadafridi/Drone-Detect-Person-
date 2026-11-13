"""Manual evidence must reuse the selected channel's shared processed frame."""
from threading import RLock
from types import SimpleNamespace
from unittest.mock import Mock

import pytest
from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from app.services.streaming.snapshot_service import capture_stream_snapshot


def stream_fixture():
    selection = SimpleNamespace(
        lock=RLock(), frame_is_current=None,
        latest={"jpeg": b"processed-jpeg", "view_mode": "ground"},
    )
    recorder = Mock(capture_manual_snapshot=Mock(return_value="ground.jpg"))
    return SimpleNamespace(
        frame_streamer=SimpleNamespace(selection=selection),
        config=SimpleNamespace(view_mode="ground"),
        alert_manager=SimpleNamespace(evidence_recorder=recorder),
        source_provider=Mock(), pipeline_processor=Mock(),
    )


def test_capture_uses_channel_dependency_and_never_advances_capture_or_inference():
    from app.api.v1.endpoints.snapshots import router
    from app.services.streaming.channels import get_stream_session

    stream = stream_fixture()
    channels = []

    def resolve(channel: str):
        channels.append(channel)
        return stream

    app = FastAPI()
    app.include_router(router)
    app.dependency_overrides[get_stream_session] = resolve
    response = TestClient(app).post("/snapshots/capture", params={"channel": "ground"})
    assert response.status_code == 200
    assert response.json()["view_mode"] == "ground"
    assert channels == ["ground"]
    stream.alert_manager.evidence_recorder.capture_manual_snapshot.assert_called_once_with(
        view_mode="ground", jpeg=b"processed-jpeg")
    stream.source_provider.read_frame.assert_not_called()
    stream.pipeline_processor.process_frame.assert_not_called()


@pytest.mark.parametrize("missing", [True, False])
def test_capture_rejects_missing_or_invalidated_frames(missing):
    stream = stream_fixture()
    if missing:
        stream.frame_streamer.selection.latest = None
    else:
        stream.frame_streamer.selection.frame_is_current = lambda: False
    with pytest.raises(HTTPException) as error:
        capture_stream_snapshot(stream)
    assert error.value.status_code == 409
    stream.alert_manager.evidence_recorder.capture_manual_snapshot.assert_not_called()


def test_capture_does_not_report_success_when_disk_write_fails():
    stream = stream_fixture()
    stream.alert_manager.evidence_recorder.capture_manual_snapshot.side_effect = OSError("disk full")
    with pytest.raises(HTTPException) as error:
        capture_stream_snapshot(stream)
    assert error.value.status_code == 503


def test_manual_recorder_preserves_encoded_frame_and_indexes_saved_file(tmp_path, monkeypatch):
    from app.services.alert.evidence_recorder import EvidenceRecorder
    from app.db import evidence_repository

    insert = Mock()
    monkeypatch.setattr(evidence_repository, "insert", insert)
    recorder = EvidenceRecorder(output_dir=str(tmp_path), snapshots_dir=str(tmp_path), logs_dir=str(tmp_path))
    filename = recorder.capture_manual_snapshot(view_mode="ground", jpeg=b"processed-jpeg")
    assert (tmp_path / filename).read_bytes() == b"processed-jpeg"
    assert insert.call_args.args[0].view_mode == "ground"


def test_manual_recorder_reports_index_failure(tmp_path, monkeypatch):
    from app.services.alert.evidence_recorder import EvidenceRecorder
    from app.db import evidence_repository

    monkeypatch.setattr(evidence_repository, "insert", Mock(side_effect=RuntimeError("database unavailable")))
    recorder = EvidenceRecorder(output_dir=str(tmp_path), snapshots_dir=str(tmp_path), logs_dir=str(tmp_path))
    with pytest.raises(OSError, match="index manual snapshot"):
        recorder.capture_manual_snapshot(view_mode="ground", jpeg=b"processed-jpeg")
