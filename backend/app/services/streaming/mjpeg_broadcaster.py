"""
MJPEG Frame Encoder & Multipart Stream Broadcaster.
"""

from typing import Optional, Generator
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

class MjpegBroadcaster:
    """
    Encodes annotated BGR video frames into optimized JPEG buffers and formats multipart MJPEG chunks.
    """
    def __init__(self, jpeg_quality: int = 80):
        self.jpeg_quality = jpeg_quality

    def encode_frame(self, frame: np.ndarray) -> Optional[bytes]:
        """
        Encodes a single BGR frame into JPEG bytes.
        """
        if cv2 is None or frame is None:
            return None
        
        try:
            ret, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, self.jpeg_quality])
            if not ret:
                return None
            return buffer.tobytes()
        except Exception as e:
            print(f"[MJPEG_BROADCASTER] Frame encode error: {e}")
            return None

    def format_mjpeg_chunk(self, frame_bytes: bytes) -> bytes:
        """
        Formats raw JPEG bytes into standard multipart HTTP stream chunk.
        """
        return (
            b'--frame\r\n'
            b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n'
        )
