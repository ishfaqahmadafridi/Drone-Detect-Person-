"""
CLI Runner: Command-line orchestration runner for aerial detection processing.
"""

import argparse
import os
import sys
import time
import cv2

from app.core.config import DetectionConfig, SYNTHETIC_VIDEO_PATH
from app.engine.pipeline import DetectionPipeline
from app.engine.recorder import VideoRecorder
from app.cli.display import StreamDisplayManager
from app.utils.video_utils import create_synthetic_drone_video

def run_cli_detection(
    source: str = "synthetic",
    model_name: str = "yolov8n.pt",
    confidence: float = 0.35,
    multi_person_threshold: int = 2,
    proximity_dist_px: int = 120,
    save_video: bool = False,
    output_video_path: str = "runs/output/annotated_output.mp4",
    headless: bool = False,
    max_frames: int = 0
):
    print("=" * 70)
    print("🚁 AERO-GUARD: DRONE PERSON & MULTI-PERSON INTRUSION DETECTION 🚁")
    print("=" * 70)
    print(f"[CONFIG] Source: {source}")
    print(f"[CONFIG] Model: {model_name} (Confidence: {confidence:.2f})")
    print(f"[CONFIG] Multi-Person Threshold: >= {multi_person_threshold} People")
    print(f"[CONFIG] Proximity Gathering Distance: {proximity_dist_px} px")
    print(f"[CONFIG] Headless Mode: {headless}")
    print("-" * 70)

    # Resolve Video Source
    if source == "synthetic" or (not os.path.exists(source) and not source.isdigit() and not source.startswith(("rtsp://", "http://", "https://"))):
        if not os.path.exists(SYNTHETIC_VIDEO_PATH):
            print("[INFO] Generating synthetic test video...")
            create_synthetic_drone_video(SYNTHETIC_VIDEO_PATH, duration_sec=30, fps=25)
        video_src = SYNTHETIC_VIDEO_PATH
    elif source.isdigit():
        video_src = int(source)
    else:
        video_src = source

    cap = cv2.VideoCapture(video_src)
    if not cap.isOpened():
        print(f"[FATAL] Unable to open video source: {source}")
        sys.exit(1)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1280
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 720
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0

    print(f"[INFO] Video Feed Opened: {width}x{height} @ {fps:.1f} FPS")

    # Initialize Components
    config = DetectionConfig(
        model_name=model_name,
        confidence_threshold=confidence,
        multi_person_threshold=multi_person_threshold,
        proximity_alert_distance_px=proximity_dist_px
    )

    pipeline = DetectionPipeline(config)
    display = StreamDisplayManager(headless=headless)
    recorder = VideoRecorder(output_video_path, fps=fps, frame_size=(width, height)) if save_video else None

    if recorder:
        recorder.open()

    frame_idx = 0
    total_alerts_count = 0
    start_time = time.time()

    print("[INFO] Processing stream... Press 'q' to stop.")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                if source == "synthetic" or video_src == SYNTHETIC_VIDEO_PATH:
                    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                    continue
                print("[INFO] Stream disconnected or reached end of video.")
                break

            frame_idx += 1
            if max_frames > 0 and frame_idx > max_frames:
                break

            annotated_frame, telemetry, saved_snap = pipeline.process_frame(frame, frame_idx=frame_idx)

            if saved_snap:
                total_alerts_count += 1
                print(f"[🚨 ALERT EVENT @ Frame {frame_idx}] {telemetry['alert_msg']} -> Snapshot: {os.path.basename(saved_snap)}")

            if recorder:
                recorder.write(annotated_frame)

            if not display.show_frame(annotated_frame, frame_idx, config.snapshots_dir):
                break

    finally:
        cap.release()
        if recorder:
            recorder.release()
        display.close()

    elapsed = time.time() - start_time
    avg_fps = frame_idx / elapsed if elapsed > 0 else 0
    print("=" * 70)
    print(f"[SUMMARY] Processed {frame_idx} frames in {elapsed:.2f}s ({avg_fps:.1f} Avg FPS)")
    print(f"[SUMMARY] Total Incident Snapshots Saved: {total_alerts_count}")
    print(f"[SUMMARY] Event logs saved to: {config.logs_dir}")
    if save_video:
        print(f"[SUMMARY] Annotated Output: {output_video_path}")
    print("=" * 70)

def main():
    parser = argparse.ArgumentParser(description="Drone Person & Multi-Person Intrusion Detection CLI")
    parser.add_argument("--source", "-s", type=str, default="synthetic", help="Video path, RTSP stream URL, or webcam index (0)")
    parser.add_argument("--model", "-m", type=str, default="yolov8n.pt", help="YOLO model path or name")
    parser.add_argument("--conf", "-c", type=float, default=0.35, help="Detection confidence threshold")
    parser.add_argument("--multi-thresh", "-t", type=int, default=2, help="Multi-person alert trigger threshold (default: 2)")
    parser.add_argument("--proximity-dist", "-p", type=int, default=120, help="Proximity threshold in pixels")
    parser.add_argument("--save-video", action="store_true", help="Save annotated output video to disk")
    parser.add_argument("--output-video", type=str, default="runs/output/annotated_output.mp4", help="Output video filepath")
    parser.add_argument("--headless", action="store_true", help="Run without OpenCV GUI window")
    parser.add_argument("--max-frames", type=int, default=0, help="Stop after N frames (0 for full video)")

    args = parser.parse_args()

    run_cli_detection(
        source=args.source,
        model_name=args.model,
        confidence=args.conf,
        multi_person_threshold=args.multi_thresh,
        proximity_dist_px=args.proximity_dist,
        save_video=args.save_video,
        output_video_path=args.output_video,
        headless=args.headless,
        max_frames=args.max_frames
    )
