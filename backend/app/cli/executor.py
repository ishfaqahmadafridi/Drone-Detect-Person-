"""
CLI Detection Executor: Runs detection pipeline, video display, recording, and incident metrics.
"""

import time
import cv2
from typing import Optional

from app.core.config import DetectionConfig, SYNTHETIC_VIDEO_PATH, AERIAL_MODEL_NAME
from app.engine.pipeline import DetectionPipeline
from app.engine.recorder import VideoRecorder
from app.cli.display import StreamDisplayManager
from app.cli.source_resolver import resolve_video_source
from app.cli.reporter import CLIReporter


class CLIDetectionExecutor:
    """
    Manages the real-time execution loop for CLI-based video detection.
    """

    def __init__(
        self,
        source: str = "synthetic",
        model_name: Optional[str] = None,
        confidence: float = 0.35,
        save_video: bool = False,
        output_video_path: str = "runs/output/annotated_output.mp4",
        headless: bool = False,
        max_frames: int = 0
    ):
        self.source = source
        self.model_name = model_name or AERIAL_MODEL_NAME
        self.confidence = confidence
        self.save_video = save_video
        self.output_video_path = output_video_path
        self.headless = headless
        self.max_frames = max_frames

    def execute(self):
        CLIReporter.print_header(
            source=self.source,
            model_name=self.model_name,
            confidence=self.confidence,
            headless=self.headless
        )
        source_meta = resolve_video_source(self.source)
        cap = source_meta.cap

        config = DetectionConfig(
            model_name=self.model_name,
            confidence_threshold=self.confidence,
        )

        pipeline = DetectionPipeline(config)
        display = StreamDisplayManager(headless=self.headless)
        recorder = (
            VideoRecorder(
                self.output_video_path,
                fps=source_meta.fps,
                frame_size=(source_meta.width, source_meta.height)
            )
            if self.save_video
            else None
        )

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
                    if self.source == "synthetic" or source_meta.resolved_source == SYNTHETIC_VIDEO_PATH:
                        cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                        continue
                    print("[INFO] Stream disconnected or reached end of video.")
                    break

                frame_idx += 1
                if self.max_frames > 0 and frame_idx > self.max_frames:
                    break

                annotated_frame, telemetry, saved_snap = pipeline.process_frame(frame, frame_idx=frame_idx)

                if saved_snap:
                    total_alerts_count += 1
                    CLIReporter.print_alert_event(frame_idx, telemetry, saved_snap)

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
        CLIReporter.print_summary(
            frame_idx=frame_idx,
            elapsed=elapsed,
            total_alerts=total_alerts_count,
            logs_dir=config.logs_dir,
            save_video=self.save_video,
            output_video=self.output_video_path
        )
