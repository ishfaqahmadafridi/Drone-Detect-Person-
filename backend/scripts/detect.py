"""
Main Real-time Drone Aerial Person & Multi-Person Intrusion Detection Entrypoint.
Delegates to the modular CLI runner in app.cli.runner.
"""

import sys
from pathlib import Path

# Add backend root to sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.cli.runner import main


if __name__ == "__main__":
    main()
