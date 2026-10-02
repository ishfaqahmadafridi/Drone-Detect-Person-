"""
Pydantic Schemas for Multi-Camera Fleet Management and Telemetry.
"""

from typing import Optional, List
from pydantic import BaseModel, Field

class CameraModel(BaseModel):
    id: str = Field(..., description="Unique camera identifier, e.g. CAM-01")
    channel_num: str = Field(..., description="Tactical channel number, e.g. CH-01")
    name: str = Field(..., description="Human-readable camera designation")
    location: str = Field(..., description="Deployment sector or physical post location")
    device_type: str = Field(..., description="drone_uav, poe_cctv, wifi_cctv, or mobile_phone")
    view_mode: str = Field(..., description="aerial or ground")
    source_type: str = Field(..., description="synthetic, rtsp, file, or webcam")
    stream_url: Optional[str] = Field(None, description="RTSP or HTTP network stream URL")
    ip_address: Optional[str] = Field(None, description="IP address or network endpoint")
    status: str = Field("ONLINE", description="ONLINE, STANDBY, CONNECTING, or OFFLINE")
    resolution: Optional[str] = Field("1080p FHD @ 25 FPS", description="Optical resolution and framerate")

class CameraCreateRequest(BaseModel):
    name: str = Field(..., min_length=2, description="Camera designation")
    location: str = Field(..., min_length=2, description="Deployment location")
    device_type: str = Field("poe_cctv", description="poe_cctv, wifi_cctv, or mobile_phone")
    view_mode: str = Field("ground", description="aerial or ground")
    source_type: str = Field("rtsp", description="rtsp, synthetic, file, or webcam")
    stream_url: Optional[str] = None
    ip_address: Optional[str] = None
    resolution: Optional[str] = "1080p FHD @ 25 FPS"

class CameraListResponse(BaseModel):
    cameras: List[CameraModel]
    active_camera_id: str

class CameraSwitchResponse(BaseModel):
    success: bool
    message: str
    active_camera: CameraModel
