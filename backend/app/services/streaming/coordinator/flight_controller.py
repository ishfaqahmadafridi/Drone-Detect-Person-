"""
Drone Flight Controller: Dispatches drone flight commands and syncs avionics telemetry.
"""

from typing import Dict, Optional

from app.services.streaming.drone_service import drone_avionics_service
from app.services.streaming.telemetry_state import TelemetryStateStore


class DroneFlightController:
    """
    Handles UAV flight directives (takeoff, hover, patrol, RTL) and telemetry store synchronizations.
    """

    def __init__(self, telemetry_store: TelemetryStateStore):
        self.telemetry_store = telemetry_store

    def execute_command(self, action: str, target_alt: Optional[float] = None) -> Dict:
        """
        Transmits tactical flight directive to drone avionics subsystem.
        """
        res = drone_avionics_service.execute_command(action, target_alt)
        snapshot = drone_avionics_service.get_avionics_snapshot()
        self.telemetry_store.update(avionics=snapshot)
        return res
