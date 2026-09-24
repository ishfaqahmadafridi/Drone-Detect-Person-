"""
Main Real-time Drone Aerial Person & Multi-Person Intrusion Detection Pipeline.
Supports drone video files, live RTSP streams, webcams, and synthetic test videos.
"""

import argparse
import os
import sys
import time
import cv2
import numpy as np

from config import DetectionConfig
from detector import DronePersonDetector
from zone_monitor import ZoneMonitor
from alert_manager import AlertManager, AlertLevel

def run_detection(
    source: str = "0",
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
    print("🚁 DRONE PERSON & MULTI-PERSON INTRUSION DETECTION SYSTEM 🚁")
    print("=" * 70)
    print(f"[CONFIG] Source: {source}")
    print(f"[CONFIG] Model: {model_name} (Confidence: {confidence:.2f})")
    print(f"[CONFIG] Multi-Person Alert Threshold: >= {multi_person_threshold} People")
    print(f"[CONFIG] Proximity Gathering Distance: {proximity_dist_px} px")
    print(f"[CONFIG] Headless Mode: {headless}")
    print("-" * 70)

    # Initialize configuration
    cfg = DetectionConfig(
        model_name=model_name,
        confidence_threshold=confidence,
        multi_person_threshold=multi_person_threshold,
        proximity_alert_distance_px=proximity_dist_px
    )

    # Parse camera / video source
    if source.isdigit():
        video_src = int(source)
    else:
        video_src = source
        if not os.path.exists(source) and not source.startswith(("rtsp://", "http://", "https://")):
            print(f"[ERROR] Source '{source}' does not exist! Generating a synthetic test video instead...")
            from generate_test_video import create_synthetic_drone_video
            create_synthetic_drone_video("test_drone.mp4")
            video_src = "test_drone.mp4"

    cap = cv2.VideoCapture(video_src)
    if not cap.isOpened():
        print(f"[FATAL] Unable to open video source: {source}")
        sys.exit(1)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)) or 1280
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)) or 720
    fps = cap.get(cv2.CAP_PROP_FPS) or 25.0

    print(f"[INFO] Video Feed Opened: {width}x{height} @ {fps:.1f} FPS")

    # Initialize Modules
    detector = DronePersonDetector(cfg)
    zone_monitor = ZoneMonitor(width, height, cfg.default_zone_normalized)
    alert_mgr = AlertManager(
        output_dir=cfg.output_dir,
        snapshots_dir=cfg.snapshots_dir,
        logs_dir=cfg.logs_dir,
        multi_person_threshold=cfg.multi_person_threshold,
        snapshot_cooldown=cfg.snapshot_cooldown_seconds,
        enable_audio=cfg.enable_audio_alert
    )

    # Video Writer setup if enabled
    writer = None
    if save_video:
        os.makedirs(os.path.dirname(output_video_path), exist_ok=True)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        writer = cv2.VideoWriter(output_video_path, fourcc, fps, (width, height))
        print(f"[INFO] Recording annotated output to: {output_video_path}")

    frame_idx = 0
    total_alerts_count = 0
    start_time = time.time()

    print("[INFO] Processing stream... Press 'q' to stop.")

    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("[INFO] End of video stream or feed disconnected.")
                break

            frame_idx += 1
            if max_frames > 0 and frame_idx > max_frames:
                break

            zone_monitor.update_resolution(frame.shape[1], frame.shape[0])

            # 1. Detect & Track Persons
            detected_persons = detector.process_frame(frame, use_tracking=True)

            # 2. Check Zone Intrusions
            intruders = zone_monitor.check_intrusions(detected_persons)

            # 3. Compute 2+ Gatherings & Proximities
            gatherings, clustered_ids = zone_monitor.compute_gatherings(
                detected_persons,
                proximity_threshold_px=cfg.proximity_alert_distance_px
            )

            # 4. Evaluate Security State & Threat Level
            threat_level, alert_msg, details = alert_mgr.evaluate_state(
                detected_persons=detected_persons,
                intruders=intruders,
                gatherings=gatherings,
                frame_idx=frame_idx
            )

            # 5. Render HUD, bounding boxes, zones, and gathering links
            annotated_frame = detector.draw_annotations(
                frame=frame,
                detected_persons=detected_persons,
                intruders=intruders,
                gatherings=gatherings,
                clustered_ids=clustered_ids,
                zone_polygon=zone_monitor.pixel_polygon,
                threat_level=threat_level,
                alert_msg=alert_msg
            )

            # 6. Capture Evidence Snapshot on Alert
            saved_snap = alert_mgr.process_and_save_evidence(
                annotated_frame,
                threat_level,
                details
            )
            if saved_snap:
                total_alerts_count += 1
                print(f"[🚨 ALERT EVENT @ Frame {frame_idx}] {alert_msg} -> Evidence saved: {os.path.basename(saved_snap)}")

            # 7. Write to output video file
            if writer:
                writer.write(annotated_frame)

            # 8. Interactive Display (unless headless)
            if not headless:
                try:
                    cv2.imshow("Drone Aerial Person & Intrusion Monitor", annotated_frame)
                    key = cv2.waitKey(1) & 0xFF
                    if key == ord('q'):
                        print("[INFO] User terminated processing with 'q'.")
                        break
                    elif key == ord('s'):
                        # Manual snapshot key
                        manual_path = os.path.join(cfg.snapshots_dir, f"manual_snap_{frame_idx}.jpg")
                        cv2.imwrite(manual_path, annotated_frame)
                        print(f"[INFO] Manual snapshot saved: {manual_path}")
                except Exception:
                    # Headless fallback if OpenCV GUI window is not supported
                    pass

    finally:
        cap.release()
        if writer:
            writer.release()
        try:
            cv2.destroyAllWindows()
        except Exception:
            pass

    elapsed = time.time() - start_time
    avg_fps = frame_idx / elapsed if elapsed > 0 else 0
    print("=" * 70)
    print(f"[SUMMARY] Processed {frame_idx} frames in {elapsed:.2f}s ({avg_fps:.1f} Avg FPS)")
    print(f"[SUMMARY] Total Incident Snapshots Saved: {total_alerts_count}")
    print(f"[SUMMARY] Event logs saved to: {alert_mgr.log_file_csv}")
    if save_video:
        print(f"[SUMMARY] Annotated Video: {output_video_path}")
    print("=" * 70)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Drone Person & Multi-Person Intrusion Detection")
    parser.add_argument("--source", "-s", type=str, default="test_drone.mp4", help="Video path, RTSP stream URL, or webcam index (0)")
    parser.add_argument("--model", "-m", type=str, default="yolov8n.pt", help="YOLO model path or name")
    parser.add_argument("--conf", "-c", type=float, default=0.35, help="Detection confidence threshold")
    parser.add_argument("--multi-thresh", "-t", type=int, default=2, help="Multi-person alert trigger threshold (default: 2)")
    parser.add_argument("--proximity-dist", "-p", type=int, default=120, help="Proximity threshold in pixels")
    parser.add_argument("--save-video", action="store_true", help="Save annotated output video to disk")
    parser.add_argument("--output-video", type=str, default="runs/output/annotated_output.mp4", help="Output video filepath")
    parser.add_argument("--headless", action="store_true", help="Run without OpenCV GUI window")
    parser.add_argument("--max-frames", type=int, default=0, help="Stop after N frames (0 for full video)")

    args = parser.parse_args()

    run_detection(
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
