"""
Pipeline Models: Data transfer schemas and execution results for video processing pipeline.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any
import numpy as np


@dataclass
class PipelineResult:
    """
    Structured outcome of a processed computer vision frame.
    """
    annotated_frame: np.ndarray
    telemetry_payload: Dict[str, Any]
    threat_level: str
    alert_msg: str
    detected_persons: List[Dict] = field(default_factory=list)
    intruders: List[Dict] = field(default_factory=list)

    @classmethod
    def empty_fallback(cls, frame: np.ndarray, source_type: str = "synthetic", view_mode: str = "aerial") -> "PipelineResult":
        """
        Generates a safe fallback result when a frame is corrupt or pipeline encounters transient errors.
        """
        if frame is not None and isinstance(frame, np.ndarray) and getattr(frame, "size", 0) > 0 and len(frame.shape) == 3:
            fallback_frame = frame
        else:
            fallback_frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        return cls(
            annotated_frame=fallback_frame,
            telemetry_payload={
                "threat_level": "CLEAR",
                "alert_msg": "FRAME DROP / STANDBY",
                "total_persons": 0,
                "intruders_count": 0,
                "gathering_pairs": 0,
                "fps": 0.0,
                "frame_idx": 0,
                "detections": [],
                "source_type": source_type,
                "view_mode": view_mode,
            },
            threat_level="CLEAR",
            alert_msg="FRAME DROP / STANDBY",
            detected_persons=[],
            intruders=[]
        )
