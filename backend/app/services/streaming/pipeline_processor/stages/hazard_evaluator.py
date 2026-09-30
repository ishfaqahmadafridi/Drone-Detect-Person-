"""
Hazard Evaluator Stage: Spatial hazard evaluation, geofence breaches, and gatherings.
"""

from typing import List, Dict, Tuple, Any, Set


class PipelineHazardEvaluator:
    """
    Evaluates perimeter boundary breaches and proximity-based clustering hazards.
    """

    @staticmethod
    def evaluate(
        zone_monitor,
        detected_persons: List[Dict],
        proximity_distance_px: int
    ) -> Tuple[List[Dict], List[Any], Set[int]]:
        """
        Calculates perimeter breaches and proximity-based gathering clusters.
        """
        intruders = zone_monitor.check_intrusions(detected_persons)
        gatherings, clustered_ids = zone_monitor.compute_gatherings(
            detected_persons,
            proximity_threshold_px=proximity_distance_px
        )
        return intruders, gatherings, clustered_ids
