"""
StreamSourceProvider Package: Modular frame acquisition, lifecycle management, and fallback.
"""

from app.services.streaming.source_provider.config import StreamSourceConfig
from app.services.streaming.source_provider.state import SourceState
from app.services.streaming.source_provider.fallback_handler import FallbackHandler
from app.services.streaming.source_provider.source_switcher import SourceSwitcher
from app.services.streaming.source_provider.provider import StreamSourceProvider

__all__ = [
    "StreamSourceConfig",
    "SourceState",
    "FallbackHandler",
    "SourceSwitcher",
    "StreamSourceProvider",
]
