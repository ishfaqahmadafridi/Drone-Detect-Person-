"""
Evidence SQL Query Builder: Constructs safe parameterized queries for SQLite pagination and filtering.
"""

from typing import List, Tuple, Optional, Any


def build_evidence_filters(
    view_mode: Optional[str] = None,
    media_type: Optional[str] = None,
    threat_level: Optional[str] = None,
) -> Tuple[str, List[Any]]:
    """Generates WHERE clause string and parameter list based on provided filters."""
    clauses: List[str] = []
    params: List[Any] = []

    if view_mode and view_mode.lower() != "all":
        clauses.append("view_mode = ?")
        params.append(view_mode.lower().strip())

    if media_type and media_type.lower() != "all":
        clauses.append("media_type = ?")
        params.append(media_type.lower().strip())

    if threat_level and threat_level.upper() != "ALL":
        clauses.append("threat_level = ?")
        params.append(threat_level.upper().strip())

    where_sql = f"WHERE {' AND '.join(clauses)}" if clauses else ""
    return where_sql, params


def build_list_query(
    view_mode: Optional[str] = None,
    media_type: Optional[str] = None,
    threat_level: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
) -> Tuple[str, List[Any]]:
    """Builds parameterized SELECT query for paginated evidence records."""
    where_sql, params = build_evidence_filters(
        view_mode=view_mode,
        media_type=media_type,
        threat_level=threat_level,
    )
    query = f"""
        SELECT * FROM evidence_records
        {where_sql}
        ORDER BY CASE WHEN media_type = 'video' THEN 0 ELSE 1 END, created_at DESC, id DESC
        LIMIT ? OFFSET ?;
    """
    params.extend([limit, offset])
    return query, params


def build_count_query(
    view_mode: Optional[str] = None,
    media_type: Optional[str] = None,
    threat_level: Optional[str] = None,
) -> Tuple[str, List[Any]]:
    """Builds parameterized COUNT query for total matching records."""
    where_sql, params = build_evidence_filters(
        view_mode=view_mode,
        media_type=media_type,
        threat_level=threat_level,
    )
    query = f"SELECT COUNT(*) AS total FROM evidence_records {where_sql};"
    return query, params
