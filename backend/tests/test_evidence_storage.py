import os

from fastapi.testclient import TestClient

from app.db import evidence_repository
from app.schemas.evidence import EvidenceRecordCreate
from main import app

client = TestClient(app)


def _insert(tmp_path, name, created_at, media_type="image", size_kb=10.0):
    path = tmp_path / name
    path.write_bytes(b"x")
    evidence_repository.insert(EvidenceRecordCreate(
        media_type=media_type, filename=name, file_path=str(path), url=f"/snapshots/{name}",
        view_mode="ground", threat_level="INTRUSION", threat_type="ZONE INTRUSION",
        duration_seconds=0.0, file_size_kb=size_kb, created_at=created_at,
    ))
    return path


def test_cleanup_deletes_only_old_records_of_the_requested_type(tmp_path):
    old_image = _insert(tmp_path, "cleanup_old_ground_1.jpg", "2000-01-01 00:00:00")
    new_image = _insert(tmp_path, "cleanup_new_ground_2.jpg", "2999-01-01 00:00:00")
    old_video = _insert(tmp_path, "cleanup_old_ground_3.mp4", "2000-01-01 00:00:00", media_type="video")

    response = client.post("/api/evidence/cleanup", json={"older_than_days": 30, "media_type": "image"})

    assert response.status_code == 200
    assert response.json()["deleted"] >= 1
    assert not os.path.exists(old_image)
    assert os.path.exists(new_image)
    assert os.path.exists(old_video)
    assert evidence_repository.get_by_filename("cleanup_new_ground_2.jpg") is not None


def test_cleanup_rejects_invalid_age():
    assert client.post("/api/evidence/cleanup", json={"older_than_days": 0}).status_code == 422


def test_stats_report_counts_and_sizes(tmp_path):
    _insert(tmp_path, "stats_ground_1.jpg", "2999-01-01 00:00:00", size_kb=20.0)
    stats = client.get("/api/evidence/stats").json()
    assert stats["image"]["count"] >= 1
    assert stats["image"]["size_kb"] >= 20.0
    assert "video" in stats


def test_capture_settings_round_trip():
    response = client.post("/api/config?channel=ground", json={"save_snapshots_on_alert": False, "snapshot_cooldown_seconds": 30})
    assert response.status_code == 200
    config = response.json()["config"]
    assert config["save_snapshots_on_alert"] is False
    assert config["snapshot_cooldown_seconds"] == 30
    assert client.post("/api/config?channel=ground", json={"snapshot_cooldown_seconds": 0.5}).status_code == 422
    client.post("/api/config?channel=ground", json={"save_snapshots_on_alert": True, "snapshot_cooldown_seconds": 3})
