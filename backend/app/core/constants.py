"""
Core Constants for Drone Aerial Surveillance & Intrusion Detection System.
"""

class AlertLevel:
    CLEAR = "CLEAR"               # 0 targets detected in airspace
    MONITORING = "MONITORING"     # 1 target detected (routine surveillance)
    MULTI_PERSON = "MULTI_PERSON" # >= 2 persons gathering / clustered
    INTRUSION = "INTRUSION"       # 1+ persons breaching restricted polygon perimeter

DEFAULT_ZONE_POLYGON = [
    (0.25, 0.25),
    (0.75, 0.25),
    (0.75, 0.75),
    (0.25, 0.75),
]
