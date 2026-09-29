"""
Recording Persistence: Handles database record serialization and SQLite indexing.
"""

import os
from datetime import datetime
from typing import Optional, Tuple

from app.db import evidence_repository
from app.schemas.evidence import EvidenceRecord, EvidenceRecordCreate


class RecordingFinalizer:
    """Validates finalized video artifacts and commits evidence records to SQLite."""

    @staticmethod
    def commit_evidence_record(
        filename: str,
        filepath: str,
        thumbnail_path: Optional[str],
        duration: float,
        file_size_kb: float,
        resolution: Tuple[int, int],
        fps: float,
        frame_count: int,
        view_mode: str,
        threat_level: str,
    ) -> Optional[EvidenceRecord]:
        """Validate media existence, format DTO, and insert into persistent evidence repository."""
        if not filepath or not os.path.exists(filepath):
            return None

        # Build companion thumbnail URL if generated
        thumb_url = None
        if thumbnail_path and os.path.exists(thumbnail_path):
            thumb_url = f"/snapshots/{os.path.basename(thumbnail_path)}"

        created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        width, height = resolution

        threat_type = (
            "MANUAL RECORDING"
            if threat_level == "MANUAL"
            else "EVIDENTIARY VIDEO CLIP"
        )

        dto = EvidenceRecordCreate(
            media_type="video",
            filename=filename,
            file_path=filepath,
            url=f"/recordings/{filename}",
            thumbnail_url=thumb_url,
            view_mode=view_mode,
            threat_level=threat_level,
            threat_type=threat_type,
            duration_seconds=round(duration, 1),
            file_size_kb=file_size_kb,
            width=width,
            height=height,
            fps=fps,
            created_at=created_at,
            metadata_json={"frames_recorded": frame_count},
        )

        record = evidence_repository.insert(dto)
        print(f"[RECORDER] Video finalized & committed to database: {filename} ({file_size_kb} KB, {duration:.1f}s)")
        return record
