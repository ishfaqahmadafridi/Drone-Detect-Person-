"""Mark sampled boxes as delayed; never present them as current-frame detection."""
import cv2
from app.core.config import STREAM_BOX_MAX_AGE_SECONDS
from app.services.annotation.theme import TacticalAnnotationTheme
from app.services.annotation.annotator import TacticalFrameAnnotator
from app.services.zone.geometry import normalized_to_pixel_polygon


def draw_preview_boxes(frame, overlay, identity, now, config):
    theme = TacticalAnnotationTheme()
    payload = {}
    age = None
    if overlay is not None and overlay[0] == identity:
        age = max(0, now - overlay[1])
        if age <= STREAM_BOX_MAX_AGE_SECONDS:
            payload = overlay[2]
    detections = payload.get("detections", []) + payload.get("untracked_detections", [])
    intruders = [person for person in detections if person.get("is_intruder")]
    height, width = frame.shape[:2]
    polygon = normalized_to_pixel_polygon(config.default_zone_normalized, width, height)
    annotated = TacticalFrameAnnotator(config, theme).draw_annotations(
        frame, detections, intruders, polygon,
        payload.get("threat_level", "CLEAR"), payload.get("alert_msg", "Waiting for detection"),
        fps=payload.get("fps", 0))
    if config.show_boxes and age is not None and payload:
        cv2.putText(annotated, f"Sampled detections: {age:.1f}s ago",
                    (12, theme.HUD_HEIGHT_PX + 20), theme.FONT_FACE,
                    theme.FONT_SCALE_TITLE, theme.COLOR_TEXT_MUTED, 1, theme.LINE_TYPE)
    return annotated
