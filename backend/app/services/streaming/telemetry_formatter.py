"""
Telemetry Formatter: Normalizes and structures detection telemetry payloads for WebSocket and UI distribution.
"""

from typing import Dict, List, Any, Optional


class TelemetryFormatter:
    """
    Transforms detection observations, zoning events, and avionics into unified telemetry payloads.
    """

    @staticmethod
    def format_detections(detected_persons: List[Dict]) -> List[Dict[str, Any]]:
        """
        Extracts and normalizes per-target tracking metrics safely.
        """
        sanitized = []
        for p in detected_persons:
            if not isinstance(p, dict):
                continue
            sanitized.append({
                "id": p.get("id", -1),
                "conf": round(float(p.get("conf", 0.0)), 2),
                "bbox": p.get("bbox", [0, 0, 0, 0]),
                "speed_px_s": round(float(p.get("speed_px_s", 0.0)), 1),
                "trajectory_len": len(p.get("trajectory", [])),
                "is_intruder": bool(p.get("is_intruder", False))
            })
        return sanitized

    @classmethod
    def build_payload(
        cls,
        threat_level: str,
        alert_msg: str,
        detected_persons: List[Dict],
        intruders: List[Dict],
        gatherings: List[Any],
        fps: float,
        frame_idx: int,
        source_type: str,
        view_mode: str,
        multi_person_threshold: int,
        confidence_threshold: float,
        proximity_distance_px: int,
        zone_polygon: List[Any],
        avionics_snapshot: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Assembles the comprehensive telemetry dictionary adhering to the UI contract.
        """
        return {
            "threat_level": threat_level,
            "alert_msg": alert_msg,
            "total_persons": len(detected_persons),
            "intruders_count": len(intruders),
            "gathering_pairs": len(gatherings),
            "fps": round(float(fps), 1),
            "frame_idx": int(frame_idx),
            "detections": cls.format_detections(detected_persons),
            "source_type": source_type,
            "view_mode": view_mode,
            "multi_person_threshold": multi_person_threshold,
            "confidence_threshold": round(float(confidence_threshold), 2),
            "proximity_distance_px": proximity_distance_px,
            "zone_polygon": zone_polygon,
            "avionics": avionics_snapshot or {}
        }
