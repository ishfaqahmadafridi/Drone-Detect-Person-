"""
Alert Manager Service: High-level Coordinator of Threat Evaluation and Evidence Recording.
"""

from typing import List, Dict, Optional, Tuple, Any
from app.core.constants import AlertLevel
from app.services.alert.state_evaluator import ThreatStateEvaluator
from app.services.alert.evidence_recorder import EvidenceRecorder


class AlertManagerService:
    def __init__(
        self,
        output_dir: str = "runs/output",
        snapshots_dir: str = "runs/output/snapshots",
        logs_dir: str = "runs/output/logs",
        multi_person_threshold: int = 2,
        snapshot_cooldown: float = 3.0,
        enable_audio: bool = False
    ):
        self.output_dir = output_dir
        self.snapshots_dir = snapshots_dir
        self.logs_dir = logs_dir
        self.multi_person_threshold = multi_person_threshold
        self.snapshot_cooldown = snapshot_cooldown
        self.enable_audio = enable_audio

        self.state_evaluator = ThreatStateEvaluator(
            multi_person_threshold=multi_person_threshold
        )
        self.evidence_recorder = EvidenceRecorder(
            output_dir=output_dir,
            snapshots_dir=snapshots_dir,
            logs_dir=logs_dir,
            snapshot_cooldown=snapshot_cooldown
        )

        self.current_threat_level = AlertLevel.CLEAR

    @property
    def last_snapshot_time(self) -> float:
        return self.evidence_recorder.last_snapshot_time

    @last_snapshot_time.setter
    def last_snapshot_time(self, val: float):
        self.evidence_recorder.last_snapshot_time = val

    @property
    def alert_history(self) -> List[Dict]:
        return self.evidence_recorder.alert_history

    @property
    def log_file_csv(self) -> str:
        return self.evidence_recorder.log_file_csv

    @property
    def log_file_json(self) -> str:
        return self.evidence_recorder.log_file_json

    def _init_csv(self):
        self.evidence_recorder.init_csv()

    def evaluate_state(
        self,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Tuple[int, int, float]],
        frame_idx: int = 0,
        view_mode: str = "aerial"
    ) -> Tuple[str, str, Dict]:
        threat_level, alert_msg, details = self.state_evaluator.evaluate(
            detected_persons=detected_persons,
            intruders=intruders,
            gatherings=gatherings,
            frame_idx=frame_idx,
            view_mode=view_mode
        )
        self.current_threat_level = threat_level
        return threat_level, alert_msg, details

    def process_and_save_evidence(
        self,
        frame: Any,
        threat_level: str,
        details: Dict
    ) -> Optional[str]:
        return self.evidence_recorder.save_evidence(
            frame=frame,
            threat_level=threat_level,
            details=details
        )
