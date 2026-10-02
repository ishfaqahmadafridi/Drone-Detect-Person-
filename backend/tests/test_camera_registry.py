"""
Tests for Camera Registry Service & Fleet Management Endpoints.
"""

from fastapi.testclient import TestClient
from main import app
from app.services.streaming.camera_registry import camera_registry_service

client = TestClient(app)

def test_list_cameras_endpoint():
    res = client.get("/api/cameras")
    assert res.status_code == 200
    data = res.json()
    assert "cameras" in data
    assert "active_camera_id" in data
    assert len(data["cameras"]) >= 5
    
    # Verify first camera is UAV-01 with sector location
    cam1 = data["cameras"][0]
    assert cam1["id"] == "CAM-01"
    assert "North Airspace" in cam1["location"]

def test_get_active_camera():
    res = client.get("/api/cameras/active")
    assert res.status_code == 200
    data = res.json()
    assert "id" in data
    assert "location" in data

def test_register_new_camera():
    new_cam_payload = {
        "name": "West Gate Tactical CCTV",
        "location": "Sector West - Checkpoint 04",
        "device_type": "poe_cctv",
        "view_mode": "ground",
        "source_type": "rtsp",
        "stream_url": "rtsp://192.168.1.120:554/live",
        "ip_address": "192.168.1.120:554",
        "resolution": "1080p FHD @ 30 FPS"
    }
    res = client.post("/api/cameras", json=new_cam_payload)
    assert res.status_code == 201
    data = res.json()
    assert data["name"] == "West Gate Tactical CCTV"
    assert data["location"] == "Sector West - Checkpoint 04"
    assert data["id"].startswith("CAM-")

def test_activate_camera_feed():
    res = client.post("/api/cameras/CAM-02/activate")
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["active_camera"]["id"] == "CAM-02"
    assert data["active_camera"]["location"] == "North Perimeter - Gate 01"

    # Verify active pointer updated
    active = camera_registry_service.get_active_camera()
    assert active.id == "CAM-02"

def test_activate_invalid_camera():
    res = client.post("/api/cameras/CAM-NONEXISTENT/activate")
    assert res.status_code == 404
