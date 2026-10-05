"""Crop only original pixels, before boxes/HUD are drawn; reject unusable detections."""
import base64
import math
import cv2
import numpy as np
from PIL import Image


def person_crop(frame, detection, config):
    try:
        coords = np.asarray(detection.get("bbox", []), dtype=float)
        if coords.shape != (4,) or not np.isfinite(coords).all():
            return None
        confidence = float(detection.get("conf", 0))
        if not math.isfinite(confidence) or confidence < config.min_detection_confidence:
            return None
        height, width = frame.shape[:2]
        x1, y1, x2, y2 = coords.astype(int)
        x1, x2 = np.clip([x1, x2], 0, width)
        y1, y2 = np.clip([y1, y2], 0, height)
        if x2 - x1 < config.min_crop_width or y2 - y1 < config.min_crop_height:
            return None
        # PIL bilinear resize matches upstream RectScale. Store RGB uint8 to bound RAM.
        rgb = cv2.cvtColor(frame[y1:y2, x1:x2], cv2.COLOR_BGR2RGB)
        return np.asarray(Image.fromarray(rgb).resize(
            (config.crop_width, config.crop_height), Image.Resampling.BILINEAR)).copy()
    except (ValueError, TypeError, cv2.error):
        return None


def thumbnail(rgb, quality):
    ok, encoded = cv2.imencode(".jpg", cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR),
                               [cv2.IMWRITE_JPEG_QUALITY, quality])
    return "data:image/jpeg;base64," + base64.b64encode(encoded).decode("ascii") if ok else ""


def normalized_embedding(value):
    vector = np.asarray(value, dtype=np.float32)
    if vector.ndim != 1 or not np.isfinite(vector).all():
        raise ValueError("Model returned an invalid embedding")
    norm = float(np.linalg.norm(vector))
    if norm <= np.finfo(np.float32).eps:
        raise ValueError("Model returned an empty embedding")
    return vector / norm
