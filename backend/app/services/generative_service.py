"""
Generative Service Facade Singleton.
"""

from app.services.generative import (
    AerialDiffusionConfig,
    ImagePreprocessor,
    TacticalPromptEngine,
    AerialDiffusionRunner,
    AerialDiffusionService,
)

generative_service = AerialDiffusionService()

__all__ = [
    "AerialDiffusionConfig",
    "ImagePreprocessor",
    "TacticalPromptEngine",
    "AerialDiffusionRunner",
    "AerialDiffusionService",
    "generative_service",
]
