"""
Avionics Syncer Stage: Synchronizes UAV flight physics, battery consumption, and telemetry metrics.
"""

from typing import List, Dict, Any
from app.services.streaming.drone_service import drone_avionics_service


class PipelineAvionicsSyncer:
    """
    Coordinates drone avionics physics updates and produces telemetry snapshots.
    """

    @staticmethod
    def sync(detected_persons: List[Dict], current_fps: float) -> Dict[str, Any]:
        """
        Updates flight simulation metrics and returns current telemetry snapshot.
        """
        is_detecting = len(detected_persons) > 0
        drone_avionics_service.update_physics(is_detecting=is_detecting, fps=current_fps)
        return drone_avionics_service.get_avionics_snapshot(fps=current_fps, detecting=is_detecting)
