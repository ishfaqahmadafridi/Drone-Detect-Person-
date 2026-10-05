"""Bounded, in-memory video tracklets. Keys distinguish reused numeric tracker IDs."""
from collections import deque
from dataclasses import dataclass, field
from uuid import uuid4
import numpy as np


@dataclass
class Tracklet:
    track_id: int
    frames: deque
    key: str = field(default_factory=lambda: uuid4().hex)
    origin_key: str = ""
    last_seen: float = 0.0
    last_sample: float = -float("inf")
    seen_at: float = 0.0
    frame_idx: int = 0
    image: str = ""
    version: int = 0
    encoded_version: int = -1
    last_encoded: float = -float("inf")
    embedding: np.ndarray | None = None
    embedding_time: float = 0.0
    embedding_seen_at: float = 0.0
    embedding_frame_idx: int = 0
    embedding_image: str = ""


@dataclass(frozen=True)
class EncodingJob:
    channel: str
    track_id: int
    key: str
    version: int
    frames: tuple
    image: str
    frame_idx: int
    last_seen: float
    seen_at: float
