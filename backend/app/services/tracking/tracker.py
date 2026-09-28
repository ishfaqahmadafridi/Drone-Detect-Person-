"""
Target Tracker Engine: Multi-Object Track History & Velocity Vector Estimation.
"""

import time
import math
import threading
from typing import List, Dict, Optional, Tuple
from collections import defaultdict, deque


class TargetTrackerService:
    """
    Maintains persistent target trajectories, speeds, and TTL-based pruning.
    """
    def __init__(self, max_trajectory_points: int = 40, ttl_seconds: float = 30.0):
        self.max_trajectory_points = max_trajectory_points
        self.ttl_seconds = ttl_seconds
        self.trajectories = defaultdict(lambda: deque(maxlen=max_trajectory_points))
        self.last_seen = {}
        self.velocities = {}
        self.lock = threading.RLock()

    def update_tracks(
        self,
        detected_persons: List[Dict],
        timestamp: float = 0.0
    ) -> List[Dict]:
        """
        Enriches detected persons with historical trajectory and velocity vector.
        """
        now = timestamp if timestamp > 0 else time.time()
        with self.lock:
            # Housekeeping: prune old tracks exceeding TTL
            stale_ids = [tid for tid, seen in self.last_seen.items() if (now - seen) > self.ttl_seconds]
            for tid in stale_ids:
                self.trajectories.pop(tid, None)
                self.last_seen.pop(tid, None)
                self.velocities.pop(tid, None)

            enriched = []
            for person in detected_persons:
                track_id = person.get("track_id", person.get("id"))
                cx, cy = person.get("center", (0, 0))
                foot_point = (cx, person.get("bbox", [0, 0, 0, 0])[3])

                history = self.trajectories[track_id]
                prev_foot = history[-1] if len(history) > 0 else None
                dt = now - self.last_seen.get(track_id, now)

                # Velocity estimate in px/sec
                if prev_foot and dt > 0.01:
                    dx = foot_point[0] - prev_foot[0]
                    dy = foot_point[1] - prev_foot[1]
                    dist = math.hypot(dx, dy)
                    speed_px_s = dist / dt
                    self.velocities[track_id] = round(speed_px_s, 1)
                else:
                    self.velocities[track_id] = self.velocities.get(track_id, 0.0)

                history.append(foot_point)
                self.last_seen[track_id] = now

                person_copy = dict(person)
                person_copy["trajectory"] = list(history)
                person_copy["speed_px_s"] = self.velocities[track_id]
                enriched.append(person_copy)

            return enriched

    def reset(self):
        with self.lock:
            self.trajectories.clear()
            self.last_seen.clear()
            self.velocities.clear()


# Subsystem singleton
tracking_service = TargetTrackerService()
