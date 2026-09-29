"""
Pre-Roll Frame Buffer: Thread-safe circular buffer preserving recent tactical frames.
"""

import threading
from collections import deque
from typing import List, Tuple
import numpy as np


class PreRollBuffer:
    """
    Circular memory buffer holding rolling pre-event tactical video frames
    to ensure threat triggers and recordings capture leading context.
    """

    def __init__(self, fps: float = 25.0, pre_roll_seconds: float = 3.0):
        self.fps = fps
        self.max_len = max(1, int(fps * pre_roll_seconds))
        self._lock = threading.Lock()
        self._buffer: deque = deque(maxlen=self.max_len)

    def append(self, frame: np.ndarray, view_mode: str = "aerial") -> None:
        """Push a newly processed frame into the rolling pre-roll buffer."""
        if frame is None:
            return
        with self._lock:
            self._buffer.append((frame.copy(), view_mode))

    def get_frames(self) -> List[Tuple[np.ndarray, str]]:
        """Retrieve snapshot of all stored frames in chronological order."""
        with self._lock:
            return list(self._buffer)

    def clear(self) -> None:
        """Clear all buffered frames."""
        with self._lock:
            self._buffer.clear()

    def __len__(self) -> int:
        with self._lock:
            return len(self._buffer)
