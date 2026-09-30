"""
Pipeline Processor Package: Modular single-frame computer vision pipeline.

Exposes VisionPipelineProcessor and PipelineResult for direct backward-compatible consumption.
"""

from app.services.streaming.pipeline_models import PipelineResult
from app.services.streaming.pipeline_processor.processor import VisionPipelineProcessor

__all__ = [
    "VisionPipelineProcessor",
    "PipelineResult",
]
