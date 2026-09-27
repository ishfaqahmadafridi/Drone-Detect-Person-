"""
Detection Pipeline Engine: Coordinated single-frame and continuous stream processor.
"""

from typing import Dict, Tuple, Optional, List
import numpy as np
from app.core.config import DetectionConfig
from app.services.detector_service import DronePersonDetectorService
from app.services.zone_service import ZoneMonitorService
from app.services.alert_service import AlertManagerService
from app.engine.annotator import TacticalFrameAnnotator

class DetectionPipeline:
    """
    High-performance pipeline coordinating detection, zone tracking, gathering logic, and annotation.
    """
    def __init__(self, config: Optional[DetectionConfig] = None):
        self.config = config or DetectionConfig()
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
        self.annotator = TacticalFrameAnnotator(self.config)

    def process_frame(
        self,
        frame: np.ndarray,
        frame_idx: int = 0
    ) -> Tuple[np.ndarray, Dict, Optional[str]]:
        """
        Processes a single video frame through the full detection pipeline.
        
        Returns:
            Tuple of (annotated_frame, telemetry_dict, snapshot_filepath_or_none)
        """
        h, w = frame.shape[:2]
        self.zone_monitor.update_resolution(w, h)

        # 1. Infer & track persons
        detected_persons = self.detector.process_frame(frame, use_tracking=True)

        # 2. Check intrusion in polygon
        intruders = self.zone_monitor.check_intrusions(detected_persons)

        # 3. Compute gathering proximities
        gatherings, clustered_ids = self.zone_monitor.compute_gatherings(
            detected_persons,
            proximity_threshold_px=self.config.proximity_alert_distance_px
        )

        # 4. Evaluate threat level & alerts
        threat_level, alert_msg, details = self.alert_manager.evaluate_state(
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            frame_idx=frame_idx
        )

        # 5. Draw tactical HUD & overlays
        annotated_frame = self.annotator.draw_annotations(
            frame=frame,
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            clustered_ids=clustered_ids,
            zone_polygon=self.zone_monitor.pixel_polygon,
            threat_level=threat_level,
            alert_msg=alert_msg,
            fps=self.detector.fps,
            track_history=self.detector.track_history
        )

        # 6. Capture Evidence Snapshot if in alert state
        saved_snapshot = self.alert_manager.process_and_save_evidence(
            annotated_frame,
            threat_level,
            details
        )

        telemetry = {
            "threat_level": threat_level,
            "alert_msg": alert_msg,
            "total_persons": len(detected_persons),
            "intruders_count": len(intruders),
            "gathering_pairs": len(gatherings),
            "fps": self.detector.fps,
            "frame_idx": frame_idx,
            "detections": detected_persons,
            "details": details
        }

        return annotated_frame, telemetry, saved_snapshot
