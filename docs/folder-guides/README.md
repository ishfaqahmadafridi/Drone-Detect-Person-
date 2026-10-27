# 📚 AERO-GUARD Folder Guides & Architecture Documentation

This directory contains clear, simple, and detailed guides explaining every single folder and module in the **AERO-GUARD** drone detection & surveillance project.

---

## 🗂️ Table of Contents

### 🐍 Backend Folders (`backend/`)
1. [**backend-api-v1.md**](./backend-api-v1.md) — FastAPI REST Endpoints & WebSockets
2. [**backend-core.md**](./backend-core.md) — Configuration, Paths, Constants & Device Selection
3. [**backend-db.md**](./backend-db.md) — SQLite Database, WAL Connection, Mappers & Repository
4. [**backend-schemas.md**](./backend-schemas.md) — Pydantic Data Models & Request/Response Validation
5. [**backend-services-detector.md**](./backend-services-detector.md) — YOLO Detection, Trackers & FPS Profiler
6. [**backend-services-inference.md**](./backend-services-inference.md) — Multi-View Model Loader & Registry
7. [**backend-services-streaming.md**](./backend-services-streaming.md) — MJPEG Live Video Feeds, Channels & Avionics
8. [**backend-services-reid.md**](./backend-services-reid.md) — Ground-to-Aerial Person Re-Identification (X-TFCLIP)
9. [**backend-services-zone.md**](./backend-services-zone.md) — Geofence Restricted Zone Intrusion Monitoring
10. [**backend-services-alert.md**](./backend-services-alert.md) — Threat Level Classifier & Evidence Snapshots
11. [**backend-services-recording.md**](./backend-services-recording.md) — Video Clip Recording & Pre-Roll Buffers
12. [**backend-simulator.md**](./backend-simulator.md) — Synthetic Flight Physics & Pedestrian Video Generator
13. [**backend-models.md**](./backend-models.md) — Model Weight Files (.pt), Checksums & Model Registry

---

### ⚛️ Frontend Folders (`frontend/`)
14. [**frontend-app-routes.md**](./frontend-app-routes.md) — Next.js 16 App Router & Navigation Deep Links
15. [**frontend-components-tactical.md**](./frontend-components-tactical.md) — Tactical HUD, Video Viewport, Camera Wall & Decks
16. [**frontend-hooks.md**](./frontend-hooks.md) — Custom React Hooks (Orchestrator, ReID, WebSockets, Audio)
17. [**frontend-services.md**](./frontend-services.md) — Axios HTTP Client, TanStack React Query Hooks & API Layer
18. [**frontend-store.md**](./frontend-store.md) — Redux Toolkit Slices (Telemetry, UI, Config)
19. [**frontend-types.md**](./frontend-types.md) — Strict TypeScript Interfaces, Enums & Component Props
20. [**frontend-utils.md**](./frontend-utils.md) — Threat Calculation, Formatting Helpers & Canvas Math
