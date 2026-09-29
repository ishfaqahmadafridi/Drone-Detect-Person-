"""
SourceState: Thread-safe state container for active frame source metadata.
"""

import threading
from typing import Optional
from app.services.streaming.sources import BaseFrameSource


class SourceState:
    """Manages synchronized runtime state for the streaming subsystem."""

    def __init__(self, initial_type: str, initial_path: str, initial_view: str = "aerial") -> None:
        self._lock = threading.RLock()
        self._source_type: str = initial_type
        self._source_path: str = initial_path
        self._current_view_mode: str = initial_view
        self._active_source: Optional[BaseFrameSource] = None

    @property
    def lock(self) -> threading.Lock:
        return self._lock

    @property
    def source_type(self) -> str:
        with self._lock:
            return self._source_type

    @property
    def source_path(self) -> str:
        with self._lock:
            return self._source_path

    @property
    def current_view_mode(self) -> str:
        with self._lock:
            return self._current_view_mode

    @property
    def active_source(self) -> Optional[BaseFrameSource]:
        with self._lock:
            return self._active_source

    def set_active_source(self, source: Optional[BaseFrameSource], source_type: str, source_path: str) -> None:
        with self._lock:
            self._active_source = source
            self._source_type = source_type
            self._source_path = source_path

    def update_view_mode(self, view_mode: str) -> str:
        with self._lock:
            self._current_view_mode = view_mode
            return self._current_view_mode
