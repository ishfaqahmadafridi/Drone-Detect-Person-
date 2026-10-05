"""
Pipeline Config Manager: Thread-safe runtime configuration updates and perspective view switching.
"""

import threading
from typing import List, Tuple, Optional
from app.core.config import DetectionConfig
from app.core.constants import MIN_ZONE_VERTICES


class PipelineConfigManager:
    """
    Manages detection configuration thresholds, polygon recalculations, and view mode transitions.
    """

    def __init__(
        self,
        config: DetectionConfig,
        detector,
        zone_monitor,
        alert_manager,
        lock: threading.Lock
    ):
        self.config = config
        self.detector = detector
        self.zone_monitor = zone_monitor
        self.alert_manager = alert_manager
        self._lock = lock

    def set_view(self, view_mode: str) -> str:
        """
        Thread-safely switches detection profile between aerial drone and ground CCTV.
        """
        with self._lock:
            return self.detector.set_view(view_mode)

    def update_config(
        self,
        conf_thresh: Optional[float] = None,
        zone_polygon: Optional[List[Tuple[float, float]]] = None
    ) -> None:
        """
        Thread-safely applies dynamic thresholds and geofence boundary coordinates.
        """
        with self._lock:
            if conf_thresh is not None:
                self.config.confidence_threshold = conf_thresh
            if zone_polygon is not None:
                if len(zone_polygon) >= MIN_ZONE_VERTICES:
                    self.config.default_zone_normalized = zone_polygon
                    self.zone_monitor.zone_polygon_normalized = zone_polygon
                    self.zone_monitor._recalculate_pixel_polygon()
                elif len(zone_polygon) == 0:
                    self.config.default_zone_normalized = []
                    self.zone_monitor.zone_polygon_normalized = []
                    self.zone_monitor._recalculate_pixel_polygon()
