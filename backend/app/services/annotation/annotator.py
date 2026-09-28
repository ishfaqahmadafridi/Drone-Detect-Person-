"""
Tactical Frame Annotator: High-level visual frame rendering coordinator.
"""

from typing import List, Dict, Tuple, Optional
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.core.config import DetectionConfig
from app.services.annotation.theme import TacticalAnnotationTheme
from app.services.annotation.zone_overlay import draw_zone_polygon
from app.services.annotation.proximity_overlay import draw_proximity_lines
from app.services.annotation.target_overlay import draw_detections_and_trails
from app.services.annotation.hud_overlay import draw_hud_banner


class TacticalFrameAnnotator:
    """
    Renders tactical HUD telemetry, intrusion zones, and bounding boxes onto video frames.
    """
    def __init__(
        self,
        config: Optional[DetectionConfig] = None,
        theme: Optional[TacticalAnnotationTheme] = None
    ):
        self.config = config or DetectionConfig()
        self.theme = theme or TacticalAnnotationTheme()

    def draw_annotations(
        self,
        frame: np.ndarray,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Tuple[int, int, float]],
        clustered_ids: List[int],
        zone_polygon: Optional[np.ndarray],
        threat_level: str,
        alert_msg: str,
        fps: float = 0.0,
        track_history: Optional[Dict[int, List[Tuple[int, int]]]] = None
    ) -> np.ndarray:
        if cv2 is None or frame is None:
            return frame

        annotated = frame.copy()

        # 1. Restricted Zone Polygon
        if zone_polygon is not None and len(zone_polygon) >= 3 and self.config.show_restricted_zones:
            draw_zone_polygon(
                annotated=annotated,
                zone_polygon=zone_polygon,
                has_intruders=len(intruders) > 0,
                theme=self.theme
            )

        # 2. Gathering Proximity Connectors
        if self.config.show_proximity_lines and gatherings:
            draw_proximity_lines(
                annotated=annotated,
                detected_persons=detected_persons,
                gatherings=gatherings,
                theme=self.theme
            )

        # 3. Target Bounding Boxes & Trails
        draw_detections_and_trails(
            annotated=annotated,
            detected_persons=detected_persons,
            intruders=intruders,
            clustered_ids=clustered_ids,
            track_history=track_history,
            config=self.config,
            theme=self.theme
        )

        # 4. Tactical Top HUD Banner
        if self.config.show_hud:
            draw_hud_banner(
                annotated=annotated,
                threat_level=threat_level,
                alert_msg=alert_msg,
                total_people=len(detected_persons),
                intruder_count=len(intruders),
                gathering_count=len(gatherings),
                fps=fps,
                config=self.config,
                theme=self.theme
            )

        return annotated
