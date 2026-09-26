"""Per-view YOLO inference, independent of HTTP, rendering, and alert rules."""

import os
import threading
import time
from pathlib import Path

import numpy as np

from model_registry import PROFILES, ROOT, profile_for, weights_for
from tracking import TrackingSessions

Path(os.environ.setdefault("YOLO_CONFIG_DIR", str(ROOT / ".runtime" / "ultralytics"))).mkdir(parents=True, exist_ok=True)


class PersonInference:
    def __init__(self, device: str = "cpu"):
        self.device = device
        self.models = {}
        self.errors = {}
        self.trackers = TrackingSessions()
        # A single CPU/GPU inference at a time prevents the two feeds from oversubscribing it.
        self.lock = threading.RLock()

    def status(self) -> dict:
        return {
            view: {
                "name": profile["name"],
                "source": profile["source"],
                "filename": profile["filename"],
                "available": (ROOT / "models" / profile["filename"]).is_file(),
                "loaded": view in self.models,
                "error": self.errors.get(view),
                "person_classes": profile["person_classes"],
                "recommended_imgsz": profile["recommended_imgsz"],
                "default_confidence": profile["confidence"],
                "device": self.device,
            }
            for view, profile in PROFILES.items()
        }

    def load(self, view: str):
        with self.lock:
            if view in self.models:
                return self.models[view]
            profile = profile_for(view)
            try:
                from ultralytics import YOLO
                import torch

                if self.device == "cpu":
                    torch.set_num_threads(max(1, min(4, os.cpu_count() or 1)))
                model = YOLO(str(weights_for(view)))
                names = model.names
                for class_id in profile["person_classes"]:
                    if str(names[class_id]).lower() not in {"person", "pedestrian", "people"}:
                        raise ValueError(f"Unexpected class mapping for {profile['name']}: {names}")
                self.models[view] = model
                self.errors.pop(view, None)
                return model
            except Exception as error:
                self.errors[view] = str(error)
                raise

    def predict(self, view: str, frame: np.ndarray, frame_id: int, imgsz: int = 640, confidence: float = 0.25,
                tracking_session: str | None = None, source_time: float | None = None) -> dict:
        if frame is None or frame.ndim != 3 or frame.shape[2] != 3:
            raise ValueError("Expected a three-channel BGR image.")
        profile = profile_for(view)
        if tracking_session and (view != 'aerial' or source_time is None):
            raise ValueError('Tracking requires an aerial frame and its source timestamp.')
        with self.lock:
            model = self.load(view)
            started = time.perf_counter()
            result = model.predict(
                source=frame,
                imgsz=imgsz,
                conf=min(0.1, confidence / 2) if tracking_session else confidence,
                iou=profile["iou"],
                classes=profile["person_classes"],
                device=self.device,
                max_det=300,
                verbose=False,
            )[0]
            elapsed_ms = (time.perf_counter() - started) * 1000
            detections = []
            height, width = frame.shape[:2]
            if result.boxes is not None:
                for index, box in enumerate(result.boxes):
                    x1, y1, x2, y2 = box.xyxy[0].cpu().tolist()
                    x1, x2 = sorted((max(0.0, min(width, x1)), max(0.0, min(width, x2))))
                    y1, y2 = sorted((max(0.0, min(height, y1)), max(0.0, min(height, y2))))
                    if x2 <= x1 or y2 <= y1:
                        continue
                    class_id = int(box.cls[0].item())
                    detections.append({
                        # IDs identify detections in this frame, not persistent identities or tracks.
                        "id": f"{view[0].upper()}-{frame_id}-{index + 1}",
                        "bbox_normalized": [x1 / width, y1 / height, (x2 - x1) / width, (y2 - y1) / height],
                        "confidence": float(box.conf[0].item()),
                        "class_id": class_id,
                        "class_name": str(result.names[class_id]),
                    })
            tracking_result = self.trackers.update(
                tracking_session, detections, width, height, frame_id, source_time, confidence, imgsz,
            ) if tracking_session else {}
        return {
            "view": view,
            "frame_id": frame_id,
            "width": width,
            "height": height,
            "model": profile["name"],
            "model_source": profile["source"],
            "inference_ms": round(elapsed_ms, 2),
            "imgsz": imgsz,
            "detections": detections,
            "identity_matching": False,
            "tracking": False,
            **tracking_result,
        }

    def release_tracking(self, session_id):
        with self.lock:
            self.trackers.discard(session_id)
