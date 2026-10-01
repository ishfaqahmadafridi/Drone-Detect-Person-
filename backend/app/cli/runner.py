"""
CLI Runner: Command-line orchestration entrypoint for aerial detection processing.
Coordinates argument parsing, source acquisition, and execution via modular subcomponents.
"""

from typing import Optional
from app.cli.parser import build_cli_parser
from app.cli.executor import CLIDetectionExecutor
from app.cli.source_resolver import resolve_video_source, VideoSourceMetadata


def run_cli_detection(
    source: str = "synthetic",
    model_name: Optional[str] = None,
    confidence: float = 0.35,
    multi_person_threshold: int = 2,
    proximity_dist_px: int = 120,
    save_video: bool = False,
    output_video_path: str = "runs/output/annotated_output.mp4",
    headless: bool = False,
    max_frames: int = 0
):
    """
    Executes the command-line detection pipeline using CLIDetectionExecutor.
    """
    executor = CLIDetectionExecutor(
        source=source,
        model_name=model_name,
        confidence=confidence,
        multi_person_threshold=multi_person_threshold,
        proximity_dist_px=proximity_dist_px,
        save_video=save_video,
        output_video_path=output_video_path,
        headless=headless,
        max_frames=max_frames
    )
    executor.execute()


def main():
    """
    CLI command entrypoint with argument parsing.
    """
    parser = build_cli_parser()
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


if __name__ == "__main__":
    main()
