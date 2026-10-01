"""
Model Weight Loader: Checksum integrity verification, YOLO loading, and class label validation.
"""

import hashlib
from pathlib import Path
from typing import Any, Dict


class ModelWeightLoader:
    """
    Safely loads YOLO checkpoints with SHA-256 digest validation and class mapping assertions.
    """

    @staticmethod
    def verify_and_load(view: str, profile: Dict[str, Any], models_dir: Path) -> Any:
        model_path = models_dir / profile["filename"]
        setup_instruction = f"Run python scripts/download_models.py --view {view} from backend/."

        if not model_path.is_file():
            raise FileNotFoundError(f"Missing {view} model: {model_path.name}. {setup_instruction}")

        if "sha256" in profile:
            with model_path.open("rb") as checkpoint:
                digest = hashlib.file_digest(checkpoint, "sha256").hexdigest()
            if digest != profile["sha256"]:
                raise ValueError(f"Checksum mismatch for {model_path.name}. {setup_instruction}")

        from ultralytics import YOLO

        print(f"[INFO] Loading YOLO model for view '{view}': {model_path.name}")
        model = YOLO(str(model_path))

        if "person_classes" in profile and "person_labels" in profile:
            for class_id, label in zip(profile["person_classes"], profile["person_labels"]):
                if getattr(model, "names", {}).get(class_id) != label:
                    raise ValueError(f"Unexpected person class mapping in {model_path.name}")

        return model
