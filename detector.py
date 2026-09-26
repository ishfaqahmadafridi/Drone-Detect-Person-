"""
Core Drone Aerial Person Detection and Tracking Engine.
Uses YOLOv8 / YOLOv11 with ByteTrack multi-object tracking,
extracts target centers, ground contact foot coordinates, and renders high-visibility HUD overlays.
"""

from typing import List, Dict, Tuple, Optional
import numpy as np
import cv2
import time
from collections import defaultdict, deque
import os
from pathlib import Path
from config import DetectionConfig

class DronePersonDetector:
    def __init__(self, config: Optional[DetectionConfig] = None):
        self.config = config or DetectionConfig()
        
        # Lazy load ultralytics YOLO
        settings_dir = Path(os.environ.setdefault("YOLO_CONFIG_DIR", str(Path(__file__).resolve().parent / ".runtime" / "ultralytics")))
        settings_dir.mkdir(parents=True, exist_ok=True)
        from ultralytics import YOLO
        print(f"[INFO] Initializing YOLO Aerial Model: {self.config.model_name} on device: {self.config.device}...")
        self.model = YOLO(self.config.model_name)
        
        # Track history for rendering movement trails: {track_id: deque([(x, y), ...])}
        self.track_history = defaultdict(lambda: deque(maxlen=30))
        self.last_fps_time = time.time()
        self.fps = 0.0
        self.frame_count = 0

    def process_frame(
        self,
        frame: np.ndarray,
        use_tracking: bool = True
    ) -> List[Dict]:
        """
        Runs YOLO detection/tracking on a single video frame.
        Filters for person class (class ID 0) with confidence threshold.
        Returns a list of detected person dictionaries:
        [
            {
                'id': int,
                'bbox': [x1, y1, x2, y2],
                'conf': float,
                'center': (cx, cy),
                'foot': (fx, fy),
                'width': int,
                'height': int
            }, ...
        ]
        """
        self.frame_count += 1
        now = time.time()
        dt = now - self.last_fps_time
        if dt >= 0.5:
            self.fps = self.frame_count / dt
            self.frame_count = 0
            self.last_fps_time = now

        # Run YOLO with tracking or standard detection
        if use_tracking:
            results = self.model.track(
                source=frame,
                conf=self.config.confidence_threshold,
                iou=self.config.iou_threshold,
                classes=self.config.target_classes,
                device=self.config.device,
                imgsz=self.config.img_size,
                persist=True,
                verbose=False
            )
        else:
            results = self.model.predict(
                source=frame,
                conf=self.config.confidence_threshold,
                iou=self.config.iou_threshold,
                classes=self.config.target_classes,
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
            
            # Extract track ID if available
            track_id = int(box.id[0].cpu().numpy()) if (box.id is not None and len(box.id) > 0) else (idx + 1)
            
            # Compute center and foot (bottom-center for ground position in aerial views)
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)
            fx = cx
            fy = y2

            # Update trail history
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

        return detected_persons

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
        """
        Draws high-visibility tactical HUD overlay, bounding boxes,
        restricted zone boundaries, proximity link lines, and track trails.
        """
        h, w = frame.shape[:2]
        annotated = frame.copy()

        # 1. Draw Restricted Zone (ROI) Polygon
        if zone_polygon is not None and len(zone_polygon) >= 3 and self.config.show_restricted_zones:
            # Color changes if zone is breached
            has_intruders = len(intruders) > 0
            zone_color = (0, 0, 255) if has_intruders else (255, 165, 0)  # Red if breach, Orange/Amber if clear
            
            # Create semi-transparent overlay
            overlay = annotated.copy()
            cv2.fillPoly(overlay, [zone_polygon], color=zone_color)
            cv2.addWeighted(overlay, 0.15 if not has_intruders else 0.28, annotated, 0.85 if not has_intruders else 0.72, 0, annotated)
            
            # Draw crisp border
            cv2.polylines(annotated, [zone_polygon], isClosed=True, color=zone_color, thickness=2, lineType=cv2.LINE_AA)
            
            # Zone label
            zx, zy = zone_polygon[0]
            label = "⚠️ RESTRICTED ZONE [BREACH DETECTED]" if has_intruders else "🔒 RESTRICTED PERIMETER"
            cv2.putText(annotated, label, (zx + 5, max(zy - 10, 20)), cv2.FONT_HERSHEY_SIMPLEX, 0.55, zone_color, 2, cv2.LINE_AA)

        # 2. Draw Gathering Proximity Lines (between people <= proximity distance)
        if self.config.show_proximity_lines and gatherings:
            person_map = {p['id']: p for p in detected_persons}
            for id1, id2, dist in gatherings:
                if id1 in person_map and id2 in person_map:
                    pt1 = person_map[id1]['center']
                    pt2 = person_map[id2]['center']
                    # Yellow dashed-like proximity alert line
                    cv2.line(annotated, pt1, pt2, (0, 220, 255), 2, cv2.LINE_AA)
                    mid_pt = ((pt1[0] + pt2[0]) // 2, (pt1[1] + pt2[1]) // 2)
                    cv2.putText(annotated, f"GATHER: {int(dist)}px", mid_pt, cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 255), 1, cv2.LINE_AA)

        # 3. Draw Track Trails & Target Bounding Boxes
        intruder_ids = {p['id'] for p in intruders}
        clustered_ids_set = set(clustered_ids)
        total_people = len(detected_persons)

        for person in detected_persons:
            pid = person['id']
            x1, y1, x2, y2 = person['bbox']
            conf = person['conf']
            is_intruder = pid in intruder_ids
            is_clustered = pid in clustered_ids_set or (total_people >= self.config.multi_person_threshold)

            # Color coding:
            # - Red: Zone Intruder
            # - Orange/Magenta: 2+ Person Gathering
            # - Neon Green: Normal single monitored person
            if is_intruder:
                box_color = (0, 0, 255)       # Red
                tag = f"INTRUDER #{pid} ({conf:.2f})"
            elif is_clustered:
                box_color = (0, 140, 255)     # Orange / Warning
                tag = f"PERSON #{pid} [GATHER]"
            else:
                box_color = (0, 255, 0)       # Green
                tag = f"PERSON #{pid} ({conf:.2f})"

            # Draw Movement Trail
            if self.config.show_track_trails and pid in self.track_history:
                points = list(self.track_history[pid])
                for i in range(1, len(points)):
                    alpha = i / len(points)
                    thickness = int(1 + alpha * 2)
                    cv2.line(annotated, points[i - 1], points[i], box_color, thickness, lineType=cv2.LINE_AA)

            # Draw Bounding Box (Corner Bracket Tactical Style)
            if self.config.show_boxes:
                # Main box
                cv2.rectangle(annotated, (x1, y1), (x2, y2), box_color, 2, lineType=cv2.LINE_AA)
                
                # Header Tag with Solid Background
                tag_size = cv2.getTextSize(tag, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)[0]
                tag_y = max(y1 - 5, tag_size[1] + 5)
                cv2.rectangle(annotated, (x1, tag_y - tag_size[1] - 4), (x1 + tag_size[0] + 8, tag_y + 4), box_color, -1)
                cv2.putText(annotated, tag, (x1 + 4, tag_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 1, cv2.LINE_AA)

                # Ground Contact Marker (foot circle)
                fx, fy = person['foot']
                cv2.circle(annotated, (fx, fy), 4, box_color, -1, lineType=cv2.LINE_AA)

        # 4. Draw HUD Banner (Top Bar Status)
        if self.config.show_hud:
            hud_h = 60
            hud_overlay = annotated.copy()
            
            # HUD Background color based on threat
            if threat_level == "INTRUSION":
                hud_bg = (0, 0, 180)  # Red
            elif threat_level == "MULTI_PERSON":
                hud_bg = (0, 120, 200) # Orange
            elif threat_level == "MONITORING":
                hud_bg = (100, 80, 0)  # Amber
            else:
                hud_bg = (30, 30, 30)  # Dark Charcoal

            cv2.rectangle(hud_overlay, (0, 0), (w, hud_h), hud_bg, -1)
            cv2.addWeighted(hud_overlay, 0.85, annotated, 0.15, 0, annotated)
            cv2.line(annotated, (0, hud_h), (w, hud_h), (255, 255, 255), 1)

            # HUD Text
            status_title = f"DRONE AERIAL MONITOR | {alert_msg}"
            cv2.putText(annotated, status_title, (15, 26), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA)
            
            sub_info = f"PEOPLE: {total_people} | INTRUDERS: {len(intruders)} | GATHERINGS: {len(gatherings)} | FPS: {self.fps:.1f} | THRESHOLD: >= {self.config.multi_person_threshold}"
            cv2.putText(annotated, sub_info, (15, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (200, 240, 255), 1, cv2.LINE_AA)

        return annotated
