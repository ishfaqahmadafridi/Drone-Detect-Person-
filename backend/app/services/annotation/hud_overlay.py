"""
Tactical HUD Banner Overlay: Renders system status, threat banners, and telemetry stats.
Enterprise-grade unobtrusive on-screen display (OSD) styling.
"""

import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.core.config import DetectionConfig
from app.services.annotation.theme import TacticalAnnotationTheme


def draw_hud_banner(
    annotated: np.ndarray,
    threat_level: str,
    alert_msg: str,
    total_people: int,
    intruder_count: int,
    gathering_count: int,
    fps: float,
    config: DetectionConfig,
    theme: TacticalAnnotationTheme
):
    """
    Renders a slim, professional on-screen telemetry bar across the top of the video feed.
    """
    if cv2 is None or annotated is None:
        return

    h, w = annotated.shape[:2]
    hud_h = theme.HUD_HEIGHT_PX

    is_manual = getattr(config, "tracking_mode", "auto") == "manual"
    selected_count = len(getattr(config, "selected_target_ids", []))

    if is_manual:
        hud_bg = (18, 24, 32)
        status_title = f"Manual Tracking Active  |  {alert_msg}"
        telemetry_info = f"Locked: {selected_count}  •  Visible: {total_people}  •  {fps:.1f} FPS"
    else:
        if threat_level == "INTRUSION":
            hud_bg = (20, 20, 50)
        elif threat_level == "MULTI_PERSON":
            hud_bg = (20, 35, 55)
        else:
            hud_bg = (14, 18, 24)

        status_title = f"Surveillance Feed  |  {alert_msg}"
        telemetry_info = f"Tracks: {total_people}  •  Clusters: {gathering_count}  •  {fps:.1f} FPS"

    hud_overlay = annotated.copy()
    cv2.rectangle(hud_overlay, (0, 0), (w, hud_h), hud_bg, -1)
    cv2.addWeighted(
        hud_overlay,
        theme.ALPHA_HUD_OVERLAY,
        annotated,
        1.0 - theme.ALPHA_HUD_OVERLAY,
        0,
        annotated
    )
    cv2.line(annotated, (0, hud_h), (w, hud_h), (50, 60, 75), 1)

    # Left: Feed & Status
    cv2.putText(
        annotated,
        status_title,
        (12, 23),
        theme.FONT_FACE,
        theme.FONT_SCALE_BODY,
        theme.COLOR_TEXT_WHITE,
        1,
        theme.LINE_TYPE
    )

    # Right: Telemetry summary
    text_size = cv2.getTextSize(telemetry_info, theme.FONT_FACE, theme.FONT_SCALE_SUB, 1)[0]
    cv2.putText(
        annotated,
        telemetry_info,
        (max(12, w - text_size[0] - 14), 23),
        theme.FONT_FACE,
        theme.FONT_SCALE_SUB,
        theme.COLOR_TEXT_MUTED,
        1,
        theme.LINE_TYPE
    )
