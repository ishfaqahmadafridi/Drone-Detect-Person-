"""Person detection status and optional restricted-zone intrusion status."""
from datetime import datetime
from app.core.constants import AlertLevel


class ThreatStateEvaluator:
    def evaluate(self, detected_persons, intruders, frame_idx=0, view_mode="aerial"):
        count = len(detected_persons)
        if intruders:
            level = AlertLevel.INTRUSION
            message = f"RESTRICTED ZONE: {len(intruders)} PERSON(S)"
        elif count:
            level = AlertLevel.MONITORING
            message = f"{count} PERSON(S) DETECTED"
        else:
            level = AlertLevel.CLEAR
            message = "NO PERSONS DETECTED"
        return level, message, {
            "threat_level": level,
            "alert_message": message,
            "total_persons": count,
            "intruders_count": len(intruders),
            "person_ids": [person.get("id", -1) for person in detected_persons],
            "intruder_ids": [person.get("id", -1) for person in intruders],
            "frame_idx": frame_idx,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }
