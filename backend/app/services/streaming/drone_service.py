"""
Drone Avionics Service: Real-time Flight State Engine, Battery Health Monitor, and Mission Commander.
"""

import time
import math
import threading
from typing import Dict, Any

class DroneAvionicsManager:
    """
    Simulates real-world drone telemetry, 6S LiPo smart battery health management,
    and mission waypoint/flight-mode transitions.
    """
    def __init__(self):
        self._lock = threading.RLock()
        self.flight_state: str = "AIRBORNE"
        self.battery_percent: float = 88.0
        self.battery_health: int = 98
        self.battery_temp_c: float = 34.2
        self.altitude_m: float = 42.5
        self.target_altitude_m: float = 45.0
        self.ground_speed_ms: float = 8.4
        self.gps_sats: int = 16
        self.gps_fix: str = "3D RTK DUAL-BAND"
        self.compass_heading_deg: int = 42
        self.link_quality_percent: int = 99
        self.camera_online: bool = True
        self.camera_resolution: str = "1280x720 (HD)"
        self.camera_sensor_temp_c: float = 41.5
        self.last_update_time: float = time.time()

    def update_physics(self, is_detecting: bool = True, fps: float = 25.0):
        """
        Advances avionics telemetry physics and battery consumption cycles.
        """
        now = time.time()
        dt = min(now - self.last_update_time, 1.0)
        self.last_update_time = now

        with self._lock:
            # Battery consumption
            drain_rate = 0.015 if self.flight_state in ["AIRBORNE", "PATROL"] else 0.005
            self.battery_percent = max(0.0, self.battery_percent - (drain_rate * dt))

            # Altitude transition physics
            alt_diff = self.target_altitude_m - self.altitude_m
            if abs(alt_diff) > 0.1:
                self.altitude_m += math.copysign(min(abs(alt_diff), 3.0 * dt), alt_diff)
                if self.altitude_m <= 0.5 and self.flight_state == "RTL":
                    self.flight_state = "LANDED"
                    self.altitude_m = 0.0
                    self.ground_speed_ms = 0.0

            # Compass slow drift during patrol
            if self.flight_state in ["AIRBORNE", "PATROL"]:
                self.compass_heading_deg = (self.compass_heading_deg + 1) % 360

            # Camera telemetry
            self.camera_online = True
            self.camera_sensor_temp_c = 40.0 + (self.battery_percent * 0.03)

    def execute_command(self, action: str, target_alt: float = None) -> Dict[str, Any]:
        """
        Executes tactical flight directives.
        """
        action_clean = action.lower().strip()
        with self._lock:
            if action_clean in ["takeoff", "launch"]:
                self.flight_state = "AIRBORNE"
                self.target_altitude_m = target_alt or 45.0
                self.ground_speed_ms = 7.5
                msg = f"Drone armed and launched to {self.target_altitude_m}m AGL."

            elif action_clean == "patrol":
                self.flight_state = "PATROL"
                self.target_altitude_m = 45.0
                self.ground_speed_ms = 9.2
                msg = "Autonomous perimeter surveillance patrol engaged."

            elif action_clean == "hover":
                self.flight_state = "HOVER"
                self.ground_speed_ms = 0.2
                msg = f"Station-keeping loiter activated at {self.altitude_m:.1f}m altitude."

            elif action_clean in ["rtl", "return_to_launch", "land"]:
                self.flight_state = "RTL"
                self.target_altitude_m = 0.0
                self.ground_speed_ms = 4.0
                msg = "Return to Launch (RTL) initiated. Descending safely to home base."

            elif action_clean == "connect_drone":
                self.flight_state = "STANDBY"
                msg = "Avionics telemetry link established with ground command."

            elif action_clean == "preset_gate":
                msg = "Perimeter security gate locked."

            elif action_clean == "preset_patrol":
                msg = "PTZ perimeter 360-degree sweep initiated."

            elif action_clean == "ir_filter":
                msg = "Optical IR cut filter toggled."

            elif action_clean == "reboot_sensor":
                msg = "Perimeter sensor PTZ alignment recalibrated."

            else:
                msg = f"Executed directive: {action}"

            return {
                "success": True,
                "message": msg,
                "flight_state": self.flight_state,
                "altitude_m": round(self.altitude_m, 1),
                "battery_percent": int(self.battery_percent)
            }

    def get_avionics_snapshot(self, fps: float = 25.0, detecting: bool = True) -> Dict[str, Any]:
        with self._lock:
            # 6S LiPo: 3.7V nominal to 4.2V max per cell (22.2V to 25.2V)
            v_cell = 3.6 + (self.battery_percent / 100.0) * 0.6
            voltage = round(v_cell * 6, 2)
            time_rem = int((self.battery_percent / 100.0) * 28)

            return {
                "flight_state": self.flight_state,
                "battery_percent": int(self.battery_percent),
                "battery_voltage": voltage,
                "battery_health_percent": self.battery_health,
                "battery_temp_c": round(self.battery_temp_c, 1),
                "flight_time_remaining_min": max(1, time_rem),
                "altitude_m": round(self.altitude_m, 1),
                "ground_speed_ms": round(self.ground_speed_ms, 1),
                "gps_sats": self.gps_sats,
                "gps_fix": self.gps_fix,
                "compass_heading_deg": self.compass_heading_deg,
                "link_quality_percent": self.link_quality_percent,
                "camera_online": self.camera_online,
                "camera_resolution": self.camera_resolution,
                "camera_fps": round(fps, 1),
                "camera_sensor_temp_c": round(self.camera_sensor_temp_c, 1),
                "camera_detecting": detecting
            }

# Singleton instance
drone_avionics_service = DroneAvionicsManager()
