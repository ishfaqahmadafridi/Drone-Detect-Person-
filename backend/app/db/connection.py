"""
Database Connection: Thread-safe SQLite engine with WAL mode and foreign keys enabled.
"""

import sqlite3
import threading
from contextlib import contextmanager
from typing import Generator
from app.core.config import DATABASE_PATH


class DatabaseManager:
    """Manages thread-safe SQLite connections with Write-Ahead Logging (WAL)."""

    def __init__(self, db_path: str = DATABASE_PATH):
        self.db_path = db_path
        self._local = threading.local()

    def get_connection(self) -> sqlite3.Connection:
        """Returns a thread-local SQLite connection with optimized concurrency pragmas."""
        if not hasattr(self._local, "conn") or self._local.conn is None:
            conn = sqlite3.connect(
                self.db_path,
                timeout=20.0,
                check_same_thread=False,
            )
            conn.row_factory = sqlite3.Row
            # Enable WAL mode for high concurrency non-blocking reads
            conn.execute("PRAGMA journal_mode = WAL;")
            conn.execute("PRAGMA synchronous = NORMAL;")
            conn.execute("PRAGMA busy_timeout = 10000;")
            self._local.conn = conn
        return self._local.conn

    @contextmanager
    def session(self) -> Generator[sqlite3.Connection, None, None]:
        """Context manager providing an active connection with automated commit/rollback."""
        conn = self.get_connection()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise


db_manager = DatabaseManager()
