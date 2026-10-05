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
    track_history: Optional[Dict[int, List[Tuple[int, int]]]],
    config: DetectionConfig,
    theme: TacticalAnnotationTheme
):
    """
    Renders bounding boxes, tracking trails, and ground foot-points.
    """
    if cv2 is None or not detected_persons:
        return

    h, w = annotated.shape[:2]
    is_manual = getattr(config, "tracking_mode", "auto") == "manual"
    selected_set = set(getattr(config, "selected_target_ids", []))

    for person in detected_persons:
        pid = person.get('id', -1)
        is_selected = is_manual and pid in selected_set

        x1, y1, x2, y2 = person['bbox']
        conf = person['conf']

        box_color = theme.COLOR_LOCKED if is_selected else theme.COLOR_SAFE
        tag = (f"Person #{pid} {conf:.0%}" if pid is not None else f"Person {conf:.0%} (pending ID)") + (" SELECTED" if is_selected else "")

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
            tag_y = max(y1 - 6, tag_size[1] + 6)
            chip_x1 = max(0, x1)
            chip_y1 = max(0, tag_y - tag_size[1] - 4)
            chip_x2 = min(w - 1, x1 + tag_size[0] + 12)
            chip_y2 = min(h - 1, tag_y + 4)

            # Draw semi-transparent dark backdrop to preserve visibility of targets
            chip_roi = annotated[chip_y1:chip_y2, chip_x1:chip_x2]
            if chip_roi.size > 0:
                dark_bg = np.full_like(chip_roi, (12, 16, 22))
                cv2.addWeighted(dark_bg, 0.85, chip_roi, 0.15, 0, chip_roi)
                # Left accent status color
                cv2.rectangle(annotated, (chip_x1, chip_y1), (min(chip_x1 + 3, chip_x2), chip_y2), box_color, -1)
                # Subtle border around chip
                cv2.rectangle(annotated, (chip_x1, chip_y1), (chip_x2, chip_y2), box_color, 1, lineType=theme.LINE_TYPE)

            cv2.putText(
                annotated,
                tag,
                (chip_x1 + 7, tag_y),
                theme.FONT_FACE,
                theme.FONT_SCALE_BODY,
                theme.COLOR_TEXT_WHITE,
                1,
                theme.LINE_TYPE
            )
