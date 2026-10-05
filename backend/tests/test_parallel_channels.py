"""Regression checks for independent simultaneous camera sessions."""
import unittest
from unittest.mock import patch
from types import SimpleNamespace
from fastapi import HTTPException
from app.services.streaming.channels import get_stream_session


class ParallelChannelTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.ground = get_stream_session("ground")
        cls.aerial = get_stream_session("aerial")

    def test_models_and_tracking_state_are_isolated(self):
        self.assertIsNot(self.ground.detector.model, self.aerial.detector.model)
        self.assertIsNot(self.ground.detector.inference, self.aerial.detector.inference)
        self.assertIsNot(self.ground.detector.tracks, self.aerial.detector.tracks)
        self.assertIsNot(self.ground.source_provider, self.aerial.source_provider)
        self.assertEqual(self.ground.config.view_mode, "ground")
        self.assertEqual(self.aerial.config.view_mode, "aerial")

    def test_channel_perspective_is_fixed(self):
        with self.assertRaises(HTTPException):
            self.ground.set_view_mode("aerial")
        self.assertEqual(self.ground.config.view_mode, "ground")

    def test_ground_freeze_does_not_pause_or_reset_aerial(self):
        ground_frames = self.ground.generate_frames()
        aerial_frames = self.aerial.generate_frames()
        try:
            self.assertTrue(next(ground_frames).startswith(b"--frame"))
            self.assertTrue(next(aerial_frames).startswith(b"--frame"))
            frozen = self.ground.frame_streamer.selection.freeze(self.ground.config)
            ground_idx = self.ground.latest_telemetry["frame_idx"]
            aerial_idx = self.aerial.latest_telemetry["frame_idx"]
            for _ in range(3):
                next(aerial_frames)
            self.assertGreater(self.aerial.latest_telemetry["frame_idx"], aerial_idx)
            self.assertEqual(self.ground.latest_telemetry["frame_idx"], ground_idx)
            self.ground.frame_streamer.selection.commit(
                frozen["token"], [frozen["detections"][0]["id"]],
                self.ground.config, self.ground.telemetry_store)
            self.assertEqual(self.aerial.config.selected_target_ids, [])
            self.ground.set_source("synthetic")
            self.assertFalse(self.aerial.frame_streamer.selection.paused)
            self.assertEqual(self.aerial.config.view_mode, "aerial")
        finally:
            self.ground.frame_streamer.selection.invalidate()
            ground_frames.close()
            aerial_frames.close()

    def test_aerial_rejects_suspect_selection(self):
        with self.assertRaises(HTTPException):
            self.aerial.frame_streamer.selection.freeze(self.aerial.config)

    def test_primary_camera_ids_preserve_channel_sessions(self):
        self.assertIs(get_stream_session(camera_id="CAM-01"), self.aerial)
        self.assertIs(get_stream_session(camera_id="CAM-02"), self.ground)

    def test_unknown_camera_is_rejected(self):
        with patch("app.services.streaming.camera_registry.camera_registry_service.get_camera", return_value=None):
            with self.assertRaises(HTTPException) as error:
                get_stream_session(camera_id="missing")
        self.assertEqual(error.exception.status_code, 404)

    def test_additional_camera_gets_its_own_cached_source(self):
        from app.services.streaming import channels
        camera = SimpleNamespace(view_mode="ground", source_type="rtsp", stream_url="rtsp://camera/live")
        with patch("app.services.streaming.camera_registry.camera_registry_service.get_camera", return_value=camera), \
                patch.object(channels, "_camera_sessions", {}), \
                patch.object(channels, "StreamManagerService") as factory:
            session = get_stream_session(camera_id="test-camera")
            self.assertIs(get_stream_session(camera_id="test-camera"), session)
            self.assertIsNot(session, self.ground)
            factory.assert_called_once()
            session.set_source.assert_called_once_with("rtsp", "rtsp://camera/live")
            self.assertEqual(session.fixed_view, "ground")

    def test_promotion_preserves_other_camera_session(self):
        from unittest.mock import MagicMock
        from app.services.streaming import channels
        previous, promoted = MagicMock(), MagicMock()
        camera = SimpleNamespace(view_mode="ground")
        with patch("app.services.streaming.camera_registry.camera_registry_service.get_camera", return_value=camera), \
                patch.object(channels, "_channels", {"ground": previous}), \
                patch.object(channels, "_camera_sessions", {"CAM-02": previous, "test-camera": promoted}), \
                patch("app.services.reid.service.reid_service.reset_channel") as reset:
            self.assertIs(channels.select_camera_session("test-camera"), promoted)
            self.assertIs(channels.get_stream_session("ground"), promoted)
            self.assertIs(channels.get_stream_session(camera_id="CAM-02"), previous)
            self.assertIs(channels.select_camera_session("test-camera"), promoted)
            reset.assert_called_once_with("ground")
            previous.set_source.assert_not_called()
            promoted.set_source.assert_not_called()

    def test_non_primary_camera_does_not_mix_reid_tracks(self):
        from app.services.streaming import channels
        with patch.object(channels, "StreamManagerService") as factory, \
                patch.object(channels, "_channels", {}), \
                patch("app.services.reid.service.reid_service.observe") as observe:
            session = channels._new_session("ground")
            observer = factory.return_value.pipeline_processor.set_frame_observer.call_args.args[0]
            observer(None, [], 1, "file", [])
            observe.assert_not_called()
            channels._channels["ground"] = session
            observer(None, [], 2, "file", [])
            observe.assert_called_once_with("ground", None, [], 2, "file", [])
