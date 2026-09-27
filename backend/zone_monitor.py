"""
Legacy zone_monitor alias for backward compatibility.
Canonical service is located in app.services.zone_service.
"""
from app.services.zone_service import ZoneMonitorService as ZoneMonitor

__all__ = ["ZoneMonitor"]
