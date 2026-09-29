"""
Video File Path Resolver: Deterministic naming and filesystem path generation for recordings.
"""

import os
from datetime import datetime
from typing import Tuple


class VideoFilePathResolver:
    """
    Computes standardized, timestamped filenames and verifies storage directories
    for tactical video containers.
    """

    @staticmethod
    def resolve_recording_path(recordings_dir: str, view_mode: str = "aerial") -> Tuple[str, str]:
        """
        Create directory if needed and return (filename, absolute_filepath).
        Format: video_{aerial|ground}_{YYYYMMDD_HHMMSS}.mp4
        """
        os.makedirs(recordings_dir, exist_ok=True)
        timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        clean_view = str(view_mode).lower().strip()
        filename = f"video_{clean_view}_{timestamp_str}.mp4"
        filepath = os.path.join(recordings_dir, filename)
        return filename, filepath
