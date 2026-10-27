"""Open and release capture handles, including scoped RTSP transport options."""
import os
from threading import RLock

try:
    import cv2
except ImportError:
    cv2 = None

from app.core.config import DEVICE_CAPTURE_BUFFER_SIZE, DEVICE_RTSP_TIMEOUT_US

_open_lock = RLock()
_OPTIONS_KEY = "OPENCV_FFMPEG_CAPTURE_OPTIONS"


def is_rtsp_source(source_path):
    return isinstance(source_path, str) and source_path.lower().startswith(("rtsp://", "rtsps://"))


def is_video_file(source_path):
    return (isinstance(source_path, str) and not source_path.isdigit()
            and not source_path.lower().startswith(("rtsp://", "rtsps://", "http://", "https://")))


def release_capture(capture):
    if capture is not None:
        try:
            capture.release()
        except Exception:
            pass


def open_capture(source_path, transport):
    if cv2 is None:
        return None
    cap_arg = int(source_path) if isinstance(source_path, str) and source_path.isdigit() else source_path
    capture = None
    # OpenCV reads process-wide FFmpeg options when constructing a capture.
    with _open_lock:
        network = is_rtsp_source(source_path)
        previous = os.environ.get(_OPTIONS_KEY)
        try:
            if network:
                os.environ[_OPTIONS_KEY] = f"rtsp_transport;{transport}|timeout;{DEVICE_RTSP_TIMEOUT_US}"
                capture = cv2.VideoCapture(cap_arg, cv2.CAP_FFMPEG)
            else:
                capture = cv2.VideoCapture(cap_arg)
            if not capture.isOpened():
                release_capture(capture)
                return None
            if network:
                capture.set(cv2.CAP_PROP_BUFFERSIZE, DEVICE_CAPTURE_BUFFER_SIZE)
            return capture
        except Exception:
            release_capture(capture)
            return None
        finally:
            if network:
                if previous is None:
                    os.environ.pop(_OPTIONS_KEY, None)
                else:
                    os.environ[_OPTIONS_KEY] = previous
