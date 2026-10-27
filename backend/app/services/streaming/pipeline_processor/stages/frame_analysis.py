"""Detect targets, observe clean frames, and evaluate scene threats."""
import logging

from app.services.streaming.pipeline_models import FrameAnalysis
from app.services.streaming.pipeline_processor.stages.targeting_mode_evaluator import TargetingModeEvaluator


class FrameAnalysisStage:
    def __init__(self, services):
        self.services = services

    def analyze(self, frame, frame_idx, source_type, sim_targets, active_view) -> FrameAnalysis:
        detected = self.services.tracker.detect_and_track(
            detector=self.services.detector, frame=frame, sim_targets=sim_targets
        )
        detected = detected if isinstance(detected, list) else []
        pending = (getattr(self.services.detector, "untracked_detections", [])
                   if source_type != "synthetic" else [])
        pending = pending if isinstance(pending, list) else []
        self._observe_clean_frame(frame, detected, frame_idx, source_type)

        intruders = self.services.hazard_evaluator.evaluate(
            zone_monitor=self.services.zone_monitor, detected_persons=detected
        )
        intruders = intruders if isinstance(intruders, list) else []
        raw_threat, raw_message, details = self.services.threat_classifier.evaluate_state(
            alert_manager=self.services.alert_manager,
            detected_persons=detected,
            intruders=intruders,
            frame_idx=frame_idx,
            active_view=active_view,
        )
        threat, message, mode, selected = TargetingModeEvaluator.evaluate_mode(
            config=self.services.config,
            default_threat_level=raw_threat,
            default_alert_msg=raw_message,
        )
        return FrameAnalysis(
            detected_persons=detected, pending_persons=pending, intruders=intruders,
            threat_level=threat, alert_msg=message, details=details,
            tracking_mode=mode, selected_ids=selected,
        )

    def _observe_clean_frame(self, frame, detected, frame_idx, source_type):
        observer = getattr(self.services, "frame_observer", None)
        if observer is not None:
            try:
                observer(frame, detected, frame_idx, source_type,
                         list(self.services.config.selected_target_ids))
            except Exception:
                logging.exception("ReID crop collection failed; detection continues")
