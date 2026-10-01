"""
Inference Status Reporter: Compiles real-time model availability, telemetry metadata, and profiles.
"""

from pathlib import Path
from typing import Any, Dict


class InferenceStatusReporter:
    """
    Constructs comprehensive health and availability diagnostic payloads for active vision models.
    """

    @staticmethod
    def build_status(
        profiles: Dict[str, Any],
        loaded_models: Dict[str, Any],
        active_view: str,
        device: str,
        models_dir: Path
    ) -> Dict[str, Any]:
        status_info = {}
        for view, profile in profiles.items():
            model_path = models_dir / profile["filename"]
            is_avail = (
                model_path.is_file()
                and (
                    "size_bytes" not in profile
                    or model_path.stat().st_size == profile["size_bytes"]
                )
            )
            status_info[view] = {
                "name": profile["name"],
                "filename": profile["filename"],
                "architecture": profile.get("architecture", ""),
                "dataset": profile.get("dataset", ""),
                "engine": profile.get("engine", ""),
                "available": is_avail,
                "loaded": view in loaded_models,
                "is_active": view == active_view,
                "confidence": profile["confidence"],
                "iou": profile["iou"],
                "description": profile.get("description", ""),
                "source_url": profile.get("source_url", ""),
                "download_url": profile.get("download_url", ""),
            }

        return {
            "active_view": active_view,
            "device": device,
            "profiles": status_info,
        }
