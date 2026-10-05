"""
API v1 Endpoints Package.
"""

# Router aggregation belongs in router.py; importing the ReID endpoints should
# not initialize unrelated video models or camera sources.

__all__ = [
    "alerts",
    "config",
    "drone",
    "evidence",
    "recordings",
    "snapshots",
    "stream",
    "ws",
    "reid",
]
