"""Guard operator targeting and synchronize selection observers."""
from fastapi import HTTPException


class TargetSelectionController:
    def __init__(self, tracking, selection):
        self.tracking = tracking
        self.selection = selection

    def _require_ground(self):
        if self.tracking.config.view_mode != "ground":
            raise HTTPException(409, "Manual suspect selection is ground-only.")

    def _notify(self):
        if self.selection.on_commit is not None:
            self.selection.on_commit(self.tracking.config.selected_target_ids)

    def set_tracking_mode(self, mode, selected_ids=None):
        with self.selection.lock:
            normalized = mode.lower().strip()
            if normalized == "manual":
                self._require_ground()
            result = self.tracking.set_tracking_mode(normalized, selected_ids)
            self._notify()
            return result

    def select_target(self, x=None, y=None, target_id=None):
        with self.selection.lock:
            self._require_ground()
            result = self.tracking.select_target(x=x, y=y, target_id=target_id)
            self._notify()
            return result

    def clear_manual_targets(self):
        with self.selection.lock:
            result = self.tracking.clear_manual_targets()
            self._notify()
            return result
