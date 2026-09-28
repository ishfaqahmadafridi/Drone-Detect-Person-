"""
Tracking Service Facade: Re-exports from app.services.tracking.
Preserves backward compatibility with legacy scripts and tests.
"""

from app.services.tracking import TargetTrackerService, tracking_service

__all__ = ["TargetTrackerService", "tracking_service"]
