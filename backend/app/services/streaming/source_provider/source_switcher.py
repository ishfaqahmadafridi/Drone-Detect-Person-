"""
SourceSwitcher: Handles the hot-swapping lifecycle of BaseFrameSource instances.
"""

from app.services.streaming.source_factory import SourceFactory
from app.services.streaming.source_provider.state import SourceState


class SourceSwitcher:
    """Safely transitions between video stream sources without race conditions."""

    def __init__(self, factory: SourceFactory, state: SourceState) -> None:
        self._factory = factory
        self._state = state

    def switch(self, target_type: str, target_path: str) -> None:
        """
        Releases the old active source, constructs the new source via factory,
        applies the active perspective, and commits the state.
        """
        with self._state.lock:
            old_source = self._state.active_source
            if old_source is not None:
                try:
                    old_source.release()
                except Exception as exc:
                    print(f"[SOURCE_SWITCHER] Error releasing previous source: {exc}")

            new_source, effective_type = self._factory.build(target_type, target_path)

            # Persist perspective across source switches
            if hasattr(new_source, "set_view_mode"):
                new_source.set_view_mode(self._state.current_view_mode)

            self._state.set_active_source(new_source, effective_type, target_path)
            print(f"[SOURCE_SWITCHER] Switched → {effective_type} ({target_path})")
