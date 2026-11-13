"""Manual control tests use fake transports; no aircraft is contacted."""
from types import SimpleNamespace
from dataclasses import replace
from unittest.mock import Mock, patch
from uuid import uuid4

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from app.core.config import TelloControlConfig
from app.schemas.drone import DroneControlInput, DroneControlAxes
from app.services.drone_control.controller import DroneMovementController
from app.services.drone_control.transport import TelloTransport
from app.services.drone_control.telemetry import parse_state


def tello_transport(**overrides):
    config = replace(TelloControlConfig(), mode="tello", command_gap=0.0, **overrides)
    return TelloTransport(config, state_receiver=Mock(snapshot=Mock(return_value=None))), config


@pytest.fixture
def control():
    now = [0.0]
    transport = Mock()
    transport.telemetry.return_value = None
    service = DroneMovementController(replace(TelloControlConfig(), mode="simulation"), transport, clock=lambda: now[0])
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
    with pytest.raises(HTTPException) as reconnect_error:
        c.service.connect(c.owner)
    assert reconnect_error.value.status_code == 409
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
    transport, config = tello_transport()
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
    transport, _ = tello_transport(connect_attempts=1)
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


def test_sdk_connect_ignores_binary_packets_until_text_acknowledgment():
    transport, _ = tello_transport()
    sock = Mock()
    sock.recv.side_effect = [BlockingIOError(), b'\xcc\x18\x01\x00', b'\x00\x01', b'ok']
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        transport.connect()
    sock.send.assert_called_once_with(b"command")
    transport.close()


def test_binary_packet_does_not_confirm_connection_or_leak_into_error():
    transport, _ = tello_transport(connect_attempts=1)
    sock = Mock()
    sock.recv.side_effect = [BlockingIOError(), b'\xcc\x18\x01\x00', TimeoutError()]
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        with pytest.raises(TimeoutError, match="received non-SDK binary packets"):
            transport.connect()
    assert transport.socket is None
    sock.send.assert_called_once_with(b"command")


def test_sdk_handshake_is_retried_but_only_the_handshake():
    transport, _ = tello_transport(connect_attempts=3)
    sock = Mock()
    sock.recv.side_effect = [BlockingIOError(), TimeoutError(), BlockingIOError(), b"ok"]
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        transport.connect()
    assert [c.args[0] for c in sock.send.call_args_list] == [b"command", b"command"]
    sock.recv.side_effect = [BlockingIOError(), TimeoutError()]
    with pytest.raises(TimeoutError):
        transport.command("takeoff")
    assert [c.args[0] for c in sock.send.call_args_list].count(b"takeoff") == 1


def test_handshake_failure_after_all_attempts_reports_link_hint_and_closes():
    transport, _ = tello_transport(connect_attempts=2)
    sock = Mock()
    sock.recv.side_effect = [BlockingIOError(), TimeoutError()] * 2
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        with pytest.raises(TimeoutError, match="after 2 attempt"):
            transport.connect()
    assert transport.socket is None
    transport.state.stop.assert_called()


def test_port_in_use_is_a_clear_connection_error():
    transport, _ = tello_transport()
    sock = Mock()
    sock.bind.side_effect = OSError(48, "Address already in use")
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        with pytest.raises(ConnectionError, match="Cannot open Tello control socket"):
            transport.connect()
    sock.close.assert_called_once()


def test_unreachable_drone_is_reported_as_connection_error():
    transport, _ = tello_transport(connect_attempts=1)
    sock = Mock()
    sock.recv.side_effect = [BlockingIOError(), ConnectionRefusedError()]
    with patch("app.services.drone_control.transport.socket.socket", return_value=sock):
        with pytest.raises(ConnectionError, match="unreachable"):
            transport.connect()


def test_acknowledged_commands_wait_for_minimum_gap():
    now, slept = [10.0], []
    config = replace(TelloControlConfig(), mode="tello", command_gap=0.1)
    transport = TelloTransport(config, state_receiver=Mock(), clock=lambda: now[0], sleep=slept.append)
    transport.socket = sock = Mock()
    transport.send_rc(DroneControlAxes())
    sock.recv.side_effect = [BlockingIOError(), b"ok"]
    transport.command("land")
    assert slept == [pytest.approx(0.1)]


def test_state_packet_parsing_tolerates_noise():
    state = parse_state(b"pitch:0;roll:-1;bat:87;h:30;garbage;temph:62;\r\n")
    assert state["bat"] == "87" and state["h"] == "30" and "garbage" not in state
    assert parse_state(b"\xff\xfe") == {}


def test_emergency_marks_state_unknown_and_requires_ground_confirmation(control):
    c = control
    c.service.action(c.owner, "takeoff")
    status = c.service.emergency(c.owner)
    c.transport.emergency.assert_called_once()
    assert status.flight_state == "unknown"
    with pytest.raises(HTTPException):
        c.service.input(movement(c.owner, 1, up_down=25))
    assert c.service.connect(c.owner, confirmed_landed=True).flight_state == "landed"


@pytest.mark.parametrize("value", ["inf", "-inf", "nan", "broken"])
def test_malformed_telemetry_numbers_do_not_break_status(value):
    from app.services.drone_control.telemetry import TelloStateReceiver

    receiver = TelloStateReceiver(TelloControlConfig(), clock=lambda: 1.0)
    receiver._state = {"bat": value}
    receiver._received_at = 1.0
    snapshot = receiver.snapshot()
    assert snapshot.battery_percent is None
    assert snapshot.fresh


def test_connect_reserves_ownership_before_first_heartbeat(control):
    with pytest.raises(HTTPException) as error:
        control.service.connect(uuid4())
    assert error.value.status_code == 409


def test_expired_lease_takeover_reserves_the_new_operator(control):
    control.now[0] += control.service.config.input_timeout
    replacement = uuid4()
    control.service.connect(replacement)
    with pytest.raises(HTTPException) as error:
        control.service.connect(uuid4())
    assert error.value.status_code == 409
    assert control.service.owner == replacement
