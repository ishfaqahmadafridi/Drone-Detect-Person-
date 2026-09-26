"""Bounded, per-video ByteTrack state for the local single-process prototype.

Images/crops are never stored here. A cloud deployment must externalize session state.
"""

import math
import threading
import time
import uuid
from collections import OrderedDict
from types import SimpleNamespace

import numpy as np


class StaleTrackingFrame(ValueError):
    pass


class TrackingSessions:
    def __init__(self, max_sessions=16, ttl_seconds=300, clock=time.monotonic):
        self.sessions = OrderedDict()
        self.max_sessions = max_sessions
        self.ttl_seconds = ttl_seconds
        self.clock = clock
        self.lock = threading.RLock()

    @staticmethod
    def _new_tracker(confidence):
        from ultralytics.trackers.byte_tracker import BYTETracker

        class SessionByteTracker(BYTETracker):
            @staticmethod
            def reset_id():
                # Ultralytics uses a global counter. Starting another browser/video must
                # not reset IDs underneath an existing tracker in this process.
                pass

        return SessionByteTracker(SimpleNamespace(
            track_high_thresh=confidence, track_low_thresh=min(0.1, confidence / 2),
            new_track_thresh=confidence, track_buffer=15, match_thresh=0.8, fuse_score=True,
        ))

    def discard(self, session_id):
        with self.lock:
            self.sessions.pop(session_id, None)

    def update(self, session_id, detections, width, height, frame_id, source_time, confidence, imgsz):
        from ultralytics.engine.results import Boxes

        if not math.isfinite(source_time) or source_time < 0:
            raise ValueError("Tracking needs a finite, non-negative source timestamp.")
        with self.lock:
            now = self.clock()
            for key in list(self.sessions):
                if now - self.sessions[key]['used'] > self.ttl_seconds:
                    del self.sessions[key]
            session = self.sessions.get(session_id)
            settings = (width, height, confidence, imgsz)
            reason = 'new_session' if session is None else None
            if session:
                if frame_id <= session['frame_id']:
                    raise StaleTrackingFrame("Tracking frames must arrive in increasing frame_id order.")
                delta = source_time - session['source_time']
                if delta <= 0:
                    reason = 'video_restarted_or_seeked'
                elif delta > 3:
                    reason = 'source_time_gap'
                elif settings != session['settings']:
                    reason = 'settings_changed'
            if reason:
                session = dict(tracker=self._new_tracker(confidence), epoch=uuid.uuid4().hex,
                               source_time=source_time, frame_id=frame_id, settings=settings)
                self.sessions[session_id] = session
            session['used'] = now
            self.sessions.move_to_end(session_id)
            while len(self.sessions) > self.max_sessions:
                self.sessions.popitem(last=False)

            # Advance the motion model using source time, not HTTP request timing.
            # Ten virtual steps/second is a motion clock, not a claim of 10 FPS inference.
            empty = Boxes(np.empty((0, 6), dtype=np.float32), (height, width))
            if not reason:
                steps = max(1, round((source_time - session['source_time']) * 10))
                for _ in range(steps - 1):
                    session['tracker'].update(empty)
            rows = []
            for detection in detections:
                x, y, w, h = detection['bbox_normalized']
                rows.append([x * width, y * height, (x + w) * width, (y + h) * height,
                             detection['confidence'], detection['class_id']])
            boxes = Boxes(np.asarray(rows, dtype=np.float32).reshape(-1, 6), (height, width))
            tracks = session['tracker'].update(boxes)
            assignments = {int(row[-1]): int(row[4]) for row in tracks}
            output = []
            for index, detection in enumerate(detections):
                track_id = assignments.get(index)
                # Low-confidence detections are useful to maintain existing tracks,
                # but must not appear as unrelated new candidates.
                if track_id is None and detection['confidence'] < confidence:
                    continue
                item = dict(detection, track_id=track_id)
                if track_id is not None:
                    item['id'] = f"A-{session['epoch']}-{track_id}"
                output.append(item)
            session.update(source_time=source_time, frame_id=frame_id)
            return dict(detections=output, tracking=True, tracker='ByteTrack',
                        tracking_session=session_id, tracking_epoch=session['epoch'],
                        tracking_reset_reason=reason, source_time=source_time)
