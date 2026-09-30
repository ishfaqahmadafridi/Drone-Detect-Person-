"""
Threat State Evaluator: Assesses detection counts and geofence events to classify threat level.
Perspective-aware: aerial domain uses airspace language; ground CCTV uses perimeter language.
"""

from datetime import datetime
from typing import List, Dict, Tuple
from app.core.constants import AlertLevel


class ThreatStateEvaluator:
    def __init__(self, multi_person_threshold: int = 2):
        self.multi_person_threshold = multi_person_threshold

    def evaluate(
        self,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Tuple[int, int, float]],
        frame_idx: int = 0,
        view_mode: str = "aerial"
    ) -> Tuple[str, str, Dict]:
        total_count = len(detected_persons)
        intruder_count = len(intruders)
        gathering_count = len(gatherings)
        is_ground = view_mode == "ground"

        threat_level = AlertLevel.CLEAR

        if is_ground:
            # Ground CCTV — perimeter domain language
            if intruder_count > 0:
                threat_level = AlertLevel.INTRUSION
                if intruder_count >= self.multi_person_threshold:
                    alert_msg = f"CRITICAL: {intruder_count} INTRUDERS IN RESTRICTED ZONE!"
                else:
                    alert_msg = f"WARNING: PERIMETER BREACH — {intruder_count} PERSON IN RESTRICTED ZONE"
            elif total_count >= self.multi_person_threshold:
                threat_level = AlertLevel.MULTI_PERSON
                alert_msg = f"ALERT: {total_count} PEOPLE ON CAMERA (GATHERING >= {self.multi_person_threshold})"
            elif total_count == 1:
                threat_level = AlertLevel.MONITORING
                alert_msg = "CCTV ACTIVE: 1 PERSON IN FRAME"
            else:
                alert_msg = "PERIMETER SECURE — NO TARGETS"
        else:
            # Aerial drone — airspace domain language
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
            else:
                alert_msg = "AIRSPACE SECURE — NO TARGETS"

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
