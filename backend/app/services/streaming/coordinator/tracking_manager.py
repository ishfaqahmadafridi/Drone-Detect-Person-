"""
Target Tracking Manager: Encapsulates operator target designation, coordinate spatial matching,
and operational tracking modes (AUTO continuous detection vs MANUAL operator lock-on).
"""

from typing import List, Dict, Optional
from app.core.config import DetectionConfig
from app.services.streaming.telemetry_state import TelemetryStateStore


class TargetTrackingManager:
    """
    Manages operator manual targeting, target toggling, spatial click resolution,
    and synchronization with the telemetry state store.
    """

    def __init__(self, config: DetectionConfig, telemetry_store: TelemetryStateStore):
        self.config = config
        self.telemetry_store = telemetry_store

    def set_tracking_mode(self, mode: str, selected_ids: Optional[List[int]] = None) -> Dict:
        """
        Switches between AUTO and MANUAL target detection modes.
        In AUTO mode, all detected persons are automatically tracked and boxed.
        In MANUAL mode, only user-selected persons are boxed and tracked.
        """
        normalized_mode = mode.lower().strip()
        if normalized_mode not in ("auto", "manual"):
            normalized_mode = "auto"

        self.config.tracking_mode = normalized_mode
        if normalized_mode == "auto":
            self.config.selected_target_ids = []
        elif selected_ids is not None:
            self.config.selected_target_ids = [int(i) for i in selected_ids]

        self.telemetry_store.update(
            tracking_mode=normalized_mode,
            selected_target_ids=self.config.selected_target_ids
        )
        return {
            "status": "ok",
            "mode": normalized_mode,
            "selected_ids": self.config.selected_target_ids
        }

    def select_target(
        self,
        x: Optional[float] = None,
        y: Optional[float] = None,
        target_id: Optional[int] = None
    ) -> Dict:
        """
        Designates or toggles a specific target in manual mode by click coordinate or ID.
        """
        self.config.tracking_mode = "manual"
        toggled_id = None

        if target_id is not None:
            toggled_id = int(target_id)
        elif x is not None and y is not None:
            toggled_id = self._match_target_by_coordinate(x, y)

        if toggled_id is not None:
            current_selected = set(self.config.selected_target_ids)
            if toggled_id in current_selected:
                current_selected.remove(toggled_id)
            else:
                current_selected.add(toggled_id)
            self.config.selected_target_ids = sorted(list(current_selected))

        self.telemetry_store.update(
            tracking_mode="manual",
            selected_target_ids=self.config.selected_target_ids
        )
        return {
            "status": "ok",
            "mode": "manual",
            "selected_ids": self.config.selected_target_ids,
            "toggled_id": toggled_id
        }

    def _match_target_by_coordinate(self, x: float, y: float) -> Optional[int]:
        """
        Maps normalized click coordinates [0.0 - 1.0] to default frame resolution [1280x720]
        and identifies the matching or nearest detected person bounding box.
        """
        px = float(x) * 1280.0
        py = float(y) * 720.0
        latest_detections = self.telemetry_store.latest.get("detections", [])

        best_match_id = None
        min_dist = float("inf")

        for det in latest_detections:
            bbox = det.get("bbox", [0, 0, 0, 0])
            x1, y1, x2, y2 = bbox

            # Check if clicked inside bounding box with margin
            if (x1 - 35) <= px <= (x2 + 35) and (y1 - 35) <= py <= (y2 + 35):
                return det.get("id")

            # Calculate distance to bounding box centroid for proximity matching
            cx = (x1 + x2) / 2.0
            cy = (y1 + y2) / 2.0
            dist = ((px - cx) ** 2 + (py - cy) ** 2) ** 0.5
            if dist < 80 and dist < min_dist:
                min_dist = dist
                best_match_id = det.get("id")

        return best_match_id

    def clear_manual_targets(self) -> Dict:
        """
        Clears all selected targets in manual mode.
        """
        self.config.selected_target_ids = []
        self.telemetry_store.update(selected_target_ids=[])
        return {
            "status": "ok",
            "selected_ids": []
        }
