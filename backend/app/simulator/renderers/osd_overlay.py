"""
OsdOverlayRenderer: Authentic security-camera OSD (On-Screen Display).

Renders the recording indicator, camera header, timestamp, and status footer.
All text literals, colours, positions, and font scales live in OsdConfig — never
as bare constants inside drawing calls.
"""

import time
from dataclasses import dataclass
from typing import Tuple

import cv2
import numpy as np


@dataclass(frozen=True)
class RecordingDotConfig:
    """Blinking REC indicator top-left corner."""
    center: Tuple[int, int] = (28, 28)
    radius: int = 7
    active_color: Tuple[int, int, int] = (0, 0, 240)
    inactive_color: Tuple[int, int, int] = (80, 80, 80)
    blink_period_frames: int = 15           # toggles every N frames

    label_origin: Tuple[int, int] = (42, 33)
    label_text: str = "REC"
    label_scale: float = 0.55
    label_color: Tuple[int, int, int] = (255, 255, 255)
    label_thickness: int = 2


@dataclass(frozen=True)
class CameraHeaderConfig:
    """Top-centre camera identification string."""
    text: str = "CAM-02 GROUND CCTV | GATE 4 WEST PERIMETER | ELEV: 2.8M | ANGLE: -16 DEG"
    origin: Tuple[int, int] = (95, 33)
    scale: float = 0.52
    color: Tuple[int, int, int] = (220, 230, 240)
    thickness: int = 1


@dataclass(frozen=True)
class TimestampConfig:
    """Top-right UTC timestamp and optic specification."""
    suffix: str = "UTC  [1080P/30FPS]"
    x_from_right: int = 320            # pixels from the right edge
    y: int = 33
    scale: float = 0.48
    color: Tuple[int, int, int] = (200, 210, 220)
    thickness: int = 1


@dataclass(frozen=True)
class StatusFooterConfig:
    """Bottom-edge sensor status string."""
    text: str = (
        "CCTV FIXED OPTICAL SENSOR | MOTION SENSITIVITY: HIGH | "
        "NIGHT/DAY: DAY AUTO | SIGNAL: 99.8%"
    )
    x: int = 20
    y_from_bottom: int = 18            # pixels above the bottom edge
    scale: float = 0.42
    color: Tuple[int, int, int] = (170, 180, 190)
    thickness: int = 1


@dataclass(frozen=True)
class OsdConfig:
    """Aggregates all OSD overlay tokens."""
    rec: RecordingDotConfig = RecordingDotConfig()
    header: CameraHeaderConfig = CameraHeaderConfig()
    timestamp: TimestampConfig = TimestampConfig()
    footer: StatusFooterConfig = StatusFooterConfig()


class OsdOverlayRenderer:
    """
    Draws a realistic security-camera OSD onto an existing frame.

    Args:
        osd_cfg: Token dataclass; defaults to OsdConfig().
    """

    def __init__(self, osd_cfg: OsdConfig | None = None) -> None:
        self._cfg = osd_cfg or OsdConfig()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def draw(self, frame: np.ndarray, frame_idx: int) -> None:
        """Draw all OSD elements onto *frame* in-place."""
        self._draw_recording_dot(frame, frame_idx)
        self._draw_camera_header(frame)
        self._draw_timestamp(frame)
        self._draw_status_footer(frame)

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _draw_recording_dot(self, frame: np.ndarray, frame_idx: int) -> None:
        rec = self._cfg.rec
        is_active = (frame_idx // rec.blink_period_frames) % 2 == 0
        dot_color = rec.active_color if is_active else rec.inactive_color
        cv2.circle(frame, rec.center, rec.radius, dot_color, -1)
        cv2.putText(
            frame,
            rec.label_text,
            rec.label_origin,
            cv2.FONT_HERSHEY_SIMPLEX,
            rec.label_scale,
            rec.label_color,
            rec.label_thickness,
            cv2.LINE_AA,
        )

    def _draw_camera_header(self, frame: np.ndarray) -> None:
        hdr = self._cfg.header
        cv2.putText(
            frame,
            hdr.text,
            hdr.origin,
            cv2.FONT_HERSHEY_SIMPLEX,
            hdr.scale,
            hdr.color,
            hdr.thickness,
            cv2.LINE_AA,
        )

    def _draw_timestamp(self, frame: np.ndarray) -> None:
        ts = self._cfg.timestamp
        width = frame.shape[1]
        time_str = time.strftime("%Y-%m-%d %H:%M:%S")
        cv2.putText(
            frame,
            f"{time_str} {ts.suffix}",
            (width - ts.x_from_right, ts.y),
            cv2.FONT_HERSHEY_SIMPLEX,
            ts.scale,
            ts.color,
            ts.thickness,
            cv2.LINE_AA,
        )

    def _draw_status_footer(self, frame: np.ndarray) -> None:
        ftr = self._cfg.footer
        height = frame.shape[0]
        cv2.putText(
            frame,
            ftr.text,
            (ftr.x, height - ftr.y_from_bottom),
            cv2.FONT_HERSHEY_SIMPLEX,
            ftr.scale,
            ftr.color,
            ftr.thickness,
            cv2.LINE_AA,
        )
