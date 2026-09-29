"""
Video Codec Negotiator: Selects and validates platform-compatible video codecs.
"""

from typing import Tuple
import cv2


class VideoCodecNegotiator:
    """
    Selects compatible OpenCV FourCC codecs for MP4 video containers with graceful fallback.
    """

    @staticmethod
    def create_writer(
        filepath: str,
        fps: float,
        resolution: Tuple[int, int],
    ) -> Tuple[cv2.VideoWriter, str]:
        """
        Attempt to create an OpenCV VideoWriter prioritizing H.264 (avc1, H264)
        for native browser HTML5 playback, falling back to mp4v then MJPG.
        """
        # 1. Primary: avc1 (H.264 - native browser playback on Chrome, Safari, Firefox)
        try:
            fourcc_avc1 = cv2.VideoWriter_fourcc(*"avc1")
            writer = cv2.VideoWriter(filepath, fourcc_avc1, fps, resolution)
            if writer.isOpened():
                return writer, "avc1"
        except Exception:
            pass

        # 2. Secondary: H264
        try:
            fourcc_h264 = cv2.VideoWriter_fourcc(*"H264")
            writer = cv2.VideoWriter(filepath, fourcc_h264, fps, resolution)
            if writer.isOpened():
                return writer, "H264"
        except Exception:
            pass

        # 3. Fallback: mp4v
        try:
            fourcc_mp4v = cv2.VideoWriter_fourcc(*"mp4v")
            writer = cv2.VideoWriter(filepath, fourcc_mp4v, fps, resolution)
            if writer.isOpened():
                return writer, "mp4v"
        except Exception:
            pass

        # 4. Universal fallback: MJPG
        fourcc_mjpg = cv2.VideoWriter_fourcc(*"MJPG")
        writer = cv2.VideoWriter(filepath, fourcc_mjpg, fps, resolution)
        return writer, "MJPG"
