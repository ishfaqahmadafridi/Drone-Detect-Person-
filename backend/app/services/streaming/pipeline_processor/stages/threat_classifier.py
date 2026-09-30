"""
Threat Classifier Stage: Threat state classification and forensic snapshot persistence.
"""

from typing import List, Dict, Tuple, Any
import numpy as np


class PipelineThreatClassifier:
    """
    Classifies overall tactical threat posture and coordinates evidentiary snapshot persistence.
    """

    @staticmethod
    def evaluate_state(
        alert_manager,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Any],
        frame_idx: int
    ) -> Tuple[str, str, Dict[str, Any]]:
        """
        Evaluates system threat state and prepares incident event metadata.
        """
        threat_level, alert_msg, details = alert_manager.evaluate_state(
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            frame_idx=frame_idx
        )
        return threat_level, alert_msg, (details or {})

    @staticmethod
    def persist_evidence(
        alert_manager,
        annotated_frame: np.ndarray,
        threat_level: str,
        details: Dict[str, Any],
        active_view: str
    ) -> None:
        """
        Saves annotated forensic evidence snapshot if threat condition is triggered.
        Guarded with try-except to ensure storage faults never crash the live video pipeline.
        """
        try:
            evidence_details = dict(details) if isinstance(details, dict) else {}
            evidence_details["view_mode"] = active_view
            alert_manager.process_and_save_evidence(annotated_frame, threat_level, evidence_details)
        except Exception as exc:
            print(f"[WARN] Failed to persist forensic evidence snapshot: {exc}")
