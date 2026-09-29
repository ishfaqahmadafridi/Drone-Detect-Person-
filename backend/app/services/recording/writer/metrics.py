"""
Recording Metrics Calculator: Computes elapsed duration and disk file size for finalized videos.
"""

import os
import time
from typing import Optional, Tuple


class RecordingMetricsCalculator:
    """
    Measures duration and file storage metrics for finished evidentiary recordings.
    """

    @staticmethod
    def calculate(start_time: float, filepath: Optional[str]) -> Tuple[float, float]:
        """
        Calculate total recording duration in seconds and file size in Kilobytes.
        Returns: (duration_seconds, file_size_kb)
        """
        duration = max(0.1, round(time.time() - start_time, 1))
        size_kb = 0.0

        if filepath and os.path.exists(filepath):
            try:
                size_kb = round(os.path.getsize(filepath) / 1024, 1)
            except OSError:
                size_kb = 0.0

        return duration, size_kb
