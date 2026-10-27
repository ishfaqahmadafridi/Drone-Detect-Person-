"""The CLI retains its recorder dimensions and result contract over shared stages."""
from unittest.mock import patch
import numpy as np
from app.core.config import DetectionConfig
from app.engine.pipeline import DetectionPipeline


def test_cli_preserves_full_frame_and_saved_evidence_contract():
    pipeline = DetectionPipeline(DetectionConfig())
    frame = np.zeros((800, 1600, 3), dtype=np.uint8)
    with patch.object(pipeline.processor._services.tracker, "detect_and_track", return_value=[]), \
         patch.object(pipeline.alert_manager, "process_and_save_evidence", return_value="evidence.jpg") as save:
        annotated, telemetry, snapshot = pipeline.process_frame(frame, frame_idx=4)
    assert annotated.shape == frame.shape
    assert telemetry["frame_idx"] == 4
    assert telemetry["detections"] == []
    assert isinstance(telemetry["details"], dict)
    assert snapshot == "evidence.jpg"
    save.assert_called_once()
