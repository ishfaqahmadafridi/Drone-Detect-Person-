"""
CLI Reporter: Formats and outputs tactical terminal logs, real-time alert banners, and execution summaries.
"""

import os
from typing import Dict, Any


class CLIReporter:
    """
    Standardized terminal output formatter for the CLI detection runner.
    """

    @staticmethod
    def print_header(source: str, model_name: str, confidence: float, multi_thresh: int, proximity_dist_px: int, headless: bool):
        print("=" * 70)
        print("🚁 AERO-GUARD: DRONE PERSON & MULTI-PERSON INTRUSION DETECTION 🚁")
        print("=" * 70)
        print(f"[CONFIG] Source: {source}")
        print(f"[CONFIG] Model: {model_name} (Confidence: {confidence:.2f})")
        print(f"[CONFIG] Multi-Person Threshold: >= {multi_thresh} People")
        print(f"[CONFIG] Proximity Gathering Distance: {proximity_dist_px} px")
        print(f"[CONFIG] Headless Mode: {headless}")
        print("-" * 70)

    @staticmethod
    def print_alert_event(frame_idx: int, telemetry: Dict[str, Any], saved_snap: str):
        print(
            f"[🚨 ALERT EVENT @ Frame {frame_idx}] {telemetry.get('alert_msg', 'ALERT')} "
            f"-> Snapshot: {os.path.basename(saved_snap)}"
        )

    @staticmethod
    def print_summary(frame_idx: int, elapsed: float, total_alerts: int, logs_dir: str, save_video: bool, output_video: str):
        avg_fps = frame_idx / elapsed if elapsed > 0 else 0
        print("=" * 70)
        print(f"[SUMMARY] Processed {frame_idx} frames in {elapsed:.2f}s ({avg_fps:.1f} Avg FPS)")
        print(f"[SUMMARY] Total Incident Snapshots Saved: {total_alerts}")
        print(f"[SUMMARY] Event logs saved to: {logs_dir}")
        if save_video:
            print(f"[SUMMARY] Annotated Output: {output_video}")
        print("=" * 70)
