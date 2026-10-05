"""Public contracts for ranked matches. Similarity is never an identity probability."""
from typing import Literal
from pydantic import BaseModel, Field


class ReIDCandidate(BaseModel):
    track_key: str
    track_id: int
    rank: int
    similarity: float
    image: str
    frame_idx: int
    seen_at: float


class ReIDTarget(BaseModel):
    target_key: str
    ground_track_id: int
    image: str
    samples: int
    required_samples: int
    state: Literal["collecting", "searching", "candidates", "no_match"]
    candidates: list[ReIDCandidate] = Field(default_factory=list)


class ReIDStatus(BaseModel):
    status: Literal["disabled", "idle", "loading", "ready", "error"]
    message: str
    model: str = "X-TFCLIP"
    threshold_configured: bool = False
    targets: list[ReIDTarget] = Field(default_factory=list)
    gallery_tracks: int = 0
    last_inference_ms: float | None = None
    generation: int = 0
