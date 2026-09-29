"""
Zone Monitor Service: Coordinates restricted zone intrusion detection and gatherings.
"""

from typing import List, Tuple, Dict, Optional
import numpy as np

from app.services.zone.geometry import normalized_to_pixel_polygon, is_point_in_polygon
from app.services.zone.gathering import compute_proximity_gatherings


class ZoneMonitorService:
    """
    Monitors polygonal restricted geofence zones and multi-person clustering.
    """
    def __init__(
        self,
        frame_width: int = 1280,
        frame_height: int = 720,
        zone_polygon_normalized: Optional[List[Tuple[float, float]]] = None
    ):
        self.width = frame_width
        self.height = frame_height
        self.zone_polygon_normalized = zone_polygon_normalized or [
            (0.25, 0.25),
            (0.75, 0.25),
            (0.75, 0.75),
            (0.25, 0.75),
        ]
        self.pixel_polygon: np.ndarray = np.array([], dtype=np.int32)
        self._recalculate_pixel_polygon()

    def update_resolution(self, width: int, height: int):
        if self.width != width or self.height != height:
            self.width = width
            self.height = height
            self._recalculate_pixel_polygon()

    def _recalculate_pixel_polygon(self):
        self.pixel_polygon = normalized_to_pixel_polygon(
            self.zone_polygon_normalized,
            self.width,
            self.height
        )

    def is_point_inside(self, point: Tuple[int, int]) -> bool:
        return is_point_in_polygon(point, self.pixel_polygon)

    def check_intrusions(self, detected_persons: List[Dict]) -> List[Dict]:
        intruders: List[Dict] = []
        if self.pixel_polygon is None or len(self.pixel_polygon) < 3:
            return intruders

        for person in detected_persons:
            bbox = person.get('bbox', [0, 0, 0, 0])
            foot_pt = person.get('foot', (int((bbox[0] + bbox[2]) / 2), int(bbox[3])))
            if self.is_point_inside(foot_pt):
                person['is_intruder'] = True
                intruders.append(person)
            else:
                person['is_intruder'] = False

        return intruders

    def compute_gatherings(
        self,
        detected_persons: List[Dict],
        proximity_threshold_px: int = 120
    ) -> Tuple[List[Tuple[int, int, float]], List[int]]:
        return compute_proximity_gatherings(detected_persons, proximity_threshold_px)
