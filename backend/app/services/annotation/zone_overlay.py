"""
Restricted Zone Overlay: Renders semi-transparent polygons and boundary alerts.
"""

import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.services.annotation.theme import TacticalAnnotationTheme


def draw_zone_polygon(
    annotated: np.ndarray,
    zone_polygon: np.ndarray,
    has_intruders: bool,
    theme: TacticalAnnotationTheme
):
    """
    Renders the restricted zone geofence with semi-transparent fill and perimeter tags.
    """
    # Restricted zone is removed from the project
    return

    zone_color = theme.COLOR_ZONE_BREACH if has_intruders else theme.COLOR_ZONE_SECURE
    alpha = theme.ALPHA_ZONE_BREACH if has_intruders else theme.ALPHA_ZONE_NORMAL

    overlay = annotated.copy()
    cv2.fillPoly(overlay, [zone_polygon], color=zone_color)
    cv2.addWeighted(overlay, alpha, annotated, 1.0 - alpha, 0, annotated)
    cv2.polylines(
        annotated,
        [zone_polygon],
        isClosed=True,
        color=zone_color,
        thickness=theme.BOX_BORDER_THICKNESS,
        lineType=theme.LINE_TYPE
    )

    zx, zy = zone_polygon[0]
    label = "[RESTRICTED ZONE BREACH]" if has_intruders else "[RESTRICTED PERIMETER]"
    cv2.putText(
        annotated,
        label,
        (zx + 5, max(zy - 10, 20)),
        theme.FONT_FACE,
        theme.FONT_SCALE_BODY,
        zone_color,
        2,
        theme.LINE_TYPE
    )
