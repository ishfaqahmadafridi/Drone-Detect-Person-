"""
Target Overlay: Renders bounding boxes, classification badges, and motion trajectories.
"""

from typing import List, Dict, Optional, Tuple
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.core.config import DetectionConfig
from app.services.annotation.theme import TacticalAnnotationTheme


def draw_detections_and_trails(
    annotated: np.ndarray,
    detected_persons: List[Dict],
    intruders: List[Dict],
    clustered_ids: List[int],
    track_history: Optional[Dict[int, List[Tuple[int, int]]]],
    config: DetectionConfig,
    theme: TacticalAnnotationTheme
):
    """
    Renders bounding boxes, tracking trails, and ground foot-points.
    """
    if cv2 is None or not detected_persons:
        return

    intruder_ids = {p['id'] for p in intruders}
    clustered_ids_set = set(clustered_ids)
    total_people = len(detected_persons)

    for person in detected_persons:
        pid = person['id']
        x1, y1, x2, y2 = person['bbox']
        conf = person['conf']
        is_intruder = pid in intruder_ids
        is_clustered = pid in clustered_ids_set or (total_people >= config.multi_person_threshold)

        if is_intruder:
            box_color = theme.COLOR_INTRUDER
            tag = f"INTRUDER #{pid} ({conf:.2f})"
        elif is_clustered:
            box_color = theme.COLOR_GATHERING
            tag = f"PERSON #{pid} [GATHER]"
        else:
            box_color = theme.COLOR_SAFE
            tag = f"PERSON #{pid} ({conf:.2f})"

        # Render motion trails
        if config.show_track_trails and track_history and pid in track_history:
            points = list(track_history[pid])
            for i in range(1, len(points)):
                alpha = i / len(points)
                thickness = int(1 + alpha * 2)
                cv2.line(annotated, points[i - 1], points[i], box_color, thickness, lineType=theme.LINE_TYPE)

        # Render bounding box and label chip
        if config.show_boxes:
            cv2.rectangle(
                annotated,
                (x1, y1),
                (x2, y2),
                box_color,
                theme.BOX_BORDER_THICKNESS,
                lineType=theme.LINE_TYPE
            )
            tag_size = cv2.getTextSize(tag, theme.FONT_FACE, theme.FONT_SCALE_BODY, 1)[0]
            tag_y = max(y1 - 5, tag_size[1] + 5)
            cv2.rectangle(
                annotated,
                (x1, tag_y - tag_size[1] - 4),
                (x1 + tag_size[0] + 8, tag_y + 4),
                box_color,
                -1
            )
            cv2.putText(
                annotated,
                tag,
                (x1 + 4, tag_y),
                theme.FONT_FACE,
                theme.FONT_SCALE_BODY,
                theme.COLOR_TEXT_BLACK,
                1,
                theme.LINE_TYPE
            )

            fx, fy = person['foot']
            cv2.circle(
                annotated,
                (fx, fy),
                theme.FOOT_POINT_RADIUS,
                box_color,
                -1,
                lineType=theme.LINE_TYPE
            )
