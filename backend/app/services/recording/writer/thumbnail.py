"""
Companion Thumbnail Generator: Creates synchronized preview thumbnails for video captures.
"""

import os
from datetime import datetime
from typing import Optional
import cv2
import numpy as np


class CompanionThumbnailGenerator:
    """
    Generates and persists synchronized companion JPEG preview thumbnails for recorded video clips.
    """

    def __init__(self, snapshots_dir: str):
        self.snapshots_dir = snapshots_dir

    def generate(self, frame: np.ndarray, view_mode: str = "aerial") -> Optional[str]:
        """
        Save the given frame as a thumbnail JPEG file in the snapshots directory.
        Returns the absolute filepath of the generated thumbnail, or None on failure.
        """
        if frame is None:
            return None

        try:
            os.makedirs(self.snapshots_dir, exist_ok=True)
            timestamp_str = datetime.now().strftime("%Y%m%d_%H%M%S")
            clean_view = str(view_mode).lower().strip()
            thumb_name = f"thumb_{clean_view}_{timestamp_str}.jpg"
            thumb_path = os.path.join(self.snapshots_dir, thumb_name)
            cv2.imwrite(thumb_path, frame)
            return thumb_path
        except Exception as err:
            print(f"[THUMBNAIL_GENERATOR] Failed to generate thumbnail: {err}")
            return None
