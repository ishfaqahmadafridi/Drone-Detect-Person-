"""
Tactical HUD Banner Overlay: Renders system status, threat banners, and telemetry stats.
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
    Renders top tactical banner bar displaying telemetry and operational alert status.
    """
    if cv2 is None or annotated is None:
        return

    h, w = annotated.shape[:2]
    hud_h = theme.HUD_HEIGHT_PX

    if threat_level == "INTRUSION":
        hud_bg = theme.HUD_BG_INTRUSION
    elif threat_level == "MULTI_PERSON":
        hud_bg = theme.HUD_BG_MULTI_PERSON
    elif threat_level == "MONITORING":
        hud_bg = theme.HUD_BG_MONITORING
    else:
        hud_bg = theme.HUD_BG_CLEAR

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
    cv2.line(annotated, (0, hud_h), (w, hud_h), theme.COLOR_TEXT_WHITE, 1)

    status_title = f"DRONE AERIAL MONITOR | {alert_msg}"
    cv2.putText(
        annotated,
        status_title,
        (15, 26),
        theme.FONT_FACE,
        theme.FONT_SCALE_TITLE,
        theme.COLOR_TEXT_WHITE,
        2,
        theme.LINE_TYPE
    )
    sub_info = (
        f"PEOPLE: {total_people} | "
        f"GATHERINGS: {gathering_count} | "
        f"FPS: {fps:.1f} | "
        f"THRESHOLD: >= {config.multi_person_threshold}"
    )
    cv2.putText(
        annotated,
        sub_info,
        (15, 48),
        theme.FONT_FACE,
        theme.FONT_SCALE_SUB,
        theme.COLOR_TEXT_CYAN,
        1,
        theme.LINE_TYPE
    )
