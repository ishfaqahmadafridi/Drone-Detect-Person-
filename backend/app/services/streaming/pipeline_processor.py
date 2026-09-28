"""
Vision Pipeline Processor: Coordinates single-frame computer vision lifecycle.
Encapsulates inference, geofence intrusion, gathering clustering, threat evaluation, annotation, and telemetry dispatch.
"""

import threading
from typing import List, Dict, Tuple, Optional, Any
import numpy as np

from app.core.config import DetectionConfig
from app.core.constants import DEFAULT_FRAME_WIDTH, DEFAULT_FRAME_HEIGHT, MIN_ZONE_VERTICES
from app.services.detector_service import DronePersonDetectorService
from app.services.zone_service import ZoneMonitorService
from app.services.alert_service import AlertManagerService
from app.services.streaming.drone_service import drone_avionics_service
from app.services.streaming.pipeline_models import PipelineResult
from app.services.streaming.telemetry_formatter import TelemetryFormatter


class VisionPipelineProcessor:
    """
    Thread-safe processor executing modular computer vision stages for individual video frames.
    """
    def __init__(self, config: Optional[DetectionConfig] = None):
        self.config = config or DetectionConfig()
        self.detector = DronePersonDetectorService(self.config)
        self.zone_monitor = ZoneMonitorService(
            DEFAULT_FRAME_WIDTH,
            DEFAULT_FRAME_HEIGHT,
            self.config.default_zone_normalized
        )
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
        """
        Switches vision detection profiles between aerial drone and ground security.
        """
        with self._lock:
            return self.detector.set_view(view_mode)

    def update_config(
        self,
        multi_person_thresh: Optional[int] = None,
        conf_thresh: Optional[float] = None,
        prox_dist: Optional[int] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ):
        """
        Thread-safely updates live detection thresholds and restricted perimeter boundaries.
        """
        with self._lock:
            if multi_person_thresh is not None:
                self.config.multi_person_threshold = multi_person_thresh
                self.alert_manager.multi_person_threshold = multi_person_thresh
            if conf_thresh is not None:
                self.config.confidence_threshold = conf_thresh
            if prox_dist is not None:
                self.config.proximity_alert_distance_px = prox_dist
            if zone_polygon is not None and len(zone_polygon) >= MIN_ZONE_VERTICES:
                self.config.default_zone_normalized = zone_polygon
                self.zone_monitor.zone_polygon_normalized = zone_polygon
                self.zone_monitor._recalculate_pixel_polygon()

    def process_frame(
        self,
        frame: np.ndarray,
        frame_idx: int,
        source_type: str = "synthetic",
        sim_targets: Optional[List[Dict]] = None
    ) -> PipelineResult:
        """
        Executes complete detection, zoning, alert, HUD annotation, and telemetry pipeline.
        """
        # Defensive check against corrupted or empty frame buffers
        if frame is None or getattr(frame, "size", 0) == 0 or len(frame.shape) < 2:
            active_view = getattr(self.detector, "active_view", "aerial")
            return PipelineResult.empty_fallback(frame, source_type=source_type, view_mode=active_view)

        h, w = frame.shape[:2]

        with self._lock:
            cfg = self.config
            prox_dist = cfg.proximity_alert_distance_px
            multi_thresh = cfg.multi_person_threshold
            conf_thresh = cfg.confidence_threshold
            zone_norm = cfg.default_zone_normalized
            active_view = self.detector.active_view

        # 1. Update zone resolution to match dynamic frame aspect ratio
        self.zone_monitor.update_resolution(w, h)

        # 2. Object detection and multi-target tracking with procedural simulation fallback
        detected_persons = self._detect_and_track(frame, sim_targets)

        # 3. Spatial hazard evaluation: perimeter intrusion and gathering clustering
        intruders, gatherings, clustered_ids = self._evaluate_spatial_hazards(detected_persons, prox_dist)

        # 4. Threat state classification
        threat_level, alert_msg, details = self._evaluate_threat_state(
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            frame_idx=frame_idx
        )

        # 5. Tactical HUD annotation overlay
        annotated_frame = self._render_tactical_hud(
            frame=frame,
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            clustered_ids=clustered_ids,
            threat_level=threat_level,
            alert_msg=alert_msg
        )

        # 6. Evidentiary snapshot persistence (saves annotated forensic frame)
        self._persist_evidence(annotated_frame, threat_level, details, active_view)

        # 7. Synchronize UAV avionics physics and battery consumption
        avionics_snapshot = self._sync_avionics(detected_persons)

        # 8. Serialize standardized telemetry payload
        telemetry_payload = TelemetryFormatter.build_payload(
            threat_level=threat_level,
            alert_msg=alert_msg,
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            fps=self.detector.fps,
            frame_idx=frame_idx,
            source_type=source_type,
            view_mode=active_view,
            multi_person_threshold=multi_thresh,
            confidence_threshold=conf_thresh,
            proximity_distance_px=prox_dist,
            zone_polygon=zone_norm,
            avionics_snapshot=avionics_snapshot
        )

        return PipelineResult(
            annotated_frame=annotated_frame,
            telemetry_payload=telemetry_payload,
            threat_level=threat_level,
            alert_msg=alert_msg,
            detected_persons=detected_persons,
            intruders=intruders
        )

    # -------------------------------------------------------------------------
    # Private Atomic Pipeline Stages
    # -------------------------------------------------------------------------

    def _detect_and_track(
        self,
        frame: np.ndarray,
        sim_targets: Optional[List[Dict]]
    ) -> List[Dict]:
        """
        Executes inference detector and falls back to simulated coordinates if zero model detections occur in simulation mode.
        """
        detections = self.detector.process_frame(frame, use_tracking=True)
        if len(detections) == 0 and sim_targets:
            return sim_targets
        return detections

    def _evaluate_spatial_hazards(
        self,
        detected_persons: List[Dict],
        proximity_distance_px: int
    ) -> Tuple[List[Dict], List[Any], set]:
        """
        Calculates perimeter breaches and proximity-based clustering.
        """
        intruders = self.zone_monitor.check_intrusions(detected_persons)
        gatherings, clustered_ids = self.zone_monitor.compute_gatherings(
            detected_persons,
            proximity_threshold_px=proximity_distance_px
        )
        return intruders, gatherings, clustered_ids

    def _evaluate_threat_state(
        self,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Any],
        frame_idx: int
    ) -> Tuple[str, str, Dict[str, Any]]:
        """
        Evaluates system threat state and prepares incident event metadata.
        """
        threat_level, alert_msg, details = self.alert_manager.evaluate_state(
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            frame_idx=frame_idx
        )
        return threat_level, alert_msg, (details or {})

    def _persist_evidence(
        self,
        annotated_frame: np.ndarray,
        threat_level: str,
        details: Dict[str, Any],
        active_view: str
    ):
        """
        Saves annotated forensic evidence snapshot if intrusion or gathering threat condition is active.
        """
        evidence_details = dict(details)
        evidence_details["view_mode"] = active_view
        self.alert_manager.process_and_save_evidence(annotated_frame, threat_level, evidence_details)

    def _render_tactical_hud(
        self,
        frame: np.ndarray,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Any],
        clustered_ids: set,
        threat_level: str,
        alert_msg: str
    ) -> np.ndarray:
        """
        Draws high-visibility bounding boxes, tracking vectors, restricted zone, and status banners.
        """
        return self.detector.draw_annotations(
            frame=frame,
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            clustered_ids=clustered_ids,
            zone_polygon=self.zone_monitor.pixel_polygon,
            threat_level=threat_level,
            alert_msg=alert_msg
        )

    def _sync_avionics(self, detected_persons: List[Dict]) -> Dict[str, Any]:
        """
        Updates flight simulation metrics and returns current telemetry snapshot.
        """
        is_detecting = len(detected_persons) > 0
        current_fps = self.detector.fps
        drone_avionics_service.update_physics(is_detecting=is_detecting, fps=current_fps)
        return drone_avionics_service.get_avionics_snapshot(fps=current_fps, detecting=is_detecting)


__all__ = ["VisionPipelineProcessor", "PipelineResult"]
