"""
Pydantic Schemas for Security Incidents and Evidence Snapshots.
"""

from typing import List, Dict, Any
from pydantic import BaseModel

class IncidentAlertItem(BaseModel):
    timestamp: str
    threat_level: str
    total_persons: str
    intruders_count: str
    gathering_clusters: str
    person_ids: str
    snapshot_path: str

class AlertsListResponse(BaseModel):
    total_alerts: int
    alerts: List[Dict[str, Any]]

class SnapshotItem(BaseModel):
    filename: str
    url: str
    created_at: str
    size_kb: float

class SnapshotsListResponse(BaseModel):
    snapshots: List[SnapshotItem]
