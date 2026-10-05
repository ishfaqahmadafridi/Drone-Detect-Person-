"""
Image Preprocessor: Loads, validates, resizes, and normalizes input ground images for diffusion.
"""

import os
import io
import base64
from typing import Optional, Tuple
from PIL import Image
import numpy as np


class ImagePreprocessor:
    """
    Standardizes ground-level CCTV and camera images for the AerialDiffusion pipeline.
    """

    @classmethod
    def load_image(
        cls,
        image_path: Optional[str] = None,
        base64_data: Optional[str] = None,
        numpy_frame: Optional[np.ndarray] = None,
    ) -> Optional[Image.Image]:
        """
        Loads an image from a filesystem path, Base64 string, or OpenCV BGR numpy array.
        """
        # 1. Load from OpenCV numpy frame
        if numpy_frame is not None and isinstance(numpy_frame, np.ndarray):
            try:
                # Convert BGR to RGB
                rgb_array = numpy_frame[:, :, ::-1] if len(numpy_frame.shape) == 3 else numpy_frame
                return Image.fromarray(rgb_array)
            except Exception as e:
                print(f"[PREPROCESSOR] Failed to convert numpy frame: {e}")

        # 2. Load from Base64 Data URI or raw base64 string
        if base64_data:
            try:
                cleaned_b64 = base64_data
                if "," in base64_data:
                    cleaned_b64 = base64_data.split(",", 1)[1]
                image_bytes = base64.b64decode(cleaned_b64)
                return Image.open(io.BytesIO(image_bytes)).convert("RGB")
            except Exception as e:
                print(f"[PREPROCESSOR] Failed to decode base64 image: {e}")

        # 3. Load from local filesystem path
        if image_path and os.path.exists(image_path):
            try:
                return Image.open(image_path).convert("RGB")
            except Exception as e:
                print(f"[PREPROCESSOR] Failed to open image from {image_path}: {e}")

        return None

    @classmethod
    def prepare_for_diffusion(
        cls,
        image: Image.Image,
        target_size: Tuple[int, int] = (512, 512)
    ) -> Image.Image:
        """
        Resizes and center-crops the image to the exact square dimensions required by the diffusion UNet.
        """
        w, h = image.size
        # Center crop to square aspect ratio
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        right = left + min_dim
        bottom = top + min_dim

        cropped = image.crop((left, top, right, bottom))
        return cropped.resize(target_size, Image.Resampling.LANCZOS)
