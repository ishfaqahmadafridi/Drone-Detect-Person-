"""
Tactical Frame Annotator: Rendering HUD overlays, intrusion polygons, gathering lines, and tracking trails.
"""

from typing import List, Dict, Tuple, Optional
import numpy as np
import cv2
from app.core.config import DetectionConfig

class TacticalFrameAnnotator:
    """
    Renders tactical HUD telemetry, intrusion zones, and bounding boxes onto video frames.
    """
    def __init__(self, config: Optional[DetectionConfig] = None):
        self.config = config or DetectionConfig()

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
        h, w = frame.shape[:2]
        annotated = frame.copy()

        # 1. Draw Restricted Zone Polygon
        if zone_polygon is not None and len(zone_polygon) >= 3 and self.config.show_restricted_zones:
            has_intruders = len(intruders) > 0
            zone_color = (0, 0, 255) if has_intruders else (255, 165, 0)
            
            overlay = annotated.copy()
            cv2.fillPoly(overlay, [zone_polygon], color=zone_color)
            cv2.addWeighted(overlay, 0.15 if not has_intruders else 0.28, annotated, 0.85 if not has_intruders else 0.72, 0, annotated)
            cv2.polylines(annotated, [zone_polygon], isClosed=True, color=zone_color, thickness=2, lineType=cv2.LINE_AA)
            
            zx, zy = zone_polygon[0]
            label = "⚠️ RESTRICTED ZONE [BREACH DETECTED]" if has_intruders else "🔒 RESTRICTED PERIMETER"
            cv2.putText(annotated, label, (zx + 5, max(zy - 10, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, zone_color, 2, cv2.LINE_AA)

        # 2. Draw Gathering Proximity Lines
        if self.config.show_proximity_lines and gatherings:
            person_map = {p['id']: p for p in detected_persons}
            for id1, id2, dist in gatherings:
                if id1 in person_map and id2 in person_map:
                    pt1 = person_map[id1]['center']
                    pt2 = person_map[id2]['center']
                    cv2.line(annotated, pt1, pt2, (0, 220, 255), 2, cv2.LINE_AA)
                    mid_pt = ((pt1[0] + pt2[0]) // 2, (pt1[1] + pt2[1]) // 2)
                    cv2.putText(annotated, f"GATHER: {int(dist)}px", mid_pt, cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1, cv2.LINE_AA)

        # 3. Draw Bounding Boxes & Trails
        intruder_ids = {p['id'] for p in intruders}
        clustered_ids_set = set(clustered_ids)
        total_people = len(detected_persons)

        for person in detected_persons:
            pid = person['id']
            x1, y1, x2, y2 = person['bbox']
            conf = person['conf']
            is_intruder = pid in intruder_ids
            is_clustered = pid in clustered_ids_set or (total_people >= self.config.multi_person_threshold)

            if is_intruder:
                box_color = (0, 0, 255)
                tag = f"INTRUDER #{pid} ({conf:.2f})"
            elif is_clustered:
                box_color = (0, 140, 255)
                tag = f"PERSON #{pid} [GATHER]"
            else:
                box_color = (0, 255, 0)
                tag = f"PERSON #{pid} ({conf:.2f})"

            if self.config.show_track_trails and track_history and pid in track_history:
                points = list(track_history[pid])
                for i in range(1, len(points)):
                    alpha = i / len(points)
                    thickness = int(1 + alpha * 2)
                    cv2.line(annotated, points[i - 1], points[i], box_color, thickness, lineType=cv2.LINE_AA)

            if self.config.show_boxes:
                cv2.rectangle(annotated, (x1, y1), (x2, y2), box_color, 2, lineType=cv2.LINE_AA)
                tag_size = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)[0]
                tag_y = max(y1 - 5, tag_size[1] + 5)
                cv2.rectangle(annotated, (x1, tag_y - tag_size[1] - 4), (x1 + tag_size[0] + 8, tag_y + 4), box_color, -1)
                cv2.putText(annotated, tag, (x1 + 4, tag_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

                fx, fy = person['foot']
                cv2.circle(annotated, (fx, fy), 4, box_color, -1, lineType=cv2.LINE_AA)

        # 4. Draw HUD Banner
        if self.config.show_hud:
            hud_h = 60
            hud_overlay = annotated.copy()
            if threat_level == "INTRUSION":
                hud_bg = (0, 0, 180)
            elif threat_level == "MULTI_PERSON":
                hud_bg = (0, 120, 200)
            elif threat_level == "MONITORING":
                hud_bg = (100, 80, 0)
            else:
                hud_bg = (30, 30, 30)

            cv2.rectangle(hud_overlay, (0, 0), (w, hud_h), hud_bg, -1)
            cv2.addWeighted(hud_overlay, 0.85, annotated, 0.15, 0, annotated)
            cv2.line(annotated, (0, hud_h), (w, hud_h), (255, 255, 255), 1)

            status_title = f"DRONE AERIAL MONITOR | {alert_msg}"
            cv2.putText(annotated, status_title, (15, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA)
            sub_info = f"PEOPLE: {total_people} | INTRUDERS: {len(intruders)} | GATHERINGS: {len(gatherings)} | FPS: {fps:.1f} | THRESHOLD: >= {self.config.multi_person_threshold}"
            cv2.putText(annotated, sub_info, (15, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 240, 255), 1, cv2.LINE_AA)

        return annotated
