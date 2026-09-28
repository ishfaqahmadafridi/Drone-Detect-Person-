"""
Proximity Overlay: Renders gathering connector vectors and distance chips.
"""

from typing import List, Dict, Tuple
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.services.annotation.theme import TacticalAnnotationTheme


def draw_proximity_lines(
    annotated: np.ndarray,
    detected_persons: List[Dict],
    gatherings: List[Tuple[int, int, float]],
    theme: TacticalAnnotationTheme
):
    """
    Renders dynamic connector lines between clustered individuals in a gathering.
    """
    if cv2 is None or not gatherings:
        return

    person_map = {p['id']: p for p in detected_persons}
    for id1, id2, dist in gatherings:
        if id1 in person_map and id2 in person_map:
            pt1 = person_map[id1]['center']
            pt2 = person_map[id2]['center']
            cv2.line(annotated, pt1, pt2, theme.COLOR_PROXIMITY_LINE, 2, theme.LINE_TYPE)
            mid_pt = ((pt1[0] + pt2[0]) // 2, (pt1[1] + pt2[1]) // 2)
            cv2.putText(
                annotated,
                f"GATHER: {int(dist)}px",
                mid_pt,
                theme.FONT_FACE,
                theme.FONT_SCALE_SUB,
                theme.COLOR_PROXIMITY_LINE,
                1,
                theme.LINE_TYPE
            )
