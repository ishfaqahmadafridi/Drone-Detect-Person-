import unittest
import numpy as np
from app.core.config import DetectionConfig
from app.services.annotation_service import TacticalAnnotationTheme, TacticalFrameAnnotator
from app.services.detector_service import DronePersonDetectorService, FPSProfiler


class TestDetectorAndAnnotation(unittest.TestCase):
    def test_fps_profiler(self):
        profiler = FPSProfiler(window_seconds=0.01)
        self.assertEqual(profiler.current_fps, 0.0)
        # Advance ticks
        for _ in range(5):
            profiler.tick()
        self.assertGreaterEqual(profiler.current_fps, 0.0)

    def test_annotation_theme_tokens(self):
        theme = TacticalAnnotationTheme(
            COLOR_INTRUDER=(255, 0, 0),
            HUD_HEIGHT_PX=75
        )
        self.assertEqual(theme.COLOR_INTRUDER, (255, 0, 0))
        self.assertEqual(theme.HUD_HEIGHT_PX, 75)
        self.assertEqual(theme.COLOR_SAFE, (85, 175, 85))

    def test_frame_annotator_rendering(self):
        cfg = DetectionConfig()
        annotator = TacticalFrameAnnotator(config=cfg)

        frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        persons = [
            {"id": 1, "bbox": [100, 100, 200, 300], "conf": 0.88, "center": (150, 200), "foot": (150, 300)},
            {"id": 2, "bbox": [220, 100, 320, 300], "conf": 0.92, "center": (270, 200), "foot": (270, 300)},
        ]
        intruders = [persons[0]]
        gatherings = [(1, 2, 120.0)]
        zone_polygon = np.array([[50, 50], [400, 50], [400, 400], [50, 400]])

        annotated = annotator.draw_annotations(
            frame=frame,
            detected_persons=persons,
            intruders=intruders,
            gatherings=gatherings,
            clustered_ids=[1, 2],
            zone_polygon=zone_polygon,
            threat_level="INTRUSION",
            alert_msg="CRITICAL: 1 INTRUDERS IN RESTRICTED ZONE!",
            fps=28.5
        )
        self.assertEqual(annotated.shape, frame.shape)
        # Frame should have non-zero pixels from drawn boxes/HUD/zone
        self.assertGreater(np.count_nonzero(annotated), 0)

    def test_detector_service_annotation_delegation(self):
        cfg = DetectionConfig()
        detector = DronePersonDetectorService(config=cfg)

        frame = np.zeros((720, 1280, 3), dtype=np.uint8)
        persons = [{"id": 1, "bbox": [50, 50, 100, 150], "conf": 0.75, "center": (75, 100), "foot": (75, 150)}]
        
        annotated = detector.draw_annotations(
            frame=frame,
            detected_persons=persons,
            intruders=[],
            gatherings=[],
            clustered_ids=[],
            zone_polygon=None,
            threat_level="CLEAR",
            alert_msg="AIRSPACE & ZONE SECURE"
        )
        self.assertEqual(annotated.shape, frame.shape)
        self.assertGreater(np.count_nonzero(annotated), 0)


if __name__ == "__main__":
    unittest.main()
