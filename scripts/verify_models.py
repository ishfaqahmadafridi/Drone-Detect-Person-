"""Load both downloaded checkpoints and run real local inference (not an accuracy benchmark)."""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from inference import PersonInference
from model_registry import ROOT
import cv2
import numpy as np
import ultralytics

engine = PersonInference("cpu")
asset = Path(ultralytics.__file__).parent / "assets" / "bus.jpg"
frame = cv2.imread(str(asset)) if asset.exists() else np.zeros((480, 640, 3), dtype=np.uint8)
report = {"ultralytics": ultralytics.__version__, "image": str(asset) if asset.exists() else "blank smoke-test frame", "models": {}}
for view in ("ground", "aerial"):
    result = engine.predict(view, frame, frame_id=1, imgsz=640)
    model = engine.models[view]
    report["models"][view] = {"classes": model.names, "parameters": sum(p.numel() for p in model.model.parameters()), "detections": len(result["detections"]), "inference_ms": result["inference_ms"], "model": result["model"]}
    for detection in result["detections"]:
        assert detection["class_id"] == 0
        assert all(0 <= value <= 1 for value in detection["bbox_normalized"])
    print(json.dumps({view: report["models"][view]}), flush=True)
output = ROOT / "runs" / "model_verification.json"
output.parent.mkdir(parents=True, exist_ok=True)
output.write_text(json.dumps(report, indent=2), encoding="utf-8")
print(f"Model loading and inference passed; this is not a domain accuracy benchmark. Report: {output}")
