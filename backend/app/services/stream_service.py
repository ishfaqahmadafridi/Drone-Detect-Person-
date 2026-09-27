"""
Stream Service: Thread-safe Stream Manager & High-speed MJPEG Frame Generator.
"""

import os
import time
import threading
from datetime import datetime
from typing import List, Dict, Tuple, Optional
import cv2
from fastapi import WebSocket

from app.core.config import DetectionConfig, SYNTHETIC_VIDEO_PATH, SNAPSHOTS_DIR, LOGS_DIR
from app.services.detector_service import DronePersonDetectorService
from app.services.zone_service import ZoneMonitorService
from app.services.alert_service import AlertManagerService
from app.utils.video_utils import create_synthetic_drone_video

class StreamManagerService:
    def __init__(self):
        self.config = DetectionConfig(
            snapshots_dir=SNAPSHOTS_DIR,
            logs_dir=LOGS_DIR,
            multi_person_threshold=2,
            proximity_alert_distance_px=120,
            confidence_threshold=0.35
        )
        self.detector = DronePersonDetectorService(self.config)
        self.zone_monitor = ZoneMonitorService(1280, 720, self.config.default_zone_normalized)
        self.alert_manager = AlertManagerService(
            output_dir=self.config.output_dir,
            snapshots_dir=self.config.snapshots_dir,
            logs_dir=self.config.logs_dir,
            multi_person_threshold=self.config.multi_person_threshold,
            snapshot_cooldown=self.config.snapshot_cooldown_seconds,
            enable_audio=self.config.enable_audio_alert
        )

        self.source_type: str = "synthetic"
        self.source_path: str = SYNTHETIC_VIDEO_PATH
        self.is_running: bool = True
        self.lock = threading.Lock()

        # Ensure synthetic video exists
        if not os.path.exists(SYNTHETIC_VIDEO_PATH):
            create_synthetic_drone_video(SYNTHETIC_VIDEO_PATH, duration_sec=20, fps=25)

        self.latest_telemetry: Dict = {
            "threat_level": "CLEAR",
            "alert_msg": "SYSTEM INITIALIZING",
            "total_persons": 0,
            "intruders_count": 0,
            "gathering_pairs": 0,
            "fps": 0.0,
            "frame_idx": 0,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "detections": [],
            "source_type": self.source_type,
            "multi_person_threshold": self.config.multi_person_threshold,
            "confidence_threshold": self.config.confidence_threshold,
            "proximity_distance_px": self.config.proximity_alert_distance_px,
            "zone_polygon": self.config.default_zone_normalized
        }

        self.active_websockets: List[WebSocket] = []

    def set_source(self, source_type: str, source_path: Optional[str] = None):
        with self.lock:
            self.source_type = source_type
            if source_type == "synthetic":
                if not os.path.exists(SYNTHETIC_VIDEO_PATH):
                    create_synthetic_drone_video(SYNTHETIC_VIDEO_PATH, duration_sec=20, fps=25)
                self.source_path = SYNTHETIC_VIDEO_PATH
            elif source_type == "webcam":
                self.source_path = "0"
            elif source_type in ["file", "rtsp"] and source_path:
                self.source_path = source_path
            print(f"[STREAM] Switched source to: {self.source_type} ({self.source_path})")

    def update_config(
        self,
        multi_person_thresh: Optional[int] = None,
        conf_thresh: Optional[float] = None,
        prox_dist: Optional[int] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ):
        with self.lock:
            if multi_person_thresh is not None:
                self.config.multi_person_threshold = multi_person_thresh
                self.alert_manager.multi_person_threshold = multi_person_thresh
            if conf_thresh is not None:
                self.config.confidence_threshold = conf_thresh
            if prox_dist is not None:
                self.config.proximity_alert_distance_px = prox_dist
            if zone_polygon is not None and len(zone_polygon) >= 3:
                self.config.default_zone_normalized = zone_polygon
                self.zone_monitor.zone_polygon_normalized = zone_polygon
                self.zone_monitor._recalculate_pixel_polygon()

    def generate_frames(self):
        while True:
            with self.lock:
                src = self.source_path
                cap_src = int(src) if src.isdigit() else src

            cap = cv2.VideoCapture(cap_src)
            if not cap.isOpened():
                cap = cv2.VideoCapture(SYNTHETIC_VIDEO_PATH)

            frame_idx = 0

            while self.is_running:
                ret, frame = cap.read()
                if not ret:
                    if isinstance(cap_src, str) and not cap_src.startswith("rtsp://"):
                        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        continue
                    else:
                        time.sleep(0.05)
                        break

                frame_idx += 1
                h, w = frame.shape[:2]

                with self.lock:
                    cfg = self.config
                    detector = self.detector
                    zone_monitor = self.zone_monitor
                    alert_mgr = self.alert_manager

                    zone_monitor.update_resolution(w, h)
                    detected_persons = detector.process_frame(frame, use_tracking=True)
                    intruders = zone_monitor.check_intrusions(detected_persons)
                    gatherings, clustered_ids = zone_monitor.compute_gatherings(
                        detected_persons,
                        proximity_threshold_px=cfg.proximity_alert_distance_px
                    )
                    threat_level, alert_msg, details = alert_mgr.evaluate_state(
                        detected_persons=detected_persons,
                        intruders=intruders,
                        gatherings=gatherings,
                        frame_idx=frame_idx
                    )
                    annotated_frame = detector.draw_annotations(
                        frame=frame,
                        detected_persons=detected_persons,
                        intruders=intruders,
                        gatherings=gatherings,
                        clustered_ids=clustered_ids,
                        zone_polygon=zone_monitor.pixel_polygon,
                        threat_level=threat_level,
                        alert_msg=alert_msg
                    )
                    alert_mgr.process_and_save_evidence(annotated_frame, threat_level, details)

                    self.latest_telemetry = {
                        "threat_level": threat_level,
                        "alert_msg": alert_msg,
                        "total_persons": len(detected_persons),
                        "intruders_count": len(intruders),
                        "gathering_pairs": len(gatherings),
                        "fps": round(detector.fps, 1),
                        "frame_idx": frame_idx,
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "detections": [
                            {
                                "id": p["id"],
                                "conf": round(p["conf"], 2),
                                "bbox": p["bbox"],
                                "is_intruder": p.get("is_intruder", False)
                            } for p in detected_persons
                        ],
                        "source_type": self.source_type,
                        "multi_person_threshold": cfg.multi_person_threshold,
                        "confidence_threshold": cfg.confidence_threshold,
                        "proximity_distance_px": cfg.proximity_alert_distance_px,
                        "zone_polygon": cfg.default_zone_normalized
                    }

                ret, buffer = cv2.imencode('.jpg', annotated_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                if not ret:
                    continue

                frame_bytes = buffer.tobytes()
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')

                time.sleep(0.02)

            cap.release()
            time.sleep(0.5)

stream_service = StreamManagerService()
