"""Exercise FastAPI -> controller -> real UDP socket -> loopback Tello peer."""
from dataclasses import replace
from uuid import uuid4
import socket
import threading
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
        host="127.0.0.1", port=peer.port, local_port=0, state_port=0,
        command_timeout=0.15, flight_command_timeout=0.6, connect_attempts=1,
        command_gap=0.0, send_interval=0.01, input_timeout=0.08))
    monkeypatch.setattr(drone_control, "drone_movement_controller", controller)
    app = FastAPI()
    app.include_router(drone_control.router, prefix="/api")
    with TestClient(app) as client:
        client.controller = controller
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


def test_rejected_landing_reports_drone_response_and_disables_movement(sdk_api):
    client, peer, session = sdk_api
    assert client.post("/api/drone/manual/connect", json=session).status_code == 200
    peer.reject = "land"
    result = client.post("/api/drone/manual/action", json={**session, "action": "land"})
    assert result.status_code == 503
    assert "Tello rejected land: error" in result.json()["detail"]
    status = client.get("/api/drone/manual/status").json()
    assert status["flight_state"] == "unknown"
    assert not status["connected"]
    movement = client.post("/api/drone/manual/input", json={
        **session, "sequence": 1, "axes": {"up_down": 25},
    })
    assert movement.status_code == 409
    assert peer.snapshot().count("land") == 1


def test_unknown_state_recovery_requires_explicit_ground_confirmation(sdk_api):
    client, peer, session = sdk_api
    client.post("/api/drone/manual/connect", json=session)
    peer.reject = "land"
    client.post("/api/drone/manual/action", json={**session, "action": "land"})
    assert client.post("/api/drone/manual/connect", json=session).status_code == 409
    recovered = client.post("/api/drone/manual/connect", json={**session, "confirmed_landed": True})
    assert recovered.status_code == 200
    assert recovered.json()["flight_state"] == "landed"
    assert recovered.json()["connected"]
    assert recovered.json()["error"] == ""
    assert peer.snapshot().count("takeoff") == 0
    assert peer.snapshot().count("land") == 1


def test_camera_start_uses_sdk_without_flight_commands(sdk_api, monkeypatch):
    from types import SimpleNamespace
    from unittest.mock import Mock
    from app.api.v1.endpoints import drone_control
    client, peer, session = sdk_api
    stream = SimpleNamespace(source_type="tello", source_provider=SimpleNamespace(last_frame_at=None), set_source=Mock())
    monkeypatch.setattr(drone_control, "_aerial_stream", lambda: stream)
    assert client.post("/api/drone/manual/video", json=session).status_code == 409
    client.post("/api/drone/manual/connect", json=session)
    response = client.post("/api/drone/manual/video", json=session)
    assert response.status_code == 200
    assert response.json()["requested"] and not response.json()["receiving"]
    assert "streamon" in peer.snapshot()
    assert "takeoff" not in peer.snapshot() and "land" not in peer.snapshot()
    peer.reject = "streamon"
    assert client.post("/api/drone/manual/video", json=session).status_code == 503
    status = client.get("/api/drone/manual/status").json()
    assert status["connected"] and status["flight_state"] == "landed"


def send_state(controller, text):
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(text.encode("ascii"), ("127.0.0.1", controller.transport.state.port))


def test_slow_takeoff_ack_uses_flight_timeout_not_command_timeout(sdk_api):
    client, peer, session = sdk_api
    client.post("/api/drone/manual/connect", json=session)
    peer.delays["takeoff"] = 0.3  # Longer than command_timeout, shorter than flight timeout.
    result = client.post("/api/drone/manual/action", json={**session, "action": "takeoff"})
    assert result.status_code == 200
    assert result.json()["flight_state"] == "airborne"


def test_telemetry_reaches_status_and_low_battery_blocks_takeoff(sdk_api):
    client, peer, session = sdk_api
    client.post("/api/drone/manual/connect", json=session)
    send_state(client.controller, "pitch:0;roll:0;yaw:0;h:0;bat:12;tof:10;temph:61;time:0;\r\n")
    wait_for(lambda: client.get("/api/drone/manual/status").json()["telemetry"])
    telemetry = client.get("/api/drone/manual/status").json()["telemetry"]
    assert telemetry["battery_percent"] == 12 and telemetry["fresh"]
    result = client.post("/api/drone/manual/action", json={**session, "action": "takeoff"})
    assert result.status_code == 409
    assert "Battery 12%" in result.json()["detail"]
    assert "takeoff" not in peer.snapshot()
    assert client.get("/api/drone/manual/status").json()["flight_state"] == "landed"


def test_emergency_is_sent_while_takeoff_ack_is_pending(sdk_api):
    client, peer, session = sdk_api
    client.post("/api/drone/manual/connect", json=session)
    peer.delays["takeoff"] = 0.4
    takeoff = threading.Thread(target=client.post, args=("/api/drone/manual/action",),
                               kwargs={"json": {**session, "action": "takeoff"}})
    takeoff.start()
    wait_for(lambda: "takeoff" in peer.snapshot())
    result = client.post("/api/drone/manual/emergency", json=session)
    takeoff.join()
    packets = peer.snapshot()
    assert packets.index("emergency") > packets.index("takeoff")
    assert result.status_code == 200
    assert result.json()["flight_state"] == "unknown"
    assert packets.count("takeoff") == 1


def test_emergency_requires_the_owning_session(sdk_api):
    client, peer, session = sdk_api
    client.post("/api/drone/manual/connect", json=session)
    other = client.post("/api/drone/manual/emergency", json={"session_id": str(uuid4())})
    assert other.status_code == 409
    assert "emergency" not in peer.snapshot()
