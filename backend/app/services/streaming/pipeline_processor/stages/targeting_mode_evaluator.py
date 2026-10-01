"""
Targeting Mode Evaluator Stage: Resolves alert messages and threat overrides for operator-designated targets.
"""

from typing import Tuple, List, Optional
from app.core.config import DetectionConfig


class TargetingModeEvaluator:
    """
    Evaluates manual operator lock-on vs automatic multi-target tracking modes.
    """

    @staticmethod
    def evaluate_mode(
        config: DetectionConfig,
        default_threat_level: str,
        default_alert_msg: str
    ) -> Tuple[str, str, str, List[int]]:
        """
        Returns (threat_level, alert_msg, tracking_mode, selected_ids).
        """
        tracking_mode = getattr(config, "tracking_mode", "auto")
        selected_ids = getattr(config, "selected_target_ids", []) or []

        if tracking_mode == "manual":
            threat_level = "MANUAL" if selected_ids else "CLEAR"
            if not selected_ids:
                alert_msg = "MANUAL MODE: CLICK PERSON TO LOCK TARGET"
            else:
                target_word = "TARGET" if len(selected_ids) == 1 else "TARGETS"
                alert_msg = f"MANUAL MODE: {len(selected_ids)} {target_word} LOCKED"
            return threat_level, alert_msg, tracking_mode, selected_ids

        return default_threat_level, default_alert_msg, tracking_mode, selected_ids
