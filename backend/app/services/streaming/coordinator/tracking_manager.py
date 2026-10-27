"""
Target Tracking Manager: Encapsulates operator target designation, coordinate spatial matching,
and operational tracking modes (AUTO continuous detection vs MANUAL operator lock-on).
"""

from typing import List, Dict, Optional
from app.core.config import DetectionConfig
from app.services.streaming.telemetry_state import TelemetryStateStore
from app.services.tracking.target_matching import match_normalized_target


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
        """Resolve operator coordinates against the current processed frame."""
        return match_normalized_target(x, y, self.telemetry_store.latest)

    def clear_manual_targets(self) -> Dict:
        """
        Clears all selected targets and reverts tracking mode to auto.
        """
        self.config.tracking_mode = "auto"
        self.config.selected_target_ids = []
        self.telemetry_store.update(tracking_mode="auto", selected_target_ids=[])
        return {
            "status": "ok",
            "mode": "auto",
            "selected_ids": []
        }
