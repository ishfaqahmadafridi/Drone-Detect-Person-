"""
Tactical Frame Annotator: Facade re-exporting from app.services.annotation_service.
Maintains backward compatibility with app.engine imports.
"""

from app.services.annotation_service import TacticalAnnotationTheme, TacticalFrameAnnotator

__all__ = ["TacticalAnnotationTheme", "TacticalFrameAnnotator"]
