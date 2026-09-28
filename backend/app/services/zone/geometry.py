"""
Zone Geometry: Point-in-Polygon & Ray-Casting Math for intrusion detection.
"""

from typing import Tuple, List
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None


def normalized_to_pixel_polygon(
    normalized_coords: List[Tuple[float, float]],
    width: int,
    height: int
) -> np.ndarray:
    """
    Converts normalized (0.0 to 1.0) polygon coordinates to pixel space coordinates.
    """
    if not normalized_coords or len(normalized_coords) < 3:
        return np.array([], dtype=np.int32)

    pts = []
    for nx, ny in normalized_coords:
        px = int(nx * width)
        py = int(ny * height)
        pts.append([px, py])
    return np.array(pts, dtype=np.int32)


def is_point_in_polygon(point: Tuple[int, int], polygon: np.ndarray) -> bool:
    """
    Evaluates whether a (x, y) point lies inside a 2D polygon.
    Uses cv2.pointPolygonTest when available, falling back to pure-Python ray casting.
    """
    if polygon is None or len(polygon) < 3:
        return False

    if cv2 is not None:
        dist = cv2.pointPolygonTest(polygon, (float(point[0]), float(point[1])), measureDist=False)
        return dist >= 0

    # Pure-Python Ray-Casting algorithm fallback
    x, y = float(point[0]), float(point[1])
    inside = False
    n = len(polygon)
    p1x, p1y = polygon[0]
    for i in range(n + 1):
        p2x, p2y = polygon[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside
