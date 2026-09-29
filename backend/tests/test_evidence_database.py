"""
Automated unit tests for SQLite EvidenceRepository, PreRollBuffer, VideoContainerWriter, and VideoClipRecorder.
"""

import os
import shutil
import tempfile
import unittest
import numpy as np

from app.db import evidence_repository, FilesystemSyncer, initialize_schema
from app.schemas.evidence import EvidenceRecordCreate
from app.services.recording import PreRollBuffer, VideoContainerWriter, video_recorder


class TestEvidenceDatabase(unittest.TestCase):
    def setUp(self):
        initialize_schema()

    def test_repository_crud(self):
        test_dto = EvidenceRecordCreate(
            media_type="video",
            filename="unit_test_video_001.mp4",
            file_path="/tmp/unit_test_video_001.mp4",
            url="/recordings/unit_test_video_001.mp4",
            thumbnail_url="/snapshots/thumb_unit_test.jpg",
            view_mode="aerial",
            threat_level="INTRUSION",
            threat_type="ZONE INTRUSION",
            duration_seconds=5.5,
            file_size_kb=1024.0,
            width=1280,
            height=720,
            fps=25.0,
            created_at="2026-09-29 21:00:00",
            metadata_json={"test_key": "test_val"},
        )
        record = evidence_repository.insert(test_dto)
        self.assertIsNotNone(record)
        self.assertEqual(record.filename, "unit_test_video_001.mp4")
        self.assertEqual(record.media_type, "video")
        self.assertEqual(record.duration_seconds, 5.5)

        fetched = evidence_repository.get_by_id(record.id)
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.threat_level, "INTRUSION")

        video_records = evidence_repository.list_records(media_type="video", view_mode="aerial")
        self.assertTrue(any(r.filename == "unit_test_video_001.mp4" for r in video_records))

        deleted = evidence_repository.delete(record.id)
        self.assertTrue(deleted)
        self.assertIsNone(evidence_repository.get_by_id(record.id))

    def test_preroll_buffer(self):
        buf = PreRollBuffer(fps=10.0, pre_roll_seconds=1.0)
        self.assertEqual(len(buf), 0)

        # Push 15 frames into 10-frame buffer
        for i in range(15):
            dummy_frame = np.zeros((100, 100, 3), dtype=np.uint8)
            buf.append(dummy_frame, view_mode="aerial")

        self.assertEqual(len(buf), 10)
        frames = buf.get_frames()
        self.assertEqual(len(frames), 10)
        self.assertEqual(frames[0][1], "aerial")

        buf.clear()
        self.assertEqual(len(buf), 0)

    def test_video_container_writer_lifecycle(self):
        temp_dir = tempfile.mkdtemp()
        rec_dir = os.path.join(temp_dir, "recordings")
        snap_dir = os.path.join(temp_dir, "snapshots")

        try:
            writer = VideoContainerWriter(recordings_dir=rec_dir, snapshots_dir=snap_dir, fps=10.0)
            self.assertFalse(writer.is_active)

            filename = writer.open(view_mode="aerial", width=320, height=240)
            self.assertTrue(writer.is_active)
            self.assertIn("aerial", filename)

            # Write 5 frames
            for _ in range(5):
                frame = np.zeros((240, 320, 3), dtype=np.uint8)
                written = writer.write_frame(frame)
                self.assertTrue(written)

            self.assertEqual(writer.frame_count, 5)

            duration, size_kb = writer.close()
            self.assertFalse(writer.is_active)
            self.assertGreater(duration, 0.0)
        finally:
            shutil.rmtree(temp_dir)

    def test_video_recorder_state(self):
        self.assertFalse(video_recorder.is_recording)


if __name__ == "__main__":
    unittest.main()
