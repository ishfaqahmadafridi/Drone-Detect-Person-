"""
Tactical Annotation Theme Tokens & Color Palette.
Enterprise defense and surveillance computer vision styling.
"""

from dataclasses import dataclass
from typing import Tuple

try:
    import cv2
except ImportError:
    cv2 = None


@dataclass
class TacticalAnnotationTheme:
    """
    Design tokens and BGR color scheme for enterprise computer vision overlays.
    Calm, desaturated, high-clarity surveillance styling.
    """
    # Target Status Colors (BGR) - Muted & Professional
    COLOR_INTRUDER: Tuple[int, int, int] = (45, 50, 215)       # Controlled Crimson
    COLOR_GATHERING: Tuple[int, int, int] = (30, 140, 220)    # Warm Amber
    COLOR_SAFE: Tuple[int, int, int] = (85, 175, 85)          # Nominal Muted Sage Green
    COLOR_ZONE_SECURE: Tuple[int, int, int] = (180, 120, 40) # Slate Blue
    COLOR_ZONE_BREACH: Tuple[int, int, int] = (45, 50, 215)   # Breach Red
    COLOR_PROXIMITY_LINE: Tuple[int, int, int] = (40, 150, 220) # Muted Amber Vector
    COLOR_TEXT_WHITE: Tuple[int, int, int] = (240, 245, 250)
    COLOR_TEXT_BLACK: Tuple[int, int, int] = (15, 20, 25)
    COLOR_TEXT_MUTED: Tuple[int, int, int] = (180, 195, 210)

    # HUD Backgrounds by Threat Level (Clean & Low Opacity)
    HUD_BG_INTRUSION: Tuple[int, int, int] = (20, 20, 80)
    HUD_BG_MULTI_PERSON: Tuple[int, int, int] = (20, 50, 85)
    HUD_BG_MONITORING: Tuple[int, int, int] = (35, 40, 50)
    HUD_BG_CLEAR: Tuple[int, int, int] = (18, 22, 28)

    # Typography & Geometric Scales
    FONT_FACE: int = cv2.FONT_HERSHEY_SIMPLEX if cv2 is not None else 0
    FONT_SCALE_TITLE: float = 0.50
    FONT_SCALE_BODY: float = 0.40
    FONT_SCALE_SUB: float = 0.38
    LINE_TYPE: int = cv2.LINE_AA if cv2 is not None else 16
    HUD_HEIGHT_PX: int = 36
    ALPHA_ZONE_NORMAL: float = 0.12
    ALPHA_ZONE_BREACH: float = 0.22
    ALPHA_HUD_OVERLAY: float = 0.70
    BOX_BORDER_THICKNESS: int = 1
    FOOT_POINT_RADIUS: int = 3
