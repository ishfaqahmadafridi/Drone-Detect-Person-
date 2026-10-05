"""
HUD Annotator Stage: Renders visual tactical bounding boxes, zones, and status banners.
"""

from typing import List, Dict, Any, Set
import numpy as np


class PipelineHudAnnotator:
    """
    Renders high-visibility bounding boxes, tracking vectors, restricted zone, and status banners.
    """

    @staticmethod
    def render(
        detector,
        zone_monitor,
        frame: np.ndarray,
        detected_persons: List[Dict],
        intruders: List[Dict],
        threat_level: str,
        alert_msg: str
    ) -> np.ndarray:
        """
        Draws visual annotations onto the video frame via detector.draw_annotations.
        """
        return detector.draw_annotations(
            frame=frame,
            detected_persons=detected_persons,
            intruders=intruders,
            zone_polygon=zone_monitor.pixel_polygon,
            threat_level=threat_level,
            alert_msg=alert_msg
        )
