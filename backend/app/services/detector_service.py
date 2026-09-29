"""
Detector Service: VisDrone YOLO11n / MOT20 YOLO26s person detection and tracking.
"""

import time
from pathlib import Path
from typing import List, Dict, Tuple, Optional
from collections import defaultdict, deque
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.core.config import DetectionConfig
from app.services.inference_service import inference_service, MODELS_DIR
from app.services.tracking_service import tracking_service

class DronePersonDetectorService:
    def __init__(self, config: Optional[DetectionConfig] = None):
        self.config = config or DetectionConfig()
        self.active_view = self.config.view_mode
        
        self._apply_profile(preserve_overrides=True)
        if self.config.model_path_override:
            # CLI overrides are explicit local files, never automatic model substitutions.
            path = Path(self.config.model_path_override)
            if not path.is_file():
                path = MODELS_DIR / path
            if not path.is_file():
                raise FileNotFoundError(f"Custom model does not exist: {self.config.model_path_override}")
            from ultralytics import YOLO
            self.model = YOLO(str(path))
            self.config.model_name = path.name
        else:
            self.model = inference_service.get_model(self.active_view)
        inference_service.set_active_view(self.active_view)
        
        self.last_fps_time = time.time()
        self.fps = 0.0
        self.frame_count = 0
        self.track_history = defaultdict(lambda: deque(maxlen=30))

    def _apply_profile(self, preserve_overrides: bool = False):
        profile = inference_service.get_profile(self.active_view)
        self.config.view_mode = self.active_view
        self.config.model_name = profile["filename"]
        self.config.target_classes = list(profile["person_classes"])
        fields = (("confidence_threshold", "confidence"), ("iou_threshold", "iou"), ("img_size", "recommended_imgsz"))
        for field, key in fields:
            if not preserve_overrides or getattr(self.config, field) is None:
                setattr(self.config, field, profile[key])

    @property
    def engine(self) -> str:
        return inference_service.get_profile(self.active_view)["engine"]

    def reset_tracking(self):
        inference_service.reset_tracking()
        tracking_service.reset()
        self.track_history.clear()

    def set_view(self, view: str):
        if view == self.active_view:
            return
        inference_service.set_active_view(view, preload=True)
        self.active_view = view
        self.model = inference_service.get_model(view)
        self.config.model_path_override = None
        self._apply_profile()
        self.reset_tracking()

    def process_frame(self, frame: np.ndarray, use_tracking: bool = True, view: Optional[str] = None) -> List[Dict]:
        self.frame_count += 1
        now = time.time()
        dt = now - self.last_fps_time
        if dt >= 0.5:
            self.fps = self.frame_count / dt
            self.frame_count = 0
            self.last_fps_time = now

        if view is not None and view != self.active_view:
            self.set_view(view)
        current_view = self.active_view
        model = self.model

        profile = inference_service.get_profile(current_view)
        conf_thresh = self.config.confidence_threshold
        iou_thresh = self.config.iou_threshold

        if use_tracking:
            results = model.track(
                source=frame,
                conf=conf_thresh,
                iou=iou_thresh,
                classes=profile.get("person_classes", [0]),
                device=self.config.device,
                imgsz=self.config.img_size,
                tracker=profile["tracker"],
                persist=True,
                verbose=False
            )
        else:
            results = model.predict(
                source=frame,
                conf=conf_thresh,
                iou=iou_thresh,
                classes=profile.get("person_classes", [0]),
                device=self.config.device,
                imgsz=self.config.img_size,
                verbose=False
            )

        detected_persons: List[Dict] = []
        if not results or len(results) == 0:
            return detected_persons

        boxes = results[0].boxes
        if boxes is None or len(boxes) == 0:
            return detected_persons

        for idx, box in enumerate(boxes):
            xyxy = box.xyxy[0].cpu().numpy()
            x1, y1, x2, y2 = map(int, xyxy)
            conf = float(box.conf[0].cpu().numpy())
            
            track_id = int(box.id[0].cpu().numpy()) if (box.id is not None and len(box.id) > 0) else (idx + 1)
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)
            fx = cx
            fy = y2

            self.track_history[track_id].append((fx, fy))

            detected_persons.append({
                'id': track_id,
                'bbox': [x1, y1, x2, y2],
                'conf': conf,
                'center': (cx, cy),
                'foot': (fx, fy),
                'width': x2 - x1,
                'height': y2 - y1,
                'is_intruder': False
            })

        return tracking_service.update_tracks(detected_persons)

    def draw_annotations(
        self,
        frame: np.ndarray,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Tuple[int, int, float]],
        clustered_ids: List[int],
        zone_polygon: Optional[np.ndarray],
        threat_level: str,
        alert_msg: str
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

            if self.config.show_track_trails and pid in self.track_history:
                points = list(self.track_history[pid])
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
            sub_info = f"PEOPLE: {total_people} | INTRUDERS: {len(intruders)} | GATHERINGS: {len(gatherings)} | FPS: {self.fps:.1f} | THRESHOLD: >= {self.config.multi_person_threshold}"
            cv2.putText(annotated, sub_info, (15, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 240, 255), 1, cv2.LINE_AA)

        return annotated
