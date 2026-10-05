"""
Generative Aerial Diffusion Pydantic Schemas.
"""

from typing import Optional
from pydantic import BaseModel, Field


class AerialDiffusionRequest(BaseModel):
    """
    Request payload for Ground-to-Aerial image translation.
    """
    prompt: Optional[str] = Field(
        default=None,
        description="Text prompt guiding the aerial perspective translation."
    )
    negative_prompt: Optional[str] = Field(
        default=None,
        description="Negative prompt to suppress unwanted visual artifacts."
    )
    source_image_path: Optional[str] = Field(
        default=None,
        description="Local filesystem path to the ground CCTV snapshot image."
    )
    source_image_base64: Optional[str] = Field(
        default=None,
        description="Optional base64-encoded image string or data URI."
    )
    num_inference_steps: int = Field(
        default=30,
        ge=5,
        le=100,
        description="Number of denoising diffusion steps."
    )
    guidance_scale: float = Field(
        default=7.5,
        ge=1.0,
        le=20.0,
        description="Classifier-Free Guidance (CFG) scale."
    )


class AerialDiffusionResponse(BaseModel):
    """
    Structured outcome of the Ground-to-Aerial generative synthesis.
    """
    success: bool
    message: str
    aerial_image_url: Optional[str] = None
    aerial_image_path: Optional[str] = None
    generation_time_ms: float
    device_used: str
    prompt_used: str
