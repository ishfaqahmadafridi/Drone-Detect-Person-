"""
Alert Manager Service: High-level Coordinator of Threat Evaluation and Evidence Recording.
"""

from app.core.config import OUTPUT_DIR, SNAPSHOTS_DIR, LOGS_DIR
from app.core.constants import DEFAULT_SNAPSHOT_COOLDOWN_SECONDS

from typing import List, Dict, Optional, Tuple, Any
from app.core.constants import AlertLevel
from app.services.alert.state_evaluator import ThreatStateEvaluator
from app.services.alert.evidence_recorder import EvidenceRecorder


class AlertManagerService:
    def __init__(
        self,
        output_dir: str = OUTPUT_DIR,
        snapshots_dir: str = SNAPSHOTS_DIR,
        logs_dir: str = LOGS_DIR,
        snapshot_cooldown: float = DEFAULT_SNAPSHOT_COOLDOWN_SECONDS,
        enable_audio: bool = False
    ):
        self.output_dir = output_dir
        self.snapshots_dir = snapshots_dir
        self.logs_dir = logs_dir
        self.snapshot_cooldown = snapshot_cooldown
        self.enable_audio = enable_audio

        self.state_evaluator = ThreatStateEvaluator(
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
        frame_idx: int = 0,
        view_mode: str = "aerial"
    ) -> Tuple[str, str, Dict]:
        threat_level, alert_msg, details = self.state_evaluator.evaluate(
            detected_persons=detected_persons,
            intruders=intruders,
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
