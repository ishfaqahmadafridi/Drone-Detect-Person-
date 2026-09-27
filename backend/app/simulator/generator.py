"""
Synthetic Video Generator: Full-featured aerial drone test video generator.
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
    gathering behavior (2+ people), and restricted zone entry.
    """
    def __init__(self, config: SimulationConfig):
        self.config = config
        self.terrain_renderer = TerrainRenderer(config)

    def generate(self) -> str:
        cfg = self.config
        total_frames = cfg.duration_sec * cfg.fps
        os.makedirs(os.path.dirname(os.path.abspath(cfg.output_path)), exist_ok=True)

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(cfg.output_path, fourcc, cfg.fps, (cfg.width, cfg.height))

        print(f"[INFO] Generating synthetic drone test video: {cfg.output_path} ({cfg.width}x{cfg.height} @ {cfg.fps}fps, {cfg.duration_sec}s)...")

        # Instantiate simulated pedestrians
        people = []
        for i in range(cfg.num_people):
            person = SimulatedPerson(
                x=random.uniform(100, cfg.width - 100),
                y=random.uniform(100, cfg.height - 100),
                color=cfg.shirt_colors[i % len(cfg.shirt_colors)],
                size=random.randint(18, 24)
            )
            people.append(person)

        # Simulation Frame Loop
        for frame_idx in range(total_frames):
            # 1. Render terrain and compute drift
            frame, drift_x, drift_y = self.terrain_renderer.render(frame_idx)

            # 2. Update and render people
            for idx, person in enumerate(people):
                person.update_physics(frame_idx, idx, cfg.width, cfg.height)
                person.render(frame, drift_x, drift_y)

            # 3. Render telemetry OSD
            TelemetryOsdRenderer.render(frame, frame_idx, total_frames)

            out.write(frame)

        out.release()
        print(f"[SUCCESS] Synthetic drone test video saved to: {cfg.output_path}")
        return cfg.output_path

def create_synthetic_drone_video(
    output_path: str = "test_drone.mp4",
    width: int = 1280,
    height: int = 720,
    duration_sec: int = 15,
    fps: int = 25,
    num_people: int = 4
) -> str:
    config = SimulationConfig(
        output_path=output_path,
        width=width,
        height=height,
        duration_sec=duration_sec,
        fps=fps,
        num_people=num_people
    )
    generator = SyntheticVideoGenerator(config)
    return generator.generate()
