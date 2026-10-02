"""
Default Fleet Seed Configuration for Tactical Surveillance Cameras.
"""

from typing import List
from app.schemas.camera import CameraModel

def build_default_fleet() -> List[CameraModel]:
    """
    Constructs the baseline tactical camera channels with distinct deployment locations.
    """
    return [
        CameraModel(
            id="CAM-01",
            channel_num="CH-01",
            name="UAV-01 Aerial Gimbal",
            location="North Airspace - Sector 04",
            device_type="drone_uav",
            view_mode="aerial",
            source_type="synthetic",
            status="ONLINE",
            resolution="1080p FHD @ 25 FPS",
            ip_address="10.10.10.1 (Avionics Link)",
        ),
        CameraModel(
            id="CAM-02",
            channel_num="CH-02",
            name="Gate 01 Perimeter CCTV",
            location="North Perimeter - Gate 01",
            device_type="poe_cctv",
            view_mode="ground",
            source_type="rtsp",
            stream_url="rtsp://192.168.1.100:554/live",
            status="STANDBY",
            resolution="1080p FHD @ 25 FPS",
            ip_address="192.168.1.100:554",
        ),
        CameraModel(
            id="CAM-03",
            channel_num="CH-03",
            name="East Perimeter Fence CCTV",
            location="Perimeter East - Fence Line",
            device_type="poe_cctv",
            view_mode="ground",
            source_type="rtsp",
            stream_url="rtsp://192.168.1.101:554/live",
            status="STANDBY",
            resolution="1080p FHD @ 25 FPS",
            ip_address="192.168.1.101:554",
        ),
        CameraModel(
            id="CAM-04",
            channel_num="CH-04",
            name="South Loading Dock CCTV",
            location="Loading Dock South - Post 07",
            device_type="poe_cctv",
            view_mode="ground",
            source_type="rtsp",
            stream_url="rtsp://192.168.1.102:554/live",
            status="STANDBY",
            resolution="1080p FHD @ 25 FPS",
            ip_address="192.168.1.102:554",
        ),
        CameraModel(
            id="CAM-05",
            channel_num="CH-05",
            name="Mobile Patrol Unit (Pixel 6A)",
            location="West Perimeter - Mobile Patrol",
            device_type="mobile_phone",
            view_mode="ground",
            source_type="rtsp",
            stream_url="http://10.10.20.117:8080/video",
            status="STANDBY",
            resolution="1080p FHD @ 30 FPS",
            ip_address="10.10.20.117:8080",
        ),
    ]
