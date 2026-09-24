"""
Alert Manager module.
Evaluates detection & intrusion states, manages alarm levels, logs security incidents,
and captures evidentiary snapshots with cooldown control.
"""

import os
import time
import json
import csv
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import cv2

class AlertLevel:
    CLEAR = "CLEAR"               # 0 persons detected
    MONITORING = "MONITORING"     # 1 person detected (normal surveillance)
    MULTI_PERSON = "MULTI_PERSON" # 2 or more persons detected (Gathering Alert)
    INTRUSION = "INTRUSION"       # Person(s) inside restricted zone

class AlertManager:
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
        
        self.last_snapshot_time = 0.0
        self.current_threat_level = AlertLevel.CLEAR
        self.alert_history: List[Dict] = []
        
        # Setup files
        self.log_file_csv = os.path.join(self.logs_dir, "intrusion_events.csv")
        self.log_file_json = os.path.join(self.logs_dir, "intrusion_events.json")
        self._init_csv()

    def _init_csv(self):
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

    def evaluate_state(
        self,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Tuple[int, int, float]],
        frame_idx: int = 0
    ) -> Tuple[str, str, Dict]:
        """
        Evaluate frame detections to determine current security status.
        Returns (threat_level, alert_message, details_dict)
        """
        total_count = len(detected_persons)
        intruder_count = len(intruders)
        gathering_count = len(gatherings)
        
        threat_level = AlertLevel.CLEAR
        alert_msg = "AIRSPACE & ZONE SECURE - NO TARGETS"
        
        if intruder_count > 0:
            threat_level = AlertLevel.INTRUSION
            if intruder_count >= self.multi_person_threshold:
                alert_msg = f"CRITICAL: {intruder_count} INTRUDERS IN RESTRICTED ZONE!"
            else:
                alert_msg = f"WARNING: RESTRICTED ZONE BREACH ({intruder_count} PERSON)"
        elif total_count >= self.multi_person_threshold:
            threat_level = AlertLevel.MULTI_PERSON
            alert_msg = f"ALERT: {total_count} PEOPLE DETECTED (GATHERING TRIGGER >= {self.multi_person_threshold})"
        elif total_count == 1:
            threat_level = AlertLevel.MONITORING
            alert_msg = "SURVEILLANCE ACTIVE: 1 PERSON DETECTED"

        self.current_threat_level = threat_level
        
        details = {
            "threat_level": threat_level,
            "alert_message": alert_msg,
            "total_persons": total_count,
            "intruders_count": intruder_count,
            "gathering_pairs": gathering_count,
            "person_ids": [p.get('id', -1) for p in detected_persons],
            "intruder_ids": [p.get('id', -1) for p in intruders],
            "frame_idx": frame_idx,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        
        return threat_level, alert_msg, details

    def process_and_save_evidence(
        self,
        frame: cv2.Mat,
        threat_level: str,
        details: Dict
    ) -> Optional[str]:
        """
        If threat level is active (Intrusion or 2+ People) and cooldown passed,
        save timestamped snapshot and append incident log.
        """
        now = time.time()
        is_active_alert = threat_level in [AlertLevel.INTRUSION, AlertLevel.MULTI_PERSON]
        
        snapshot_saved_path = None
        if is_active_alert and (now - self.last_snapshot_time >= self.snapshot_cooldown):
            self.last_snapshot_time = now
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:19]
            filename = f"alert_{threat_level.lower()}_{timestamp_str}.jpg"
            filepath = os.path.join(self.snapshots_dir, filename)
            
            # Save frame to disk
            cv2.imwrite(filepath, frame)
            snapshot_saved_path = filepath
            
            # Record incident log
            details_copy = dict(details)
            details_copy['snapshot_path'] = filepath
            self.alert_history.append(details_copy)
            
            # Write to CSV
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
                
            # Keep recent JSON log file updated
            try:
                with open(self.log_file_json, mode='w', encoding='utf-8') as jf:
                    json.dump(self.alert_history[-100:], jf, indent=2)
            except Exception:
                pass

        return snapshot_saved_path
