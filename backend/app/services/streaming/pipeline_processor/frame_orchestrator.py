"""
Pipeline Frame Orchestrator: Coordinates sequential frame execution through atomic pipeline stages.
"""

from typing import List, Dict, Optional
import numpy as np

from app.services.streaming.pipeline_models import PipelineResult
from app.services.streaming.telemetry_formatter import TelemetryFormatter
from app.services.streaming.pipeline_processor.services_container import PipelineServicesContainer
from app.services.streaming.pipeline_processor.stages.frame_normalizer import FrameNormalizer
from app.services.streaming.pipeline_processor.stages.targeting_mode_evaluator import TargetingModeEvaluator


class PipelineFrameOrchestrator:
    """
    Executes the frame-level computer vision processing lifecycle across all pipeline stages.
    """

    def __init__(self, services: PipelineServicesContainer):
        self.services = services

    def process(
        self,
        frame: np.ndarray,
        frame_idx: int,
        source_type: str = "synthetic",
        sim_targets: Optional[List[Dict]] = None
    ) -> PipelineResult:
        """
        Executes sequential vision processing stages defensively and produces PipelineResult.
        Guarded against invalid frame shapes, concurrent lock races, and transient stage exceptions.
        """
        active_view = getattr(self.services.detector, "active_view", "aerial")

        # 1. Defensive validation & color space normalization
        is_valid, norm_frame, h, w = FrameNormalizer.validate_and_normalize(frame)
        if not is_valid or norm_frame is None:
            return PipelineResult.empty_fallback(frame, source_type=source_type, view_mode=active_view)

        try:
            # 2. Thread-safe configuration snapshot & zone resolution synchronization
            with self.services.lock:
                cfg = self.services.config
                conf_thresh = cfg.confidence_threshold
                zone_norm = cfg.default_zone_normalized
                active_view = getattr(self.services.detector, "active_view", "aerial")
                self.services.zone_monitor.update_resolution(w, h)

            # 3. Stage: Detection & Tracking
            detected_persons = self.services.tracker.detect_and_track(
                detector=self.services.detector,
                frame=norm_frame,
                sim_targets=sim_targets
            )
            detected_persons = detected_persons if isinstance(detected_persons, list) else []
            pending_persons = getattr(self.services.detector, "untracked_detections", []) if source_type != "synthetic" else []
            pending_persons = pending_persons if isinstance(pending_persons, list) else []

            # ReID sees clean crops before annotation and never runs CUDA here.
            observer = getattr(self.services, "frame_observer", None)
            if observer is not None:
                try:
                    observer(norm_frame, detected_persons, frame_idx, source_type,
                             list(self.services.config.selected_target_ids))
                except Exception:
                    import logging
                    logging.exception("ReID crop collection failed; detection continues")

            # 4. Stage: Restricted-zone evaluation
            intruders = self.services.hazard_evaluator.evaluate(
                zone_monitor=self.services.zone_monitor,
                detected_persons=detected_persons,
            )
            intruders = intruders if isinstance(intruders, list) else []

            # 5. Stage: Threat Classification
            raw_threat_level, raw_alert_msg, details = self.services.threat_classifier.evaluate_state(
                alert_manager=self.services.alert_manager,
                detected_persons=detected_persons,
                intruders=intruders,
                frame_idx=frame_idx,
                active_view=active_view
            )

            # 6. Stage: Operational Targeting Mode Override (Manual Lock vs Auto)
            threat_level, alert_msg, tracking_mode, selected_ids = TargetingModeEvaluator.evaluate_mode(
                config=self.services.config,
                default_threat_level=raw_threat_level,
                default_alert_msg=raw_alert_msg
            )

            # 7. Stage: HUD Tactical Annotation
            annotated_frame = self.services.hud_annotator.render(
                detector=self.services.detector,
                zone_monitor=self.services.zone_monitor,
                frame=norm_frame,
                detected_persons=detected_persons + pending_persons,
                intruders=intruders,
                threat_level=threat_level,
                alert_msg=alert_msg
            )
            if annotated_frame is None or getattr(annotated_frame, "size", 0) == 0:
                annotated_frame = norm_frame

            # 8. Stage: Evidence Snapshot Persistence
            self.services.threat_classifier.persist_evidence(
                alert_manager=self.services.alert_manager,
                annotated_frame=annotated_frame,
                threat_level=threat_level,
                details=details,
                active_view=active_view
            )

            # 9. Measure & sanitize pipeline throughput FPS
            raw_fps = getattr(self.services.detector, "fps", 0.0)
            current_fps = max(0.0, float(raw_fps)) if isinstance(raw_fps, (int, float)) and not np.isnan(raw_fps) else 0.0

            # 10. Stage: Avionics Physics & Battery Sync (aerial only)
            avionics_snapshot = self.services.avionics_syncer.sync(
                detected_persons=detected_persons,
                current_fps=current_fps,
                active_view=active_view
            )

            # 11. Stage: Telemetry Payload Serialization
            telemetry_payload = TelemetryFormatter.build_payload(
                threat_level=threat_level,
                alert_msg=alert_msg,
                detected_persons=detected_persons,
                intruders=intruders,
                fps=current_fps,
                frame_idx=frame_idx,
                source_type=source_type,
                view_mode=active_view,
                confidence_threshold=conf_thresh,
                zone_polygon=zone_norm,
                avionics_snapshot=avionics_snapshot,
                tracking_mode=tracking_mode,
                selected_target_ids=selected_ids,
                model_name=getattr(getattr(self.services.detector, "config", None), "model_name", "") or getattr(self.services.config, "model_name", ""),
                engine=getattr(self.services.detector, "engine", "YOLO + ByteTrack")
            )
            telemetry_payload["untracked_detections"] = pending_persons

            return PipelineResult(
                annotated_frame=annotated_frame,
                telemetry_payload=telemetry_payload,
                threat_level=threat_level,
                alert_msg=alert_msg,
                detected_persons=detected_persons,
                intruders=intruders
            )

        except Exception as exc:
            print(f"[ERROR] Pipeline orchestration error on frame #{frame_idx}: {exc}")
            return PipelineResult.empty_fallback(norm_frame, source_type=source_type, view_mode=active_view)
