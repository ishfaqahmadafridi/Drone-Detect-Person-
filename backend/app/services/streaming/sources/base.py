"""
Abstract Base Frame Source for AERO-GUARD video feeds.
"""

from abc import ABC, abstractmethod
from typing import Tuple, Optional
import numpy as np


class BaseFrameSource(ABC):
    """
    Standard interface for all video frame acquisition sources.
    """
    @abstractmethod
    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """
        Reads and returns the next frame.
        Returns:
            Tuple of (success: bool, frame: Optional[np.ndarray])
        """
        pass

    @abstractmethod
    def release(self) -> None:
        """
        Releases underlying hardware, file, or network handles.
        """
        pass

    @property
    def is_active(self) -> bool:
        return True
