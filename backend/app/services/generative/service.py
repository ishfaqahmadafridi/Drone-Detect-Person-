"""
Aerial Diffusion Service: Orchestrator for Ground-to-Aerial Generative Translation.
"""

import os
import time
from typing import Optional, Dict, Any
import numpy as np

from app.services.generative.config import AerialDiffusionConfig
from app.services.generative.preprocessor import ImagePreprocessor
from app.services.generative.prompt_engine import TacticalPromptEngine
from app.services.generative.pipeline_runner import AerialDiffusionRunner


class AerialDiffusionService:
    """
    High-level service coordinating preprocessing, aerial prompt generation,
    GPU diffusion inference, and storage of synthesized aerial imagery.
    """

    def __init__(self, config: Optional[AerialDiffusionConfig] = None):
        self.config = config or AerialDiffusionConfig()
        self.runner = AerialDiffusionRunner(config=self.config)

    def synthesize_aerial_view(
        self,
        image_path: Optional[str] = None,
        image_base64: Optional[str] = None,
        numpy_frame: Optional[np.ndarray] = None,
        custom_prompt: Optional[str] = None,
        custom_negative_prompt: Optional[str] = None,
        num_inference_steps: int = 30,
        guidance_scale: float = 7.5,
        scene_context: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes full Ground-to-Aerial perspective synthesis.
        """
        # 1. Load source image
        raw_image = ImagePreprocessor.load_image(
            image_path=image_path,
            base64_data=image_base64,
            numpy_frame=numpy_frame,
        )

        if raw_image is None:
            return {
                "success": False,
                "message": "Failed to load input ground image from provided source.",
                "aerial_image_url": None,
                "aerial_image_path": None,
                "generation_time_ms": 0.0,
                "device_used": self.config.device,
                "prompt_used": "",
            }

        # 2. Preprocess & Crop for Diffusion (512x512)
        prep_image = ImagePreprocessor.prepare_for_diffusion(
            image=raw_image,
            target_size=(self.config.image_size, self.config.image_size)
        )

        # 3. Build specialized prompt
        prompt = TacticalPromptEngine.build_prompt(
            user_prompt=custom_prompt,
            scene_context=scene_context
        )
        negative_prompt = TacticalPromptEngine.build_negative_prompt(
            custom_negative=custom_negative_prompt
        )

        # 4. Run Diffusion Model
        output_image, elapsed_ms, device_used = self.runner.generate(
            image=prep_image,
            prompt=prompt,
            negative_prompt=negative_prompt,
            num_inference_steps=num_inference_steps,
            guidance_scale=guidance_scale,
        )

        # 5. Save generated image to snapshots directory
        filename = f"aerial_syn_{int(time.time() * 1000)}.jpg"
        save_path = os.path.join(self.config.output_dir, filename)
        output_image.save(save_path, format="JPEG", quality=92)
        url = f"/api/v1/snapshots/{filename}"

        return {
            "success": True,
            "message": f"Synthesized aerial view generated in {elapsed_ms:.1f}ms on {device_used}.",
            "aerial_image_url": url,
            "aerial_image_path": save_path,
            "generation_time_ms": elapsed_ms,
            "device_used": device_used,
            "prompt_used": prompt,
        }
