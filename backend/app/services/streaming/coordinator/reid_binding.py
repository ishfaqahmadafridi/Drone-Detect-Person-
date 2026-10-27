"""Connect stream events to cross-camera identity tracking."""


def bind_reid(session, is_active=None):
    from app.services.reid.service import reid_service

    def active():
        return is_active is None or is_active()

    def view():
        return getattr(session, "fixed_view", None) or session.config.view_mode

    def observe(frame, detections, frame_idx, source_type, selected_ids):
        if active():
            reid_service.observe(view(), frame, detections,
                                 frame_idx, source_type, selected_ids)

    def invalidate():
        if active():
            reid_service.reset_channel(view())

    def commit(ids):
        if active() and view() == "ground":
            reid_service.select(ids)

    def freeze():
        if active() and view() == "ground":
            reid_service.freeze_ground()

    def resume():
        if active() and view() == "ground":
            reid_service.resume_ground()

    session.pipeline_processor.set_frame_observer(observe)
    session.frame_streamer.on_invalidate = invalidate
    selection = session.frame_streamer.selection
    selection.on_commit = commit
    selection.on_freeze = freeze
    selection.on_resume = resume
