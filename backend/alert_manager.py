"""
Legacy alert_manager alias for backward compatibility.
Canonical service is located in app.services.alert_service.
"""
from app.services.alert_service import AlertManagerService as AlertManager, AlertLevel

__all__ = ["AlertManager", "AlertLevel"]
