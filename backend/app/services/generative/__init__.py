"""
Generative Aerial Synthesis Subpackage.
"""

from app.services.generative.config import AerialDiffusionConfig
from app.services.generative.preprocessor import ImagePreprocessor
from app.services.generative.prompt_engine import TacticalPromptEngine
from app.services.generative.pipeline_runner import AerialDiffusionRunner
from app.services.generative.service import AerialDiffusionService

# Singleton instance for direct subpackage access
generative_service = AerialDiffusionService()

__all__ = [
    "AerialDiffusionConfig",
    "ImagePreprocessor",
    "TacticalPromptEngine",
    "AerialDiffusionRunner",
    "AerialDiffusionService",
    "generative_service",
]
