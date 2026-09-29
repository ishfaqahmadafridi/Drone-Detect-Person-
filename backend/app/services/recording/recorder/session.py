"""
Recording Session: State container representing an active video recording session.
"""

from dataclasses import dataclass
from typing import Optional


@dataclass
class RecordingSession:
    """Encapsulates metadata and active status for an ongoing video recording."""
    is_recording: bool = False
    active_view_mode: str = "aerial"
    active_threat_level: str = "MANUAL"
    filename: Optional[str] = None

    def start(self, view_mode: str, threat_level: str, filename: str) -> None:
        self.is_recording = True
        self.active_view_mode = view_mode
        self.active_threat_level = threat_level
        self.filename = filename

    def stop(self) -> None:
        self.is_recording = False
        self.filename = None
