"""
Clip Capture Worker: Background asynchronous worker for capturing automated threat clips.
"""

import time
import threading
from typing import Callable


class ClipCaptureWorker:
    """Spawns an asynchronous thread to capture a fixed-duration video evidence clip."""

    @staticmethod
    def spawn_clip_task(
        start_fn: Callable[[], str],
        stop_fn: Callable[[], None],
        duration_seconds: float = 4.0,
    ) -> threading.Thread:
        """
        Runs start_fn, sleeps for duration_seconds, and calls stop_fn in a daemon thread.
        """
        def _task():
            try:
                start_fn()
                time.sleep(duration_seconds)
            finally:
                stop_fn()

        thread = threading.Thread(target=_task, daemon=True)
        thread.start()
        return thread
