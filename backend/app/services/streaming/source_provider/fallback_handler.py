"""
FallbackHandler: Coordinates active source reading and graceful simulation fallback.
"""

from typing import List, Optional, Tuple
import numpy as np

from app.services.streaming.sources import BaseFrameSource, SyntheticFrameSource
from app.services.streaming.source_provider.state import SourceState


class FallbackHandler:
    """
    Guarantees uninterrupted frame delivery and target metadata by falling back
    to a permanent synthetic simulation source whenever the active hardware or
    network stream fails or disconnects.
    """

    def __init__(self, fallback_source: SyntheticFrameSource, state: SourceState) -> None:
        self._fallback = fallback_source
        self._state = state

    @property
    def fallback_source(self) -> SyntheticFrameSource:
        return self._fallback

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """
        Attempt to read from active source; seamlessly fallback to simulation on failure.
        """
        active = self._state.active_source
        if active is not None:
            try:
                ret, frame = active.read_frame()
                if ret and frame is not None:
                    return True, frame
            except Exception as exc:
                print(f"[FALLBACK_HANDLER] Active source read failed ({exc}) — falling back to simulation.")

        return self._fallback.read_frame()

    def get_simulated_targets(self) -> List[dict]:
        """Query targets from the active source or fallback simulation."""
        active = self._state.active_source
        for src in (active, self._fallback):
            if src is not None and hasattr(src, "get_simulated_targets"):
                return src.get_simulated_targets()
        return []

    def sync_view_mode(self, view_mode: str) -> str:
        """Propagate perspective change across both fallback and active sources."""
        self._state.update_view_mode(view_mode)
        active = self._state.active_source
        for src in (self._fallback, active):
            if src is not None and hasattr(src, "set_view_mode"):
                src.set_view_mode(view_mode)
        return view_mode

    def release_all(self) -> None:
        """Release active and fallback source resources cleanly."""
        with self._state.lock:
            active = self._state.active_source
            if active is not None:
                active.release()
            self._fallback.release()
