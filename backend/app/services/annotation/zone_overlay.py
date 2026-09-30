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
