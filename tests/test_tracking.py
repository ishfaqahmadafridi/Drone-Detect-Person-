import os
import unittest
from pathlib import Path

os.environ.setdefault('YOLO_CONFIG_DIR', str(Path(__file__).resolve().parents[1] / '.runtime' / 'ultralytics'))
from tracking import TrackingSessions, StaleTrackingFrame


def person(x=0.1, confidence=0.9):
    return dict(id='frame-detection', bbox_normalized=[x, 0.2, 0.1, 0.3],
                confidence=confidence, class_id=0, class_name='person')


class TrackingTests(unittest.TestCase):
    def setUp(self):
        self.store = TrackingSessions()

    def update(self, session='one', frame=1, timestamp=0, detections=None, **options):
        return self.store.update(session, [person()] if detections is None else detections,
                                 options.get('width', 1000), 600, frame, timestamp, 0.25, 640)

    def test_id_survives_motion_low_confidence_and_short_miss(self):
        first = self.update()['detections'][0]['id']
        second = self.update(frame=2, timestamp=0.1, detections=[person(0.102, 0.15)])
        self.assertEqual(first, second['detections'][0]['id'])
        self.assertEqual(self.update(frame=3, timestamp=0.2, detections=[])['detections'], [])
        recovered = self.update(frame=4, timestamp=0.3, detections=[person(0.104)])
        self.assertEqual(first, recovered['detections'][0]['id'])

    def test_sessions_do_not_reset_each_others_ids(self):
        first = self.update()['detections'][0]['id']
        other = self.update(session='two')['detections'][0]['id']
        self.assertNotEqual(first, other)
        self.update(frame=2, timestamp=0.1, detections=[person(), person(0.6)])
        result = self.update(frame=3, timestamp=0.2, detections=[person(), person(0.6)])
        self.assertEqual(result['detections'][0]['id'], first)
        self.assertNotEqual(result['detections'][0]['track_id'], result['detections'][1]['track_id'])

    def test_seek_gap_and_resize_start_distinct_segments(self):
        result = self.update(timestamp=1)
        for frame, timestamp, width, reason in [(2, 0, 1000, 'video_restarted_or_seeked'),
                                                (3, 4, 1000, 'source_time_gap'),
                                                (4, 4.1, 500, 'settings_changed')]:
            previous = result['tracking_epoch']
            result = self.update(frame=frame, timestamp=timestamp, width=width)
            self.assertNotEqual(result['tracking_epoch'], previous)
            self.assertEqual(result['tracking_reset_reason'], reason)

    def test_stale_frames_are_rejected_without_rewinding_tracker(self):
        self.update(frame=3)
        with self.assertRaises(StaleTrackingFrame):
            self.update(frame=2, timestamp=0.1)
        self.assertEqual(self.store.sessions['one']['frame_id'], 3)

    def test_state_is_bounded_expires_and_can_be_released(self):
        now = [0]
        self.store = TrackingSessions(max_sessions=2, ttl_seconds=5, clock=lambda: now[0])
        for session in ['one', 'two', 'three']:
            self.update(session=session)
        self.assertEqual(list(self.store.sessions), ['two', 'three'])
        now[0] = 6
        self.update(session='four')
        self.assertEqual(list(self.store.sessions), ['four'])
        self.store.discard('four')
        self.assertEqual(len(self.store.sessions), 0)


if __name__ == '__main__':
    unittest.main()
