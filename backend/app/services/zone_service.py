"""
Zone Service: Ray-Casting Polygon Intrusion & Gathering Proximity Analyzer.
"""

from typing import List, Tuple, Dict
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

class ZoneMonitorService:
    def __init__(
        self,
        frame_width: int = 1280,
        frame_height: int = 720,
        zone_polygon_normalized: List[Tuple[float, float]] = None
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
        if not self.zone_polygon_normalized or len(self.zone_polygon_normalized) < 3:
            self.pixel_polygon = np.array([], dtype=np.int32)
            return

        pts = []
        for nx, ny in self.zone_polygon_normalized:
            px = int(nx * self.width)
            py = int(ny * self.height)
            pts.append([px, py])
        self.pixel_polygon = np.array(pts, dtype=np.int32)

    def is_point_inside(self, point: Tuple[int, int]) -> bool:
        if self.pixel_polygon is None or len(self.pixel_polygon) < 3:
            return False
        if cv2 is not None:
            dist = cv2.pointPolygonTest(self.pixel_polygon, (float(point[0]), float(point[1])), measureDist=False)
            return dist >= 0
        
        # Pure-Python Ray-Casting algorithm fallback
        x, y = float(point[0]), float(point[1])
        inside = False
        poly = self.pixel_polygon
        n = len(poly)
        p1x, p1y = poly[0]
        for i in range(n + 1):
            p2x, p2y = poly[i % n]
            if y > min(p1y, p2y):
                if y <= max(p1y, p2y):
                    if x <= max(p1x, p2x):
                        if p1y != p2y:
                            xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                        if p1x == p2x or x <= xinters:
                            inside = not inside
            p1x, p1y = p2x, p2y
        return inside

    def check_intrusions(self, detected_persons: List[Dict]) -> List[Dict]:
        intruders: List[Dict] = []
        if self.pixel_polygon is None or len(self.pixel_polygon) < 3:
            return intruders

        for person in detected_persons:
            foot_pt = person['foot']
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
        gatherings: List[Tuple[int, int, float]] = []
        clustered_ids: List[int] = []
        n = len(detected_persons)
        if n < 2:
            return gatherings, clustered_ids

        for i in range(n):
            for j in range(i + 1, n):
                p1 = detected_persons[i]
                p2 = detected_persons[j]
                
                c1 = p1['center']
                c2 = p2['center']
                dist = float(np.hypot(c1[0] - c2[0], c1[1] - c2[1]))
                
                if dist <= proximity_threshold_px:
                    gatherings.append((p1['id'], p2['id'], dist))
                    if p1['id'] not in clustered_ids:
                        clustered_ids.append(p1['id'])
                    if p2['id'] not in clustered_ids:
                        clustered_ids.append(p2['id'])

        return gatherings, clustered_ids
