"""Compare preview delivery with real CPU detection on a supplied video.

This measures frame delivery locally, not browser rendering or ReID accuracy.
"""
import argparse
import json
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from app.core.config import DetectionConfig
from app.services.streaming.coordinator.manager import StreamManagerService
from app.services.streaming.frame_streamer import FrameStreamer
from app.services.streaming.preview_streamer import PreviewStreamer


def measure(session, streamer_class, video, seconds):
    streamer = streamer_class(session.source_provider, session.pipeline_processor,
                              session.telemetry_store, session.broadcaster, session.coordinator_config)
    streamer.record_frames = False
    session.frame_streamer = streamer
    session.set_source("file", str(video))
    calls = []
    session.pipeline_processor.set_frame_observer(lambda *args: calls.append(time.monotonic()))
    frames = streamer.generate_frames()
    try:
        next(frames)  # Exclude startup and the first frame from the timed sample.
        started = time.monotonic()
        count = 0
        while time.monotonic() - started < seconds:
            next(frames)
            count += 1
        elapsed = time.monotonic() - started
        return {"preview_fps": round(count / elapsed, 2), "preview_frames": count,
                "detection_fps": round(sum(t >= started for t in calls) / elapsed, 2),
                "seconds": round(elapsed, 2)}
    finally:
        frames.close()
        streamer.is_running = False
        streamer._producer.join(timeout=10)
        if streamer._producer.is_alive():
            raise RuntimeError("Preview did not stop cleanly")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--video", type=Path, required=True)
    parser.add_argument("--view", choices=("ground", "aerial"), default="aerial")
    parser.add_argument("--seconds", type=float, default=5)
    parser.add_argument("--report", type=Path)
    args = parser.parse_args()
    if not args.video.is_file() or args.seconds <= 0:
        parser.error("Provide an existing video and a positive measurement duration")
    session = StreamManagerService(DetectionConfig(view_mode=args.view), isolated=True)
    session.set_view_mode(args.view)
    try:
        result = {"view": args.view, "device": session.config.device,
                  "synchronous": measure(session, FrameStreamer, args.video.resolve(), args.seconds),
                  "asynchronous": measure(session, PreviewStreamer, args.video.resolve(), args.seconds),
                  "note": "One feed; real detection; no ReID; local frame delivery, not browser rendering."}
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            args.report.write_text(json.dumps(result, indent=2), encoding="utf-8")
        print(json.dumps(result, indent=2))
    finally:
        session.source_provider.close()


if __name__ == "__main__":
    main()
