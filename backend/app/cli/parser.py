"""
CLI Parser: Command-line arguments for aerial surveillance and intrusion detection.
"""

import argparse
from app.core.config import AERIAL_MODEL_NAME


def build_cli_parser() -> argparse.ArgumentParser:
    """
    Constructs and returns the argparse parser for the CLI detection runner.
    """
    parser = argparse.ArgumentParser(
        description="AERO-GUARD: Drone Person Detection CLI"
    )
    parser.add_argument(
        "--source", "-s",
        type=str,
        default="synthetic",
        help="Video path, RTSP stream URL, or webcam index (0)"
    )
    parser.add_argument(
        "--model", "-m",
        type=str,
        default=AERIAL_MODEL_NAME,
        help="YOLO model path or filename"
    )
    parser.add_argument(
        "--conf", "-c",
        type=float,
        default=0.35,
        help="Detection confidence threshold"
    )
    parser.add_argument(
        "--save-video",
        action="store_true",
        help="Save annotated output video to disk"
    )
    parser.add_argument(
        "--output-video",
        type=str,
        default="runs/output/annotated_output.mp4",
        help="Output video filepath"
    )
    parser.add_argument(
        "--headless",
        action="store_true",
        help="Run without OpenCV GUI window"
    )
    parser.add_argument(
        "--max-frames",
        type=int,
        default=0,
        help="Stop after N frames (0 for full video)"
    )
    return parser
