"""
Synthetic Drone Flight Test Video Generator CLI.
Delegates to the modular simulation generator in app.simulator.
"""

import sys
import argparse
from pathlib import Path

# Add backend root to sys.path
backend_root = Path(__file__).resolve().parent.parent
if str(backend_root) not in sys.path:
    sys.path.insert(0, str(backend_root))

from app.simulator.generator import create_synthetic_drone_video


def main():
    parser = argparse.ArgumentParser(description="Generate synthetic drone aerial video for testing")
    parser.add_argument("--output", "-o", type=str, default="test_drone.mp4", help="Output MP4 filepath")
    parser.add_argument("--width", type=int, default=1280, help="Video width")
    parser.add_argument("--height", type=int, default=720, help="Video height")
    parser.add_argument("--duration", "-d", type=int, default=15, help="Duration in seconds")
    parser.add_argument("--fps", type=int, default=25, help="Frames per second")
    parser.add_argument("--num-people", "-n", type=int, default=4, help="Number of simulated people")
    args = parser.parse_args()

    create_synthetic_drone_video(
        output_path=args.output,
        width=args.width,
        height=args.height,
        duration_sec=args.duration,
        fps=args.fps,
        num_people=args.num_people
    )

if __name__ == "__main__":
    main()
