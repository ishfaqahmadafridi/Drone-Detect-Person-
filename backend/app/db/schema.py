"""
SQLite Schema and Table Initializer for Evidence Records.
"""

from app.db.connection import db_manager

EVIDENCE_TABLE_SQL = """
CREATE TABLE IF NOT EXISTS evidence_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    media_type TEXT NOT NULL,
    filename TEXT NOT NULL UNIQUE,
    file_path TEXT NOT NULL,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    view_mode TEXT NOT NULL,
    threat_level TEXT NOT NULL,
    threat_type TEXT NOT NULL,
    duration_seconds REAL DEFAULT 0.0,
    file_size_kb REAL DEFAULT 0.0,
    width INTEGER DEFAULT 1280,
    height INTEGER DEFAULT 720,
    fps REAL DEFAULT 25.0,
    created_at TEXT NOT NULL,
    metadata_json TEXT DEFAULT '{}'
);
"""

EVIDENCE_INDEXES_SQL = [
    "CREATE INDEX IF NOT EXISTS idx_evidence_created ON evidence_records(created_at DESC);",
    "CREATE INDEX IF NOT EXISTS idx_evidence_view ON evidence_records(view_mode);",
    "CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence_records(media_type);",
    "CREATE INDEX IF NOT EXISTS idx_evidence_threat ON evidence_records(threat_level);",
]


def initialize_schema() -> None:
    """Execute table DDL and index creation in SQLite database."""
    with db_manager.session() as conn:
        conn.execute(EVIDENCE_TABLE_SQL)
        for index_sql in EVIDENCE_INDEXES_SQL:
            conn.execute(index_sql)
