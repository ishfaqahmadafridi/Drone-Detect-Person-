"""
Video Recorder: Safe video writing and serialization engine.
"""

import os
from typing import Optional
import cv2
import numpy as np

class VideoRecorder:
    """
    Manages OpenCV VideoWriter lifecycle, frame encoding, and disk flushing.
    """
    def __init__(self, output_path: str, fps: float = 25.0, frame_size: tuple = (1280, 720)):
        self.output_path = output_path
        self.fps = fps
        self.frame_size = frame_size
        self.writer: Optional[cv2.VideoWriter] = None

    def open(self) -> None:
        os.makedirs(os.path.dirname(self.output_path), exist_ok=True)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        self.writer = cv2.VideoWriter(self.output_path, fourcc, self.fps, self.frame_size)
        print(f"[INFO] VideoRecorder opened output: {self.output_path}")

    def write(self, frame: np.ndarray) -> None:
        if self.writer is not None:
            self.writer.write(frame)

    def release(self) -> None:
        if self.writer is not None:
            self.writer.release()
            self.writer = None
            print(f"[INFO] VideoRecorder flushed and saved to: {self.output_path}")
