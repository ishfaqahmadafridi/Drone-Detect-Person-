"""
Pipeline Models: Data transfer schemas and execution results for video processing pipeline.
"""

from dataclasses import dataclass, field
from typing import List, Dict, Any
import numpy as np
from app.core.constants import DEFAULT_FRAME_WIDTH, DEFAULT_FRAME_HEIGHT, DEFAULT_CONFIDENCE_THRESHOLD


@dataclass
class FrameAnalysis:
    """Detection and threat state passed to rendering and telemetry stages."""
    detected_persons: List[Dict]
    pending_persons: List[Dict]
    intruders: List[Dict]
    threat_level: str
    alert_msg: str
    details: Dict[str, Any]
    tracking_mode: str
    selected_ids: List[int]


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
    details: Dict[str, Any] = field(default_factory=dict)
    snapshot_filepath: str | None = None

    @classmethod
    def empty_fallback(cls, frame: np.ndarray, source_type: str = "synthetic", view_mode: str = "aerial") -> "PipelineResult":
        """
        Generates a safe fallback result when a frame is corrupt or pipeline encounters transient errors.
        Guarantees all expected telemetry keys are present.
        """
        if frame is not None and isinstance(frame, np.ndarray) and getattr(frame, "size", 0) > 0 and len(frame.shape) == 3:
            fallback_frame = frame
        else:
            fallback_frame = np.zeros((DEFAULT_FRAME_HEIGHT, DEFAULT_FRAME_WIDTH, 3), dtype=np.uint8)
        return cls(
            annotated_frame=fallback_frame,
            telemetry_payload={
                "threat_level": "CLEAR",
                "alert_msg": "FRAME DROP / STANDBY",
                "total_persons": 0,
                "intruders_count": 0,
                "fps": 0.0,
                "frame_idx": 0,
                "detections": [],
                "source_type": source_type,
                "view_mode": view_mode,
                "model_name": "",
                "engine": "",
                "confidence_threshold": DEFAULT_CONFIDENCE_THRESHOLD,
                "zone_polygon": [],
                "avionics": {},
                "tracking_mode": "auto",
                "selected_target_ids": [],
            },
            threat_level="CLEAR",
            alert_msg="FRAME DROP / STANDBY",
            detected_persons=[],
            intruders=[]
        )
