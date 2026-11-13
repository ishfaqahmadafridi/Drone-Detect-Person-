"""Dedicated browser-test API; never imports main or contacts a real Tello."""
import socket
import sys
from types import SimpleNamespace
from pathlib import Path
from contextlib import asynccontextmanager

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from fastapi import FastAPI
from app.api.v1.endpoints import drone_control
from app.core.config import TelloControlConfig
from app.services.drone_control.controller import DroneMovementController
from tests.support.tello_emulator import TelloEmulator

emulator = TelloEmulator()
config = TelloControlConfig(mode="tello", host="127.0.0.1", port=emulator.port,
                            local_port=0, state_port=0, command_timeout=0.3,
                            flight_command_timeout=0.6, connect_attempts=1, command_gap=0.0,
                            send_interval=0.02, input_timeout=0.3)
controller = DroneMovementController(config)
drone_control.drone_movement_controller = controller

class TestAerialStream:
    source_type = "synthetic"
    source_provider = SimpleNamespace(last_frame_at=None)

    def set_source(self, source_type, source_path, transport):
        self.source_type = source_type
        self.source_provider.last_frame_at = None


camera_stream = TestAerialStream()
drone_control._aerial_stream = lambda: camera_stream



@asynccontextmanager
async def lifespan(app):
    yield
    controller.close()
    emulator.close()


app = FastAPI(lifespan=lifespan)
app.include_router(drone_control.router, prefix="/api")


@app.get("/__test__/packets")
def packets():
    return emulator.snapshot()


@app.post("/__test__/reset")
def reset():
    camera_stream.source_type = "synthetic"
    camera_stream.source_provider.last_frame_at = None
    # Only present in this isolated test server.
    with controller.lock:
        controller.transport.close()
        controller.connected = False
        controller.flight_state = "landed"
        controller.owner = None
        controller.updated = None
    with emulator.lock:
        emulator.packets.clear()
        emulator.reject = emulator.drop = None
        emulator.delays.clear()
    return {"ok": True}


@app.post("/__test__/drop/{command}")
def drop(command: str):
    with emulator.lock:
        emulator.drop = command
    return {"ok": True}


@app.post("/__test__/delay/{command}/{seconds}")
def delay(command: str, seconds: float):
    with emulator.lock:
        emulator.delays[command] = seconds
    return {"ok": True}


@app.post("/__test__/state")
def state(payload: dict):
    """Send one Tello state datagram to the controller's telemetry receiver."""
    port = controller.transport.state.port
    if port is None:
        return {"ok": False}
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
        sock.sendto(payload["text"].encode("ascii"), ("127.0.0.1", port))
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8011)
