"""
Coordinator Configuration: Operational thresholds and pacing parameters for video streaming.
"""

from dataclasses import dataclass


@dataclass
class CoordinatorConfig:
    """
    Operational thresholds and pacing for the stream broadcast loop.
    """
    jpeg_quality: int = 80
    no_frame_retry_sleep_seconds: float = 0.04
    frame_rate_throttle_seconds: float = 0.015
