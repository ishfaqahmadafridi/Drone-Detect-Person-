"""
Tactical Annotation Theme Tokens & Color Palette.
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
    Design tokens and BGR color scheme for tactical computer vision overlays.
    """
    # Target Status Colors (BGR)
    COLOR_INTRUDER: Tuple[int, int, int] = (0, 0, 255)       # Tactical Red
    COLOR_GATHERING: Tuple[int, int, int] = (0, 140, 255)    # Caution Amber
    COLOR_SAFE: Tuple[int, int, int] = (0, 255, 0)          # Nominal Green
    COLOR_ZONE_SECURE: Tuple[int, int, int] = (255, 165, 0) # Normal Cyan/Orange
    COLOR_ZONE_BREACH: Tuple[int, int, int] = (0, 0, 255)   # Breach Red
    COLOR_PROXIMITY_LINE: Tuple[int, int, int] = (0, 220, 255) # Yellow/Cyan
    COLOR_TEXT_WHITE: Tuple[int, int, int] = (255, 255, 255)
    COLOR_TEXT_BLACK: Tuple[int, int, int] = (0, 0, 0)
    COLOR_TEXT_CYAN: Tuple[int, int, int] = (200, 240, 255)

    # HUD Backgrounds by Threat Level
    HUD_BG_INTRUSION: Tuple[int, int, int] = (0, 0, 180)
    HUD_BG_MULTI_PERSON: Tuple[int, int, int] = (0, 120, 200)
    HUD_BG_MONITORING: Tuple[int, int, int] = (100, 80, 0)
    HUD_BG_CLEAR: Tuple[int, int, int] = (30, 30, 30)

    # Typography & Geometric Scales
    FONT_FACE: int = cv2.FONT_HERSHEY_SIMPLEX if cv2 is not None else 0
    FONT_SCALE_TITLE: float = 0.65
    FONT_SCALE_BODY: float = 0.50
    FONT_SCALE_SUB: float = 0.45
    LINE_TYPE: int = cv2.LINE_AA if cv2 is not None else 16
    HUD_HEIGHT_PX: int = 60
    ALPHA_ZONE_NORMAL: float = 0.15
    ALPHA_ZONE_BREACH: float = 0.28
    ALPHA_HUD_OVERLAY: float = 0.85
    BOX_BORDER_THICKNESS: int = 2
    FOOT_POINT_RADIUS: int = 4
