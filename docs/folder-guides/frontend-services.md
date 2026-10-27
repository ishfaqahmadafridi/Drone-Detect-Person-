# 🌐 Folder Guide: `frontend/src/services/`

## 🎯 What this folder does (Simple Words)
This folder is the **data fetching and API integration layer** for the frontend.

It contains configured Axios HTTP clients and TanStack React Query hooks that communicate with the FastAPI backend, automatically caching data, handling retries, and invalidating stale queries when new evidence is created.

---

## 🛠️ Technologies & Libraries Used
- **Axios**: Promise-based HTTP client for making REST API calls.
- **TanStack React Query (v5)**: Asynchronous state management, intelligent query caching, background refetching, and mutation hooks.

---

## 📄 Files Inside & What They Do

| File / Folder | What it does |
| :--- | :--- |
| `api/client.ts` | Configures the shared Axios client with base URL `/api`, timeouts, and standardized error formatting. |
| `api/streamApi.ts` | Endpoints for switching camera feeds, testing network connections, uploading test videos, and replaying streams. |
| `api/cameraApi.ts` | CRUD endpoints for registering, testing, and modifying CCTV camera links. |
| `api/reidApi.ts` | Endpoints for fetching suspect matching status and triggering retrieval retries. |
| `api/evidenceApi.ts` | Queries and deletes recorded media from the SQLite database. |
| `api/droneApi.ts` | Sends flight operations and camera health diagnostics requests. |
| `api/configApi.ts` | Fetches and updates AI detection thresholds and geofence zones. |
| `queries/useAlertsQuery.ts` | React Query hook fetching recent incident alerts with automated background polling. |
| `queries/useSnapshotsQuery.ts` | React Query hook caching the evidence snapshot gallery. |
| `queries/useStreamMutation.ts` | Mutation hooks for switching perspectives (`aerial` vs `ground`) and stream sources. |
