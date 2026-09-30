"""
Target Tracker Stage: Object detection and multi-target tracking.
"""

from typing import List, Dict, Optional
import numpy as np


class PipelineTargetTracker:
    """
    Executes neural network target detection and multi-object tracking.
    In synthetic simulation mode, provides ground-truth simulation targets so that
    every human is enclosed within an accurate bounding box.
    """

    @staticmethod
    def detect_and_track(
        detector,
        frame: np.ndarray,
        sim_targets: Optional[List[Dict]] = None
    ) -> List[Dict]:
        """
        Executes detector or returns simulated coordinates in synthetic mode.
        """
        if sim_targets:
            if hasattr(detector, "_profiler") and detector._profiler:
                detector._profiler.tick()
            return sim_targets

        return detector.process_frame(frame, use_tracking=True)
