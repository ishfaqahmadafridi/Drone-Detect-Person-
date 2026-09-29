"""
Evidence Recorder: Cooldown-governed Snapshot Recording and CSV/JSON Audit Logging.
"""

import os
import time
import json
import csv
from datetime import datetime
from typing import List, Dict, Optional, Any
try:
    import cv2
except ImportError:
    cv2 = None
from app.core.constants import AlertLevel


class EvidenceRecorder:
    def __init__(
        self,
        output_dir: str = "runs/output",
        snapshots_dir: str = "runs/output/snapshots",
        logs_dir: str = "runs/output/logs",
        snapshot_cooldown: float = 3.0
    ):
        self.output_dir = output_dir
        self.snapshots_dir = snapshots_dir
        self.logs_dir = logs_dir
        self.snapshot_cooldown = snapshot_cooldown
        
        self.last_snapshot_time = 0.0
        self.alert_history: List[Dict] = []
        
        self.log_file_csv = os.path.join(self.logs_dir, "intrusion_events.csv")
        self.log_file_json = os.path.join(self.logs_dir, "intrusion_events.json")
        self.init_csv()

    def init_csv(self):
        os.makedirs(self.logs_dir, exist_ok=True)
        os.makedirs(self.snapshots_dir, exist_ok=True)
        if not os.path.exists(self.log_file_csv):
            with open(self.log_file_csv, mode='w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([
                    "timestamp",
                    "threat_level",
                    "total_persons",
                    "intruders_count",
                    "gathering_clusters",
                    "person_ids",
                    "snapshot_path"
                ])

    def save_evidence(
        self,
        frame: Any,
        threat_level: str,
        details: Dict
    ) -> Optional[str]:
        now = time.time()
        is_active_alert = threat_level in [AlertLevel.INTRUSION, AlertLevel.MULTI_PERSON]
        
        snapshot_saved_path = None
        if is_active_alert and (now - self.last_snapshot_time >= self.snapshot_cooldown):
            self.last_snapshot_time = now
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:19]
            view_mode = str(details.get("view_mode", "aerial")).lower()
            filename = f"alert_{threat_level.lower()}_{view_mode}_{timestamp_str}.jpg"
            filepath = os.path.join(self.snapshots_dir, filename)
            
            if cv2 is not None and frame is not None:
                cv2.imwrite(filepath, frame)
            snapshot_saved_path = filepath
            
            details_copy = dict(details)
            details_copy['snapshot_path'] = filepath
            self.alert_history.append(details_copy)
            
            with open(self.log_file_csv, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([
                    details_copy['timestamp'],
                    details_copy['threat_level'],
                    details_copy['total_persons'],
                    details_copy['intruders_count'],
                    details_copy['gathering_pairs'],
                    str(details_copy['person_ids']),
                    filepath
                ])
                
            try:
                with open(self.log_file_json, mode='w', encoding='utf-8') as jf:
                    json.dump(self.alert_history[-100:], jf, indent=2)
            except Exception:
                pass

        return snapshot_saved_path

    def capture_manual_snapshot(self, frame: Any, view_mode: str = "aerial") -> str:
        """
        Instantly saves unthrottled manual evidence snapshot requested by operator.
        """
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:19]
        clean_view = str(view_mode).lower().strip()
        filename = f"manual_{clean_view}_{timestamp_str}.jpg"
        filepath = os.path.join(self.snapshots_dir, filename)
        if cv2 is not None and frame is not None:
            cv2.imwrite(filepath, frame)
        return filename
