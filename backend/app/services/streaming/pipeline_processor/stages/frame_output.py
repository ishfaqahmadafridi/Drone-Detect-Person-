"""Render analyzed frames, persist evidence, and assemble stream telemetry."""
import numpy as np

from app.services.streaming.pipeline_models import FrameAnalysis, PipelineResult
from app.services.streaming.telemetry_formatter import TelemetryFormatter


class FrameOutputStage:
    def __init__(self, services):
        self.services = services

    def build(self, frame, analysis: FrameAnalysis, frame_idx, source_type,
              active_view, confidence_threshold, zone_polygon) -> PipelineResult:
        annotated = self.services.hud_annotator.render(
            detector=self.services.detector,
            zone_monitor=self.services.zone_monitor,
            frame=frame,
            detected_persons=analysis.detected_persons + analysis.pending_persons,
            intruders=analysis.intruders,
            threat_level=analysis.threat_level,
            alert_msg=analysis.alert_msg,
        )
        if annotated is None or getattr(annotated, "size", 0) == 0:
            annotated = frame
        snapshot_filepath = self.services.threat_classifier.persist_evidence(
            alert_manager=self.services.alert_manager,
            annotated_frame=annotated,
            threat_level=analysis.threat_level,
            details=analysis.details,
            active_view=active_view,
        )
        raw_fps = getattr(self.services.detector, "fps", 0.0)
        fps = max(0.0, float(raw_fps)) if isinstance(raw_fps, (int, float)) and not np.isnan(raw_fps) else 0.0
        avionics = self.services.avionics_syncer.sync(
            detected_persons=analysis.detected_persons, current_fps=fps, active_view=active_view
        )
        telemetry = TelemetryFormatter.build_payload(
            threat_level=analysis.threat_level,
            alert_msg=analysis.alert_msg,
            detected_persons=analysis.detected_persons,
            intruders=analysis.intruders,
            fps=fps,
            frame_idx=frame_idx,
            source_type=source_type,
            view_mode=active_view,
            confidence_threshold=confidence_threshold,
            zone_polygon=zone_polygon,
            avionics_snapshot=avionics,
            tracking_mode=analysis.tracking_mode,
            selected_target_ids=analysis.selected_ids,
            model_name=(getattr(getattr(self.services.detector, "config", None), "model_name", "")
                        or getattr(self.services.config, "model_name", "")),
            engine=getattr(self.services.detector, "engine", "YOLO + ByteTrack"),
        )
        telemetry["untracked_detections"] = analysis.pending_persons
        telemetry["frame_height"], telemetry["frame_width"] = frame.shape[:2]
        return PipelineResult(
            annotated_frame=annotated, telemetry_payload=telemetry,
            threat_level=analysis.threat_level, alert_msg=analysis.alert_msg,
            detected_persons=analysis.detected_persons, intruders=analysis.intruders,
            details=analysis.details, snapshot_filepath=snapshot_filepath,
        )
