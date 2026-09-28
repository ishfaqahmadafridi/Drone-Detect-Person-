"""
Tactical Annotation Subpackage: Video HUD overlays, polygons, vectors, and bounding boxes.
"""

from app.services.annotation.theme import TacticalAnnotationTheme
from app.services.annotation.annotator import TacticalFrameAnnotator
from app.services.annotation.zone_overlay import draw_zone_polygon
from app.services.annotation.proximity_overlay import draw_proximity_lines
from app.services.annotation.target_overlay import draw_detections_and_trails
from app.services.annotation.hud_overlay import draw_hud_banner

__all__ = [
    "TacticalAnnotationTheme",
    "TacticalFrameAnnotator",
    "draw_zone_polygon",
    "draw_proximity_lines",
    "draw_detections_and_trails",
    "draw_hud_banner"
]
