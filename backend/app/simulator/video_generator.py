"""
SyntheticVideoGenerator: Renders a complete aerial drone test video to disk.
Single responsibility: file-based synthetic video generation only.
"""

import os
import random

import cv2

from app.simulator.config import SimulationConfig
from app.simulator.person import SimulatedPerson
from app.simulator.terrain import TerrainRenderer
from app.simulator.osd import TelemetryOsdRenderer


class SyntheticVideoGenerator:
    """
    Generates realistic overhead drone aerial simulation videos with moving people,
    gathering behaviour (2+ people), and restricted zone entry events.

    Single responsibility: file-to-disk codec pipeline only.
    For in-memory real-time frames use LiveSimulationStream.
    """

    def __init__(self, config: SimulationConfig) -> None:
        self.config = config
        self._terrain = TerrainRenderer(config)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def generate(self) -> str:
        """Render all frames, write to disk, return output path."""
        cfg = self.config
        total_frames = cfg.duration_sec * cfg.fps
        os.makedirs(os.path.dirname(os.path.abspath(cfg.output_path)), exist_ok=True)

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        writer = cv2.VideoWriter(cfg.output_path, fourcc, cfg.fps, (cfg.width, cfg.height))

        print(
            f"[VIDEO_GENERATOR] Generating {cfg.output_path} "
            f"({cfg.width}x{cfg.height} @ {cfg.fps}fps, {cfg.duration_sec}s)…"
        )

        people = self._spawn_people(cfg)
        for frame_idx in range(total_frames):
            frame, drift_x, drift_y = self._terrain.render(frame_idx)
            for idx, person in enumerate(people):
                person.update_physics(frame_idx, idx, cfg.width, cfg.height)
                person.render(frame, drift_x, drift_y)
            TelemetryOsdRenderer.render(frame, frame_idx, total_frames)
            writer.write(frame)

        writer.release()
        print(f"[VIDEO_GENERATOR] Saved → {cfg.output_path}")
        return cfg.output_path

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _spawn_people(self, cfg: SimulationConfig):
        return [
            SimulatedPerson(
                x=random.uniform(100, cfg.width - 100),
                y=random.uniform(100, cfg.height - 100),
                color=cfg.shirt_colors[i % len(cfg.shirt_colors)],
                size=random.randint(18, 24),
            )
            for i in range(cfg.num_people)
        ]


def create_synthetic_drone_video(
    output_path: str = "test_drone.mp4",
    width: int = 1280,
    height: int = 720,
    duration_sec: int = 15,
    fps: int = 25,
    num_people: int = 4,
) -> str:
    """Convenience factory: configure and generate a synthetic aerial video."""
    config = SimulationConfig(
        output_path=output_path,
        width=width,
        height=height,
        duration_sec=duration_sec,
        fps=fps,
        num_people=num_people,
    )
    return SyntheticVideoGenerator(config).generate()
