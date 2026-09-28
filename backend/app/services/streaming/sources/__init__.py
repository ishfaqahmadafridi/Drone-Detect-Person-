"""
Modular Frame Source Subsystem for AERO-GUARD.
Decomposed into BaseFrameSource, HttpFrameSource, DeviceFrameSource, and SyntheticFrameSource.
"""

from app.services.streaming.sources.base import BaseFrameSource
from app.services.streaming.sources.http_source import HttpFrameSource
from app.services.streaming.sources.device_source import DeviceFrameSource
from app.services.streaming.sources.synthetic_source import SyntheticFrameSource

__all__ = [
    "BaseFrameSource",
    "HttpFrameSource",
    "DeviceFrameSource",
    "SyntheticFrameSource",
]
