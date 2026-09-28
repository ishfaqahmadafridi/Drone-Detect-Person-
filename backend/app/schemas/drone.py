"""
Pydantic Schemas for Drone Avionics, Flight Control Commands, and Camera Status.
"""

from typing import Optional
from pydantic import BaseModel, Field

class DroneCommandRequest(BaseModel):
    action: str = Field(..., description="takeoff, land, patrol, hover, rtl, connect_webcam, connect_drone")
    target_altitude: Optional[float] = Field(None, ge=0.0, le=500.0)

class DroneCommandResponse(BaseModel):
    success: bool
    message: str
    flight_state: str
    altitude_m: float
    battery_percent: int

class DroneAvionicsData(BaseModel):
    flight_state: str
    battery_percent: int
    battery_voltage: float
    battery_health_percent: int
    battery_temp_c: float
    flight_time_remaining_min: int
    altitude_m: float
    ground_speed_ms: float
    gps_sats: int
    gps_fix: str
    compass_heading_deg: int
    link_quality_percent: int
    camera_online: bool
    camera_resolution: str
    camera_fps: float
    camera_sensor_temp_c: float
    camera_detecting: bool
