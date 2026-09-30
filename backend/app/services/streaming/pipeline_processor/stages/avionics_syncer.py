"""
Avionics Syncer Stage: Synchronizes UAV flight physics, battery consumption, and telemetry metrics.
Perspective-gated: drone physics only advance in `aerial` mode. Ground CCTV mode returns an empty dict.
"""

from typing import List, Dict, Any
from app.services.streaming.drone_service import drone_avionics_service


class PipelineAvionicsSyncer:
    """
    Coordinates drone avionics physics updates and produces telemetry snapshots.
    Strictly coupled to the active perspective view — aerial data is never injected into
    ground CCTV payloads.
    """

    @staticmethod
    def sync(
        detected_persons: List[Dict],
        current_fps: float,
        active_view: str = "aerial"
    ) -> Dict[str, Any]:
        """
        Updates flight simulation metrics and returns current avionics telemetry snapshot.

        Args:
            detected_persons: List of currently tracked person detections.
            current_fps: Current pipeline throughput FPS.
            active_view: Perspective mode — 'aerial' (UAV) or 'ground' (CCTV).
                         Ground mode skips physics updates and returns an empty dict
                         so no drone data leaks into the perimeter CCTV telemetry payload.
        """
        if active_view != "aerial":
            # Ground CCTV perspective: suppress all UAV avionics.
            # No battery drain, no altitude ticks, no drone snapshot.
            return {}

        is_detecting = len(detected_persons) > 0
        drone_avionics_service.update_physics(is_detecting=is_detecting, fps=current_fps)
        return drone_avionics_service.get_avionics_snapshot(fps=current_fps, detecting=is_detecting)
