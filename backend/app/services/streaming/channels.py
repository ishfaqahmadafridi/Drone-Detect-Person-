"""Independent camera sessions: sources, models, trackers, and selection locks."""
from threading import RLock
from app.core.constants import PRIMARY_CAMERA_VIEWS
from typing import Literal, Optional
from fastapi import HTTPException
from app.core.config import DetectionConfig
from app.services.stream_service import stream_service, StreamManagerService

Channel = Literal["ground", "aerial"]
_channels = {}
_camera_sessions = {}
_lock = RLock()
_PRIMARY_CAMERAS = PRIMARY_CAMERA_VIEWS


def _new_session(channel):
    session = StreamManagerService(config=DetectionConfig(view_mode=channel), isolated=True)
    session.set_view_mode(channel)
    session.fixed_view = channel
    session.frame_streamer.record_frames = False
    from app.services.streaming.coordinator.reid_binding import bind_reid
    bind_reid(session, is_active=lambda: _channels.get(channel) is session)
    return session


def get_stream_session(channel: Optional[Channel] = None, camera_id: Optional[str] = None):
    with _lock:
        if camera_id:
            if camera_id in _camera_sessions:
                return _camera_sessions[camera_id]
            if camera_id in _PRIMARY_CAMERAS:
                primary_channel = _PRIMARY_CAMERAS[camera_id]
                session = get_stream_session(primary_channel)
                _camera_sessions[camera_id] = session
                return session
            from app.services.streaming.camera_registry import camera_registry_service
            camera = camera_registry_service.get_camera(camera_id)
            if camera is None:
                raise HTTPException(404, "Camera not found")
            session = _new_session(camera.view_mode)
            session.set_source(camera.source_type, camera.stream_url)
            _camera_sessions[camera_id] = session
            return session

        if channel is None:
            return stream_service
        if channel in _channels:
            return _channels[channel]
        if channel not in _channels:
            _channels[channel] = _new_session(channel)
            primary_id = next(camera_id for camera_id, view in _PRIMARY_CAMERAS.items() if view == channel)
            _camera_sessions[primary_id] = _channels[channel]
        return _channels[channel]


def select_camera_session(camera_id):
    from app.services.streaming.camera_registry import camera_registry_service
    from app.services.reid.service import reid_service
    camera = camera_registry_service.get_camera(camera_id)
    if camera is None:
        raise HTTPException(404, "Camera not found")
    with _lock:
        previous = get_stream_session(camera.view_mode)
        session = get_stream_session(camera_id=camera_id)
        if previous is not session:
            with previous.frame_streamer.selection.lock:
                previous.frame_streamer.selection.invalidate()
            with session.frame_streamer.selection.lock:
                _channels[camera.view_mode] = session
                session.tracking_manager.set_tracking_mode("auto")
                reid_service.reset_channel(camera.view_mode)
        return session
