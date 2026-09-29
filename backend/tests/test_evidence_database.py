"""
Automated unit tests for SQLite EvidenceRepository and VideoClipRecorder.
"""

import os
import unittest
from app.db import evidence_repository, EvidenceRecordCreate
from app.services.recording import video_recorder


class TestEvidenceDatabase(unittest.TestCase):
    def test_repository_crud(self):
        # 1. Insert test record
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

        # 2. Query record by filename and ID
        fetched = evidence_repository.get_by_id(record.id)
        self.assertIsNotNone(fetched)
        self.assertEqual(fetched.threat_level, "INTRUSION")

        # 3. Filtered query
        video_records = evidence_repository.list_records(media_type="video", view_mode="aerial")
        self.assertTrue(any(r.filename == "unit_test_video_001.mp4" for r in video_records))

        # 4. Clean up test record
        deleted = evidence_repository.delete(record.id)
        self.assertTrue(deleted)
        self.assertIsNone(evidence_repository.get_by_id(record.id))

    def test_video_recorder_state(self):
        self.assertFalse(video_recorder.is_recording)


if __name__ == "__main__":
    unittest.main()
