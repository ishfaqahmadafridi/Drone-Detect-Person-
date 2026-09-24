"""
Zone and Proximity Monitoring module.
Handles polygonal/rectangular restricted zones (ROI), intrusion detection,
distance calculation between detected persons, and gathering cluster analysis.
"""

from typing import List, Dict, Tuple, Optional
import numpy as np
import cv2

class ZoneMonitor:
    def __init__(self, frame_width: int, frame_height: int, normalized_polygon: Optional[List[Tuple[float, float]]] = None):
        self.frame_width = frame_width
        self.frame_height = frame_height
        
        # Default polygon if none provided (center 50% box)
        if not normalized_polygon:
            normalized_polygon = [
                (0.20, 0.20),
                (0.80, 0.20),
                (0.80, 0.80),
                (0.20, 0.80),
            ]
        
        self.normalized_polygon = normalized_polygon
        self.pixel_polygon = self._convert_to_pixel_polygon(normalized_polygon)
        
        # Dwell time tracking: {track_id: enter_timestamp}
        self.track_zone_entry: Dict[int, float] = {}

    def update_resolution(self, width: int, height: int):
        """Update resolution and recompute pixel polygon."""
        if width != self.frame_width or height != self.frame_height:
            self.frame_width = width
            self.frame_height = height
            self.pixel_polygon = self._convert_to_pixel_polygon(self.normalized_polygon)

    def _convert_to_pixel_polygon(self, norm_poly: List[Tuple[float, float]]) -> np.ndarray:
        pts = [[int(x * self.frame_width), int(y * self.frame_height)] for x, y in norm_poly]
        return np.array(pts, dtype=np.int32)

    def set_custom_polygon(self, norm_poly: List[Tuple[float, float]]):
        self.normalized_polygon = norm_poly
        self.pixel_polygon = self._convert_to_pixel_polygon(norm_poly)

    def is_point_in_zone(self, point: Tuple[float, float]) -> bool:
        """Check if an (x, y) point is inside the restricted polygon zone."""
        if self.pixel_polygon is None or len(self.pixel_polygon) < 3:
            return False
        result = cv2.pointPolygonTest(self.pixel_polygon, (float(point[0]), float(point[1])), False)
        return result >= 0

    def check_intrusions(self, detected_persons: List[Dict]) -> List[Dict]:
        """
        Check which detected persons are inside the restricted zone.
        Each person dict has: {'id': int, 'bbox': [x1, y1, x2, y2], 'conf': float, 'center': (cx, cy), 'foot': (fx, fy)}
        Drone cameras typically use feet/ground contact or bbox center for ground position.
        """
        intruders = []
        for person in detected_persons:
            # For aerial drone perspective, bottom-center (foot) or center represents ground location
            fx, fy = person.get('foot', person['center'])
            if self.is_point_in_zone((fx, fy)):
                person_copy = dict(person)
                person_copy['is_intruder'] = True
                intruders.append(person_copy)
        return intruders

    def compute_gatherings(self, detected_persons: List[Dict], proximity_threshold_px: float = 120.0) -> Tuple[List[Tuple[int, int, float]], List[int]]:
        """
        Computes pairwise distances between all persons.
        Returns:
            - close_pairs: list of (id_a, id_b, distance_px) for pairs closer than threshold
            - clustered_ids: set/list of person IDs that are part of a 2+ person gathering
        """
        close_pairs = []
        clustered_ids_set = set()
        n = len(detected_persons)

        if n < 2:
            return [], []

        for i in range(n):
            p1 = detected_persons[i]
            c1 = p1['center']
            for j in range(i + 1, n):
                p2 = detected_persons[j]
                c2 = p2['center']
                dist = np.hypot(c1[0] - c2[0], c1[1] - c2[1])
                if dist <= proximity_threshold_px:
                    id1 = p1.get('id', i)
                    id2 = p2.get('id', j)
                    close_pairs.append((id1, id2, float(dist)))
                    clustered_ids_set.add(id1)
                    clustered_ids_set.add(id2)

        return close_pairs, list(clustered_ids_set)
