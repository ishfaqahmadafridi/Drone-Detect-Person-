"""
Annotation Service Facade: Re-exports from app.services.annotation.
Preserves backward compatibility with legacy scripts, engines, and tests.
"""

from app.services.annotation import (
    TacticalAnnotationTheme,
    TacticalFrameAnnotator,
    draw_zone_polygon,
    draw_detections_and_trails,
    draw_hud_banner
)

__all__ = [
    "TacticalAnnotationTheme",
    "TacticalFrameAnnotator",
    "draw_zone_polygon",
    "draw_detections_and_trails",
    "draw_hud_banner"
]
