"""
Telemetry Formatter: Normalizes and structures detection telemetry payloads for WebSocket and UI distribution.
"""

from typing import Dict, List, Any, Optional


class TelemetryFormatter:
    """
    Transforms detection observations, zoning events, and avionics into unified telemetry payloads.
    """

    @staticmethod
    def format_detections(
        detected_persons: List[Dict],
        tracking_mode: str = "auto",
        selected_ids: Optional[List[int]] = None
    ) -> List[Dict[str, Any]]:
        """
        Extracts and normalizes per-target tracking metrics safely.
        """
        sanitized = []
        is_manual = tracking_mode == "manual"
        selected_set = set(selected_ids or [])
        for p in detected_persons:
            if not isinstance(p, dict):
                continue
            pid = p.get("id", -1)
            sanitized.append({
                "id": pid,
                "conf": round(float(p.get("conf", 0.0)), 2),
                "bbox": p.get("bbox", [0, 0, 0, 0]),
                "speed_px_s": round(float(p.get("speed_px_s", 0.0)), 1),
                "trajectory_len": len(p.get("trajectory", [])),
                "is_intruder": bool(p.get("is_intruder", False)),
                "is_selected": pid in selected_set if is_manual else True
            })
        return sanitized

    @classmethod
    def build_payload(
        cls,
        threat_level: str,
        alert_msg: str,
        detected_persons: List[Dict],
        intruders: List[Dict],
        fps: float,
        frame_idx: int,
        source_type: str,
        view_mode: str,
        confidence_threshold: float,
        zone_polygon: List[Any],
        avionics_snapshot: Optional[Dict[str, Any]] = None,
        tracking_mode: str = "auto",
        selected_target_ids: Optional[List[int]] = None,
        model_name: str = "",
        engine: str = ""
    ) -> Dict[str, Any]:
        """
        Assembles the comprehensive telemetry dictionary adhering to the UI contract.
        """
        selected_ids = selected_target_ids or []
        is_manual = tracking_mode == "manual"
        total_people = len(detected_persons)

        return {
            "threat_level": threat_level,
            "alert_msg": alert_msg,
            "total_persons": total_people,
            "intruders_count": len(intruders),
            "fps": round(float(fps), 1),
            "frame_idx": int(frame_idx),
            "detections": cls.format_detections(
                detected_persons,
                tracking_mode=tracking_mode,
                selected_ids=selected_ids
            ),
            "source_type": source_type,
            "view_mode": view_mode,
            "model_name": model_name,
            "engine": engine,
            "confidence_threshold": round(float(confidence_threshold), 2),
            "zone_polygon": zone_polygon,
            "avionics": avionics_snapshot or {},
            "tracking_mode": tracking_mode,
            "selected_target_ids": selected_ids
        }
