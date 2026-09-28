"""
Vision Pipeline Processor: Coordinates single-frame computer vision lifecycle.
Encapsulates inference, geofence intrusion, gathering clustering, threat evaluation, and annotation.
"""

from dataclasses import dataclass
import threading
from typing import List, Dict, Tuple, Optional, Any
import numpy as np

from app.core.config import DetectionConfig, SNAPSHOTS_DIR, LOGS_DIR
from app.services.detector_service import DronePersonDetectorService
from app.services.zone_service import ZoneMonitorService
from app.services.alert_service import AlertManagerService
from app.services.streaming.drone_service import drone_avionics_service


@dataclass
class PipelineResult:
    """
    Structured outcome of a processed computer vision frame.
    """
    annotated_frame: np.ndarray
    telemetry_payload: Dict[str, Any]
    threat_level: str
    alert_msg: str
    detected_persons: List[Dict]
    intruders: List[Dict]


class VisionPipelineProcessor:
    """
    Thread-safe processor executing the computer vision stages for a single video frame.
    """
    def __init__(self, config: Optional[DetectionConfig] = None):
        self.config = config or DetectionConfig(
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
        self._lock = threading.Lock()

    def set_view(self, view_mode: str) -> str:
        with self._lock:
            return self.detector.set_view(view_mode)

    def update_config(
        self,
        multi_person_thresh: Optional[int] = None,
        conf_thresh: Optional[float] = None,
        prox_dist: Optional[int] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ):
        with self._lock:
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

    def process_frame(
        self,
        frame: np.ndarray,
        frame_idx: int,
        source_type: str = "synthetic"
    ) -> PipelineResult:
        """
        Executes complete detection, zoning, alert, and annotation pipeline.
        Designed to execute without holding global state locks.
        """
        h, w = frame.shape[:2]

        with self._lock:
            cfg = self.config
            prox_dist = cfg.proximity_alert_distance_px
            multi_thresh = cfg.multi_person_threshold
            conf_thresh = cfg.confidence_threshold
            zone_norm = cfg.default_zone_normalized
            active_view = self.detector.active_view

        # 1. Update zone resolution
        self.zone_monitor.update_resolution(w, h)

        # 2. Object detection & multi-target tracking
        detected_persons = self.detector.process_frame(frame, use_tracking=True)

        # 3. Geofence intrusion verification
        intruders = self.zone_monitor.check_intrusions(detected_persons)

        # 4. Proximity gathering clustering
        gatherings, clustered_ids = self.zone_monitor.compute_gatherings(
            detected_persons,
            proximity_threshold_px=prox_dist
        )

        # 5. Threat state classification
        threat_level, alert_msg, details = self.alert_manager.evaluate_state(
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            frame_idx=frame_idx
        )

        # 6. High-visibility tactical HUD annotation
        annotated_frame = self.detector.draw_annotations(
            frame=frame,
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            clustered_ids=clustered_ids,
            zone_polygon=self.zone_monitor.pixel_polygon,
            threat_level=threat_level,
            alert_msg=alert_msg
        )

        # 7. Asynchronous/Cooldown evidence persistence
        self.alert_manager.process_and_save_evidence(annotated_frame, threat_level, details)

        # 8. Drone physics & avionics telemetry synchronization
        drone_avionics_service.update_physics(
            is_detecting=len(detected_persons) > 0,
            fps=self.detector.fps
        )
        avionics_snapshot = drone_avionics_service.get_avionics_snapshot(
            fps=self.detector.fps,
            detecting=len(detected_persons) > 0
        )

        # 9. Structured telemetry state payload
        telemetry_payload = {
            "threat_level": threat_level,
            "alert_msg": alert_msg,
            "total_persons": len(detected_persons),
            "intruders_count": len(intruders),
            "gathering_pairs": len(gatherings),
            "fps": round(self.detector.fps, 1),
            "frame_idx": frame_idx,
            "detections": [
                {
                    "id": p["id"],
                    "conf": round(p["conf"], 2),
                    "bbox": p["bbox"],
                    "speed_px_s": p.get("speed_px_s", 0.0),
                    "trajectory_len": len(p.get("trajectory", [])),
                    "is_intruder": p.get("is_intruder", False)
                } for p in detected_persons
            ],
            "source_type": source_type,
            "view_mode": active_view,
            "multi_person_threshold": multi_thresh,
            "confidence_threshold": conf_thresh,
            "proximity_distance_px": prox_dist,
            "zone_polygon": zone_norm,
            "avionics": avionics_snapshot
        }

        return PipelineResult(
            annotated_frame=annotated_frame,
            telemetry_payload=telemetry_payload,
            threat_level=threat_level,
            alert_msg=alert_msg,
            detected_persons=detected_persons,
            intruders=intruders
        )
