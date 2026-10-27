"""Dedicated browser-test API; never imports main or contacts a real Tello."""
import sys
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
                            local_port=0, command_timeout=0.3,
                            send_interval=0.02, input_timeout=0.3)
controller = DroneMovementController(config)
drone_control.drone_movement_controller = controller


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
    return {"ok": True}


@app.post("/__test__/drop/{command}")
def drop(command: str):
    with emulator.lock:
        emulator.drop = command
    return {"ok": True}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8011)
