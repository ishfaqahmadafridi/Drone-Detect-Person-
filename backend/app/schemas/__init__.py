"""
Centralized Pydantic schemas for Drone-Detect-Person (AERO-GUARD).
"""

from app.schemas.alert import (
    IncidentAlertItem,
    AlertsListResponse,
    SnapshotItem,
    SnapshotsListResponse,
)
from app.schemas.config import (
    ConfigUpdateRequest,
    StreamSourceRequest,
    StreamTestConnectionResponse,
    TrackingModeRequest,
    TargetSelectRequest,
)
from app.schemas.drone import (
    DroneCommandRequest,
    DroneCommandResponse,
    DroneAvionicsData,
)
from app.schemas.telemetry import (
    DetectionItem,
    TelemetryPayload,
)
from app.schemas.evidence import (
    EvidenceRecordBase,
    EvidenceRecordCreate,
    EvidenceRecord,
    EvidenceListResponse,
)

__all__ = [
    "IncidentAlertItem",
    "AlertsListResponse",
    "SnapshotItem",
    "SnapshotsListResponse",
    "ConfigUpdateRequest",
    "StreamSourceRequest",
    "StreamTestConnectionResponse",
    "TrackingModeRequest",
    "TargetSelectRequest",
    "DroneCommandRequest",
    "DroneCommandResponse",
    "DroneAvionicsData",
    "DetectionItem",
    "TelemetryPayload",
    "EvidenceRecordBase",
    "EvidenceRecordCreate",
    "EvidenceRecord",
    "EvidenceListResponse",
]
