"""
Filesystem Evidence Syncer: Migrates and reconciles disk artifacts into SQLite database.
"""

import os
import re
from datetime import datetime
from typing import TYPE_CHECKING

from app.core.config import SNAPSHOTS_DIR, RECORDINGS_DIR
from app.schemas.evidence import EvidenceRecordCreate
from app.db.connection import db_manager

if TYPE_CHECKING:
    from app.db.repository import EvidenceRepository


def infer_view_mode(filename: str) -> str:
    """Perspective from a filename token, e.g. ``aerial_syn_1.jpg`` or ``alert_x_ground_2.jpg``."""
    tokens = re.split(r"[_.\-]", filename.lower())
    if "aerial" in tokens:
        return "aerial"
    return "ground"


class FilesystemSyncer:
    """Synchronizes pre-existing disk snapshots and recordings with the SQLite database."""

    @staticmethod
    def sync(repository: "EvidenceRepository") -> int:
        """
        Scan snapshots and recordings directories, inserting any missing records into SQLite.
        Returns the number of records synced.
        """
        synced_count = 0

        # 1. Sync snapshots directory
        if os.path.exists(SNAPSHOTS_DIR):
            for fname in os.listdir(SNAPSHOTS_DIR):
                if fname.lower().endswith((".jpg", ".jpeg", ".png")):
                    full_p = os.path.join(SNAPSHOTS_DIR, fname)
                    try:
                        stat = os.stat(full_p)
                    except OSError:
                        continue

                    view_mode = infer_view_mode(fname)
                    threat_level = (
                        "INTRUSION"
                        if "intrusion" in fname.lower()
                        else "CLEAR"
                    )
                    threat_type = (
                        "ZONE INTRUSION"
                        if threat_level == "INTRUSION"
                        else "PERSON DETECTION"
                    )
                    created_at = datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S")

                    create_dto = EvidenceRecordCreate(
                        media_type="image",
                        filename=fname,
                        file_path=full_p,
                        url=f"/snapshots/{fname}",
                        thumbnail_url=f"/snapshots/{fname}",
                        view_mode=view_mode,
                        threat_level=threat_level,
                        threat_type=threat_type,
                        duration_seconds=0.0,
                        file_size_kb=round(stat.st_size / 1024, 1),
                        created_at=created_at,
                    )
                    repository.insert(create_dto)
                    synced_count += 1

        # 2. Sync recordings directory
        if os.path.exists(RECORDINGS_DIR):
            for fname in os.listdir(RECORDINGS_DIR):
                if fname.lower().endswith((".mp4", ".avi", ".mkv", ".webm")):
                    full_p = os.path.join(RECORDINGS_DIR, fname)
                    try:
                        stat = os.stat(full_p)
                        if stat.st_size <= 1024:
                            continue
                    except OSError:
                        continue

                    view_mode = infer_view_mode(fname)
                    threat_level = (
                        "INTRUSION"
                        if "intrusion" in fname.lower()
                        else "MONITORING"
                    )
                    threat_type = "EVIDENTIARY VIDEO RECORDING"
                    created_at = datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S")

                    create_dto = EvidenceRecordCreate(
                        media_type="video",
                        filename=fname,
                        file_path=full_p,
                        url=f"/recordings/{fname}",
                        thumbnail_url=None,
                        view_mode=view_mode,
                        threat_level=threat_level,
                        threat_type=threat_type,
                        duration_seconds=0.0,
                        file_size_kb=round(stat.st_size / 1024, 1),
                        created_at=created_at,
                    )
                    repository.insert(create_dto)
                    synced_count += 1

        # Rows synced before token matching existed recorded `aerial_*` files as ground.
        with db_manager.session() as conn:
            conn.execute(
                "UPDATE evidence_records SET view_mode = 'aerial' "
                "WHERE view_mode = 'ground' AND filename LIKE 'aerial\\_%' ESCAPE '\\'"
            )

        return synced_count
