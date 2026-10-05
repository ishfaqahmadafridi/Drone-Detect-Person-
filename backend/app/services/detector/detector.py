"""
Drone Person Detector: Multi-view YOLOv8 / YOLOv11 Computer Vision & Target Tracking Engine.
"""

from typing import List, Dict, Tuple, Optional
from collections import defaultdict, deque
import numpy as np

try:
    import cv2
except ImportError:
    cv2 = None

from app.core.config import DetectionConfig
from app.services.inference_service import inference_service, MultiViewInferenceService
from app.services.tracking_service import tracking_service, TargetTrackerService
from app.services.annotation_service import TacticalFrameAnnotator
from app.services.detector.profiler import FPSProfiler


class DronePersonDetectorService:
    """
    High-performance Aerial / Ground Computer Vision Inference & Tracking Coordinator.
    """
    def __init__(
        self,
        config: Optional[DetectionConfig] = None,
        annotator: Optional[TacticalFrameAnnotator] = None,
        isolated: bool = False
    ):
        self.config = config or DetectionConfig()
        self.inference = MultiViewInferenceService(device=self.config.device) if isolated else inference_service
        self.tracks = TargetTrackerService() if isolated else tracking_service
        self.active_view = getattr(self.config, "view_mode", "aerial") or "aerial"
        self.untracked_detections = []
        
        # Pre-warm default view model
        self.model = self.inference.get_model(self.active_view)
        self._apply_profile(preserve_overrides=True)
        
        # FPS Profiler
        self._profiler = FPSProfiler(window_seconds=0.5)
        
        # Track trajectory history
        max_trail = getattr(self.config, "track_trail_length", 30)
        self.track_history = defaultdict(lambda: deque(maxlen=max_trail))
        
        # Dedicated Visual Frame Annotator
        self.annotator = annotator or TacticalFrameAnnotator(self.config)

    @property
    def fps(self) -> float:
        return self._profiler.current_fps

    @fps.setter
    def fps(self, val: float):
        self._profiler.current_fps = val

    def _apply_profile(self, preserve_overrides: bool = False):
        profile = self.inference.get_profile(self.active_view)
        self.config.view_mode = self.active_view
        self.config.model_name = profile.get("filename", "")
        self.config.target_classes = list(profile.get("person_classes", [0]))
        self.engine = profile.get("engine", "YOLO + ByteTrack")
        fields = (("confidence_threshold", "confidence"), ("iou_threshold", "iou"), ("img_size", "recommended_imgsz"))
        for field, key in fields:
            if not preserve_overrides or getattr(self.config, field) is None:
                if key in profile:
                    setattr(self.config, field, profile[key])

    def reset_tracking(self):
        self.track_history.clear()
        self.tracks.reset()
        if hasattr(self.inference, "reset_tracking"):
            self.inference.reset_tracking()

    def set_view(self, view: str) -> str:
        if view == self.active_view:
            return self.active_view
        self.inference.set_active_view(view, preload=True)
        self.active_view = view
        self.model = self.inference.get_model(self.active_view)
        self._apply_profile(preserve_overrides=False)
        self.reset_tracking()
        return self.active_view

    def process_frame(
        self,
        frame: np.ndarray,
        use_tracking: bool = True,
        view: Optional[str] = None
    ) -> List[Dict]:
        """
        Executes YOLO deep learning inference and multi-object tracking on video frame.
        """
        self._profiler.tick()

        if view is not None and view != self.active_view:
            self.set_view(view)
        current_view = self.active_view
        model = self.model
        profile = self.inference.get_profile(current_view)

        conf_thresh = (
            self.config.confidence_threshold
            if self.config.confidence_threshold > 0
            else profile.get("confidence", 0.3)
        )
        iou_thresh = (
            self.config.iou_threshold
            if self.config.iou_threshold > 0
            else profile.get("iou", 0.45)
        )
        target_classes = profile.get("person_classes", [0])
        tracker_file = profile.get("tracker", "bytetrack.yaml")

        if use_tracking:
            results = model.track(
                source=frame,
                conf=conf_thresh,
                iou=iou_thresh,
                classes=target_classes,
                device=self.config.device,
                imgsz=self.config.img_size,
                tracker=tracker_file,
                persist=True,
                verbose=False
            )
        else:
            results = model.predict(
                source=frame,
                conf=conf_thresh,
                iou=iou_thresh,
                classes=target_classes,
                device=self.config.device,
                imgsz=self.config.img_size,
                verbose=False
            )

        detected_persons: List[Dict] = []
        self.untracked_detections = []
        if not results or len(results) == 0:
            return detected_persons

        boxes = results[0].boxes
        if boxes is None or len(boxes) == 0:
            return detected_persons

        for idx, box in enumerate(boxes):
            xyxy = box.xyxy[0].cpu().numpy()
            x1, y1, x2, y2 = map(int, xyxy)
            conf = float(box.conf[0].cpu().numpy())
            
            has_track_id = box.id is not None and len(box.id) > 0
            # An unconfirmed detection must never borrow a stable suspect ID.
            if use_tracking and not has_track_id:
                self.untracked_detections.append({
                    "id": None, "bbox": [x1, y1, x2, y2], "conf": conf,
                    "is_intruder": False,
                })
                continue
            track_id = int(box.id[0].cpu().numpy()) if has_track_id else (idx + 1)
            cx = int((x1 + x2) / 2)
            cy = int((y1 + y2) / 2)
            fx = cx
            fy = y2

            self.track_history[track_id].append((fx, fy))

            detected_persons.append({
                'id': track_id,
                'bbox': [x1, y1, x2, y2],
                'conf': conf,
                'center': (cx, cy),
                'foot': (fx, fy),
                'width': x2 - x1,
                'height': y2 - y1,
                'is_intruder': False
            })

        return self.tracks.update_tracks(detected_persons)

    def draw_annotations(
        self,
        frame: np.ndarray,
        detected_persons: List[Dict],
        intruders: List[Dict],
        zone_polygon: Optional[np.ndarray],
        threat_level: str,
        alert_msg: str
    ) -> np.ndarray:
        """
        Delegates visual frame annotation to the dedicated TacticalFrameAnnotator.
        """
        return self.annotator.draw_annotations(
            frame=frame,
            detected_persons=detected_persons,
            intruders=intruders,
            zone_polygon=zone_polygon,
            threat_level=threat_level,
            alert_msg=alert_msg,
            fps=self.fps,
            track_history=self.track_history
        )
