"""
Alert Service Entrypoint & Backward-Compatible Facade.
Canonical implementation is now organized in app.services.alert.
"""

from app.services.alert import (
    AlertLevel,
    ThreatStateEvaluator,
    EvidenceRecorder,
    AlertManagerService,
)

__all__ = [
    "AlertLevel",
    "ThreatStateEvaluator",
    "EvidenceRecorder",
    "AlertManagerService",
]
