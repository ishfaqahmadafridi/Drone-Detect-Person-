"""Manual control tests use fake transports; no aircraft is contacted."""
from types import SimpleNamespace
from unittest.mock import Mock, patch
from uuid import uuid4

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from app.core.config import TelloControlConfig
from app.schemas.drone import DroneControlInput, DroneControlAxes
from app.services.drone_control.controller import DroneMovementController
from app.services.drone_control.transport import TelloTransport


@pytest.fixture
def control():
    now = [0.0]
    transport = Mock()
    service = DroneMovementController(TelloControlConfig(), transport, clock=lambda: now[0])
    service._thread = Mock(is_alive=lambda: True)
    owner = uuid4()
    service.connect(owner)
    yield SimpleNamespace(service=service, owner=owner, transport=transport, now=now)
    service.close()


def movement(owner, sequence, **axes):
    return DroneControlInput(session_id=owner, sequence=sequence, axes=DroneControlAxes(**axes))


@pytest.mark.parametrize("axis,sign", [
    ("left_right", -1), ("left_right", 1), ("forward_back", 1), ("forward_back", -1),
    ("up_down", 1), ("up_down", -1), ("yaw", -1), ("yaw", 1),
])
def test_each_movement_and_release(control, axis, sign):
    c = control
    c.service.action(c.owner, "takeoff")
    c.service.input(movement(c.owner, 1, **{axis: sign * 25}))
    c.service.tick()
    assert getattr(c.transport.send_rc.call_args.args[0], axis) == sign * 25
    c.service.input(movement(c.owner, 2))
    c.service.tick()
    assert not any(c.transport.send_rc.call_args.args[0].model_dump().values())


def test_expired_input_sends_neutral_then_stops_keepalives(control):
    c = control
    c.service.action(c.owner, "takeoff")
    c.service.input(movement(c.owner, 1, left_right=25))
    c.now[0] += c.service.config.input_timeout
    c.service.tick()
    assert c.service.status().input_expired
    assert not any(c.transport.send_rc.call_args.args[0].model_dump().values())
    count = c.transport.send_rc.call_count
    c.service.tick()
    assert c.transport.send_rc.call_count == count


def test_old_packets_and_other_operators_cannot_override(control):
    c = control
    c.service.action(c.owner, "takeoff")
    c.service.input(movement(c.owner, 2, left_right=25))
    for request in [movement(c.owner, 1), movement(uuid4(), 3)]:
        with pytest.raises(HTTPException) as exc:
            c.service.input(request)
        assert exc.value.status_code == 409
    with pytest.raises(HTTPException):
        c.service.connect(uuid4())
    assert c.service.status().axes.left_right == 25


def test_takeover_after_expiry_invalidates_previous_owner(control):
    c = control
    c.service.input(movement(c.owner, 1))
    c.now[0] += c.service.config.input_timeout
    new_owner = uuid4()
    c.service.connect(new_owner)
    with pytest.raises(HTTPException):
        c.service.input(movement(c.owner, 2))
    c.service.input(movement(new_owner, 1))


def test_timeout_marks_flight_unknown_and_never_retries(control):
    c = control
    c.transport.command.side_effect = TimeoutError("no aircraft response")
    with pytest.raises(HTTPException) as exc:
        c.service.action(c.owner, "takeoff")
    assert exc.value.status_code == 503
    c.transport.command.assert_called_once_with("takeoff")
    assert not c.service.status().connected
    assert c.service.status().flight_state == "unknown"
    c.service.connect(c.owner)
    with pytest.raises(HTTPException):
        c.service.action(c.owner, "takeoff")


def test_land_required_for_movement_and_disconnect(control):
    c = control
    with pytest.raises(HTTPException):
        c.service.input(movement(c.owner, 1, up_down=25))
    c.service.action(c.owner, "takeoff")
    with pytest.raises(HTTPException):
        c.service.disconnect(c.owner)
    c.service.action(c.owner, "land")
    assert not c.service.disconnect(c.owner).connected
    assert c.service.connect(c.owner).connected


@pytest.mark.parametrize("value", [-101, 101, 1.5, True, "25"])
def test_axis_bounds_are_validated(value):
    with pytest.raises(ValidationError):
        DroneControlAxes(left_right=value)


def test_udp_transport_uses_correct_axis_order_and_releases_failed_socket():
    config = TelloControlConfig(mode="tello")
    transport = TelloTransport(config)
    sock = Mock()
    sock.recv.side_effect = [BlockingIOError(), b"ok"]
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        transport.connect()
    sock.connect.assert_called_once_with((config.host, config.port))
    transport.send_rc(DroneControlAxes(left_right=-25, forward_back=10, up_down=20, yaw=-5))
    sock.send.assert_called_with(b"rc -25 10 20 -5")
    transport.close()
    sock.close.assert_called_once()


def test_failed_connection_closes_socket():
    transport = TelloTransport(TelloControlConfig(mode="tello"))
    sock = Mock()
    sock.recv.side_effect = [BlockingIOError(), TimeoutError()]
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        with pytest.raises(TimeoutError):
            transport.connect()
    sock.close.assert_called_once()
    assert transport.socket is None


def test_api_validation_and_full_simulated_workflow(control, monkeypatch):
    from fastapi.testclient import TestClient
    from main import app
    from app.api.v1.endpoints import drone_control
    monkeypatch.setattr(drone_control, "drone_movement_controller", control.service)
    client = TestClient(app)
    session = {"session_id": str(control.owner)}
    assert client.post("/api/drone/manual/connect", json=session).json()["mode"] == "simulation"
    response = client.post("/api/drone/manual/action", json={**session, "action": "takeoff"})
    assert response.status_code == 200
    assert response.json()["flight_state"] == "airborne"
    response = client.post("/api/drone/manual/input", json={**session, "sequence": 1, "axes": {"left_right": -25}})
    assert response.json()["axes"]["left_right"] == -25
    assert client.post("/api/drone/manual/input", json={**session, "sequence": 2, "axes": {"yaw": 101}}).status_code == 422
    assert client.post("/api/drone/manual/action", json={**session, "action": "rtl"}).status_code == 422
    assert client.post("/api/drone/manual/action", json={**session, "action": "land"}).json()["flight_state"] == "landed"
    assert not client.post("/api/drone/manual/disconnect", json=session).json()["connected"]
