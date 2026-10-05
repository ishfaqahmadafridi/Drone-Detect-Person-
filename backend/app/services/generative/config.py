"""
Configuration parameters for AerialDiffusion Ground-to-Aerial Generative Pipeline.
"""

import os
from dataclasses import dataclass
from app.core.paths import SNAPSHOTS_DIR
from app.core.device import get_optimal_device


@dataclass
class AerialDiffusionConfig:
    """
    Configuration parameters for local & cloud-accelerated AerialDiffusion inference.
    """
    model_id: str = os.getenv("AERIAL_DIFFUSION_MODEL_ID", "CompVis/stable-diffusion-v1-4")
    default_prompt: str = (
        "an aerial overhead drone surveillance view of the perimeter scene, "
        "top-down satellite perspective, high-altitude tactical defense map, crisp details"
    )
    default_negative_prompt: str = (
        "blurry, low quality, distorted horizon, eye-level street view, ground camera angle, "
        "tilted camera, bad anatomy, watermarks"
    )
    image_size: int = 512
    num_inference_steps: int = 30
    guidance_scale: float = 7.5
    device: str = get_optimal_device()
    output_dir: str = SNAPSHOTS_DIR
    enable_xformers: bool = True
    enable_attention_slicing: bool = True
    enable_fp16: bool = True
