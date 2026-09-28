"""
StreamSourceProvider: Thread-safe lifecycle manager for video frame acquisition.

Delegates source construction to SourceFactory (no routing logic here).
Delegates frame reading to the active BaseFrameSource with automatic
simulation fallback on hardware/network failure.
"""

from dataclasses import dataclass
import threading
from typing import Optional, Tuple

import numpy as np

from app.core.config import SYNTHETIC_VIDEO_PATH
from app.services.streaming.source_factory import SourceFactory
from app.services.streaming.sources import (
    BaseFrameSource,
    SyntheticFrameSource,
)


@dataclass
class StreamSourceConfig:
    """Configuration tokens for streaming source acquisition and fallback."""
    default_source_type: str = "synthetic"
    default_path: str = SYNTHETIC_VIDEO_PATH
    webcam_device_id: str = "0"
    http_timeout_seconds: float = 2.5
    max_frame_width: int = 1280
    simulation_width: int = 1280
    simulation_height: int = 720
    simulation_num_people: int = 4
    simulation_frame_interval: float = 0.035


class StreamSourceProvider:
    """
    Manages the active video frame source lifecycle.

    Responsibilities:
      - Initialise and hot-swap BaseFrameSource instances.
      - Propagate view-mode changes to synthetic sources.
      - Gracefully fall back to simulation on hardware/network failure.

    Construction and source-type routing are delegated to SourceFactory.
    """

    def __init__(
        self,
        default_source_type: str = "synthetic",
        default_path: str = SYNTHETIC_VIDEO_PATH,
        config: Optional[StreamSourceConfig] = None,
    ) -> None:
        self.config = config or StreamSourceConfig(
            default_source_type=default_source_type,
            default_path=default_path,
        )
        self._source_type: str = self.config.default_source_type
        self._source_path: str = self.config.default_path
        self._lock = threading.Lock()

        # Shared simulation fallback — never released until close()
        self._fallback_source = SyntheticFrameSource(
            width=self.config.simulation_width,
            height=self.config.simulation_height,
            num_people=self.config.simulation_num_people,
            frame_interval_seconds=self.config.simulation_frame_interval,
        )
        self._factory = SourceFactory(
            fallback_source=self._fallback_source,
            http_timeout=self.config.http_timeout_seconds,
            max_frame_width=self.config.max_frame_width,
            blocked_device=self.config.webcam_device_id,
        )
        self._active_source: Optional[BaseFrameSource] = None
        self._switch_source(self._source_type, self._source_path)

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def source_type(self) -> str:
        with self._lock:
            return self._source_type

    @property
    def source_path(self) -> str:
        with self._lock:
            return self._source_path

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def set_source(self, source_type: str, source_path: Optional[str] = None) -> None:
        """Hot-swap active stream source. Falls back to synthetic on invalid input."""
        with self._lock:
            resolved_path = source_path or self.config.default_path
            self._source_type = source_type
            self._source_path = resolved_path
            self._switch_source(source_type, resolved_path)
            print(f"[SOURCE_PROVIDER] Switched → {self._source_type} ({self._source_path})")

    def set_view_mode(self, view_mode: str) -> str:
        """Propagate perspective change to synthetic simulation sources."""
        with self._lock:
            for src in (self._fallback_source, self._active_source):
                if src is not None and hasattr(src, "set_view_mode"):
                    src.set_view_mode(view_mode)
        return view_mode

    def get_simulated_targets(self) -> list:
        """Retrieve ground-truth targets from the current simulation source."""
        with self._lock:
            active = self._active_source
            fallback = self._fallback_source
        for src in (active, fallback):
            if src is not None and hasattr(src, "get_simulated_targets"):
                return src.get_simulated_targets()
        return []

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """
        Read the next frame from the active source.
        Automatically falls back to simulation if hardware/network drops.
        """
        with self._lock:
            active = self._active_source
            fallback = self._fallback_source

        if active is not None:
            ret, frame = active.read_frame()
            if ret and frame is not None:
                return True, frame

        return fallback.read_frame()

    def close(self) -> None:
        """Release all capture handles cleanly."""
        with self._lock:
            if self._active_source is not None:
                self._active_source.release()
                self._active_source = None
            self._fallback_source.release()

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _switch_source(self, source_type: str, source_path: str) -> None:
        """Release previous source and build the new one via SourceFactory."""
        if self._active_source is not None:
            self._active_source.release()
            self._active_source = None

        new_source, effective_type = self._factory.build(source_type, source_path)
        self._active_source = new_source
        self._source_type = effective_type
