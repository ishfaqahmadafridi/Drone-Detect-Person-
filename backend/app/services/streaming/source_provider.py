"""
Stream Source Provider: Manages dynamic video source acquisition, capture lifecycles, and in-memory fallback.
Delegates acquisition to modular BaseFrameSource implementations (HTTP, Device, Synthetic).
"""

from dataclasses import dataclass
import threading
from typing import Optional, Tuple
import numpy as np

from app.core.config import SYNTHETIC_VIDEO_PATH
from app.services.streaming.sources import (
    BaseFrameSource,
    HttpFrameSource,
    DeviceFrameSource,
    SyntheticFrameSource,
)


@dataclass
class StreamSourceConfig:
    """
    Configuration tokens for streaming source acquisition and fallback.
    """
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
    Encapsulates video frame acquisition across webcam, synthetic simulation, files, and RTSP streams.
    Provides robust, thread-safe fallback if any external capture hardware or network stream is unavailable.
    """
    def __init__(
        self,
        default_source_type: str = "synthetic",
        default_path: str = SYNTHETIC_VIDEO_PATH,
        config: Optional[StreamSourceConfig] = None
    ):
        self.config = config or StreamSourceConfig(
            default_source_type=default_source_type,
            default_path=default_path
        )
        self._source_type = default_source_type
        self._source_path = default_path
        self._lock = threading.Lock()
        
        self._active_source: Optional[BaseFrameSource] = None
        self._fallback_source = SyntheticFrameSource(
            width=self.config.simulation_width,
            height=self.config.simulation_height,
            num_people=self.config.simulation_num_people,
            frame_interval_seconds=self.config.simulation_frame_interval
        )
        self._initialize_source(self._source_type, self._source_path)

    @property
    def source_type(self) -> str:
        with self._lock:
            return self._source_type

    @property
    def source_path(self) -> str:
        with self._lock:
            return self._source_path

    def _initialize_source(self, source_type: str, source_path: str):
        if self._active_source is not None:
            self._active_source.release()
            self._active_source = None

        if source_type == "synthetic":
            self._active_source = self._fallback_source
        elif isinstance(source_path, str) and (source_path.startswith("http://") or source_path.startswith("https://")):
            self._active_source = HttpFrameSource(
                url=source_path,
                timeout_seconds=self.config.http_timeout_seconds,
                max_width=self.config.max_frame_width
            )
        else:
            self._active_source = DeviceFrameSource(source_path=source_path)

    def set_source(self, source_type: str, source_path: Optional[str] = None):
        """
        Dynamically changes active stream source and invalidates current capture handle.
        """
        with self._lock:
            self._source_type = source_type
            if source_type == "synthetic":
                self._source_path = self.config.default_path
            elif source_type == "webcam":
                self._source_path = self.config.webcam_device_id
            elif source_type in ["file", "rtsp"] and source_path:
                self._source_path = source_path
            
            self._initialize_source(self._source_type, self._source_path)
            print(f"[SOURCE_PROVIDER] Switched source to: {self._source_type} ({self._source_path})")

    def read_frame(self) -> Tuple[bool, Optional[np.ndarray]]:
        """
        Reads next frame from current active source.
        Automatically falls back to in-memory simulation if hardware/network stream drops.
        """
        with self._lock:
            active_src = self._active_source
            fallback_src = self._fallback_source

        if active_src is not None:
            ret, frame = active_src.read_frame()
            if ret and frame is not None:
                return True, frame

        # Graceful fallback to synthetic simulation stream
        return fallback_src.read_frame()

    def close(self):
        """
        Releases capture resources safely.
        """
        with self._lock:
            if self._active_source is not None:
                self._active_source.release()
                self._active_source = None
            if self._fallback_source is not None:
                self._fallback_source.release()
