"""
Pydantic schemas for Tello manual control, telemetry and legacy mission commands.
"""

from typing import Optional
from pydantic import BaseModel, Field
from typing import Literal
from uuid import UUID


class DroneControlAxes(BaseModel):
    left_right: int = Field(0, ge=-100, le=100, strict=True)
    forward_back: int = Field(0, ge=-100, le=100, strict=True)
    up_down: int = Field(0, ge=-100, le=100, strict=True)
    yaw: int = Field(0, ge=-100, le=100, strict=True)


class DroneControlInput(BaseModel):
    session_id: UUID
    sequence: int = Field(..., ge=0, strict=True)
    axes: DroneControlAxes = Field(default_factory=DroneControlAxes)


class DroneControlSession(BaseModel):
    session_id: UUID


class DroneControlConnect(DroneControlSession):
    confirmed_landed: bool = Field(False, strict=True)


class DroneControlAction(DroneControlSession):
    action: Literal["takeoff", "land", "hover"]


class DroneTelemetry(BaseModel):
    """Latest Tello state broadcast (UDP 8890). Fields are None if the firmware omits them."""
    battery_percent: Optional[int] = None
    height_cm: Optional[int] = None
    temperature_high_c: Optional[int] = None
    age_s: float
    fresh: bool


class DroneControlStatus(BaseModel):
    mode: Literal["simulation", "tello"]
    connected: bool
    flight_state: Literal["landed", "airborne", "unknown"]
    axes: DroneControlAxes
    input_expired: bool
    error: str
    telemetry: Optional[DroneTelemetry] = None

class DroneVideoStatus(BaseModel):
    requested: bool
    receiving: bool
    message: str


class DroneCommandRequest(BaseModel):
    action: str = Field(..., description="takeoff, land, patrol, hover, rtl, connect_webcam, connect_drone")
    target_altitude: Optional[float] = Field(None, ge=0.0, le=500.0)

class DroneCommandResponse(BaseModel):
    success: bool
    message: str
    flight_state: str
    altitude_m: float
    battery_percent: int
