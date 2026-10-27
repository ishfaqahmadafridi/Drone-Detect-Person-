"""Exercise FastAPI -> controller -> real UDP socket -> loopback Tello peer."""
from dataclasses import replace
from uuid import uuid4
import time

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from app.core.config import TelloControlConfig
from app.services.drone_control.controller import DroneMovementController
from tests.support.tello_emulator import TelloEmulator


@pytest.fixture
def sdk_api(monkeypatch):
    from app.api.v1.endpoints import drone_control
    peer = TelloEmulator()
    controller = DroneMovementController(replace(TelloControlConfig(), mode="tello",
        host="127.0.0.1", port=peer.port, local_port=0,
        command_timeout=0.15, send_interval=0.01, input_timeout=0.08))
    monkeypatch.setattr(drone_control, "drone_movement_controller", controller)
    app = FastAPI()
    app.include_router(drone_control.router, prefix="/api")
    with TestClient(app) as client:
        yield client, peer, {"session_id": str(uuid4())}
    controller.close()
    peer.close()


def wait_for(predicate):
    deadline = time.monotonic() + 2
    while time.monotonic() < deadline:
        if predicate():
            return
        time.sleep(0.01)
    raise AssertionError("Expected UDP observation did not arrive")


def test_full_connection_movement_release_land_disconnect(sdk_api):
    client, peer, session = sdk_api
    post = lambda path, body: client.post("/api/drone/manual/" + path, json={**session, **body})
    assert post("connect", {}).status_code == 200
    assert peer.snapshot()[0] == "command"
    assert post("action", {"action": "takeoff"}).json()["flight_state"] == "airborne"
    assert post("input", {"sequence": 1, "axes": {"left_right": -25}}).status_code == 200
    wait_for(lambda: "rc -25 0 0 0" in peer.snapshot())
    assert post("input", {"sequence": 2, "axes": {}}).status_code == 200
    wait_for(lambda: peer.snapshot()[-1] == "rc 0 0 0 0")
    assert post("action", {"action": "land"}).json()["flight_state"] == "landed"
    assert not post("disconnect", {}).json()["connected"]
    assert "land" in peer.snapshot()


def test_missing_drone_response_does_not_report_connected(sdk_api):
    client, peer, session = sdk_api
    peer.drop = "command"
    result = client.post("/api/drone/manual/connect", json=session)
    assert result.status_code == 503
    assert not client.get("/api/drone/manual/status").json()["connected"]


def test_takeoff_timeout_is_unknown_and_not_retried(sdk_api):
    client, peer, session = sdk_api
    assert client.post("/api/drone/manual/connect", json=session).status_code == 200
    peer.drop = "takeoff"
    result = client.post("/api/drone/manual/action", json={**session, "action": "takeoff"})
    assert result.status_code == 503
    assert client.get("/api/drone/manual/status").json()["flight_state"] == "unknown"
    assert peer.snapshot().count("takeoff") == 1


def test_browser_input_loss_clears_motion_without_keepalive_forever(sdk_api):
    client, peer, session = sdk_api
    client.post("/api/drone/manual/connect", json=session)
    client.post("/api/drone/manual/action", json={**session, "action": "takeoff"})
    client.post("/api/drone/manual/input", json={**session, "sequence": 1, "axes": {"up_down": 25}})
    wait_for(lambda: "rc 0 0 25 0" in peer.snapshot())
    wait_for(lambda: client.get("/api/drone/manual/status").json()["input_expired"])
    wait_for(lambda: peer.snapshot()[-1] == "rc 0 0 0 0")
    count = len(peer.snapshot())
    time.sleep(0.1)
    assert len(peer.snapshot()) == count
