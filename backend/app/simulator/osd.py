"""
Telemetry OSD Renderer: Simulates on-screen flight instruments and GPS data.
"""

import math
import cv2
import numpy as np

class TelemetryOsdRenderer:
    """
    Renders simulated drone telemetry text (altitude, ground speed, battery, heading, GPS).
    """
    @staticmethod
    def render(frame: np.ndarray, frame_idx: int, total_frames: int) -> None:
        height = frame.shape[0]
        telemetry_y = height - 20
        alt = 24.5 + math.sin(frame_idx * 0.05) * 0.8
        bat = max(10, int(98 - (frame_idx / max(total_frames, 1)) * 8))
        osd_text = f"DRONE TELEMETRY: ALT {alt:.1f}m | SPD 3.2m/s | BAT {bat}% | HDG 184 DEG | GPS 34.0152N, 71.5249E"
        cv2.putText(
            frame,
            osd_text,
            (20, telemetry_y),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.45,
            (255, 255, 255),
            1,
            cv2.LINE_AA
        )
