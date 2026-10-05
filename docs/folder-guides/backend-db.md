# 🗄️ Folder Guide: `backend/app/db/`

## 🎯 What this folder does (Simple Words)
This folder handles everything related to the **SQLite database (`evidence.db`)**. 

Whenever the system detects an intruder, captures a snapshot photo, or saves a video recording, the files in this folder save that information permanently to SQLite so you can review it later in the Recordings and Incidents tabs.

---

## 🛠️ Technologies & Libraries Used
- **`sqlite3`**: Built-in Python database engine.
- **WAL Mode (Write-Ahead Logging)**: High-performance SQLite mode that allows reading from the database while AI is actively writing new alerts.
- **Pydantic**: Validates and serializes database rows into typed Python objects.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `connection.py` | `DatabaseManager` creates thread-safe connections with WAL mode and manages transaction sessions (`commit`/`rollback`). |
| `schema.py` | Runs SQL DDL statements to create the `evidence_records` table and fast lookup indexes. |
| `repository.py` | `EvidenceRepository` handles CRUD (Create, Read, Update, Delete) database operations. |
| `mappers.py` | Converts raw SQLite database rows into typed `EvidenceRecord` models and serializes JSON metadata. |
| `query_builder.py` | Builds injection-safe SQL queries with filtering (`view_mode`, `threat_level`, `media_type`) and pagination. |
| `syncer.py` | `FilesystemSyncer` scans physical snapshot and recording folders to ensure the database matches files on disk. |
