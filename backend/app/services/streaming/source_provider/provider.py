"""
StreamSourceProvider: Senior-level unified coordinator for video stream acquisition.
"""

from typing import List, Optional, Tuple
import numpy as np

from app.core.config import SYNTHETIC_VIDEO_PATH
from app.services.streaming.source_factory import SourceFactory
from app.services.streaming.sources import SyntheticFrameSource
from app.services.streaming.source_provider.config import StreamSourceConfig
from app.services.streaming.source_provider.state import SourceState
from app.services.streaming.source_provider.fallback_handler import FallbackHandler
from app.services.streaming.source_provider.source_switcher import SourceSwitcher


class StreamSourceProvider:
    """
    Facade managing video frame source lifecycle, hot-swapping, and fallback.

    Responsibilities:
      - Initialise and hot-swap BaseFrameSource instances via SourceSwitcher.
      - Propagate view-mode changes across synthetic sources via FallbackHandler.
      - Gracefully fall back to simulation on hardware/network failure.
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

        self._state = SourceState(
            initial_type=self.config.default_source_type,
            initial_path=self.config.default_path,
            initial_view="aerial",
        )

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

        self._fallback_handler = FallbackHandler(
            fallback_source=self._fallback_source,
            state=self._state,
        )

        self._switcher = SourceSwitcher(
            factory=self._factory,
            state=self._state,
        )

        self._switcher.switch(self._state.source_type, self._state.source_path)

    # ------------------------------------------------------------------
    # Properties
    # ------------------------------------------------------------------

    @property
    def source_type(self) -> str:
        return self._state.source_type

    @property
    def source_path(self) -> str:
        return self._state.source_path

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def set_source(self, source_type: str, source_path: Optional[str] = None, transport: str = "tcp") -> None:
        """Hot-swap active stream source. Falls back to synthetic on invalid input."""
        resolved_path = source_path or self.config.default_path
        self._switcher.switch(source_type, resolved_path, transport=transport)

    def set_view_mode(self, view_mode: str) -> str:
        """Persist perspective and propagate to all simulation sources."""
        return self._fallback_handler.sync_view_mode(view_mode)

    def get_simulated_targets(self) -> List[dict]:
        """Retrieve ground-truth targets from the current simulation source."""
        return self._fallback_handler.get_simulated_targets()

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """
        Read the next frame from the active source.
        Automatically falls back to simulation if hardware/network drops.
        """
        return self._fallback_handler.read_frame()

    def close(self) -> None:
        """Release all capture handles cleanly."""
        self._fallback_handler.release_all()
