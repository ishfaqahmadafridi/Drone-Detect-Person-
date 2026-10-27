# 📐 Folder Guide: `frontend/src/types/`

## 🎯 What this folder does (Simple Words)
This folder defines all **TypeScript interfaces, types, and component prop contracts**.

Per repository rules, no component is allowed to declare inline types. All props, API data models, and enums are centralized here to ensure strict type safety, autocompletion, and zero code duplication across the entire frontend.

---

## 🛠️ Technologies & Libraries Used
- **TypeScript**: Static type-checking system for JavaScript.

---

## 📄 Files Inside & What They Do

| File / Folder | What it does |
| :--- | :--- |
| `common.ts` | Base domain types: `ThreatLevel` (`CLEAR`, `MONITORING`, `INTRUSION`, `MANUAL`), `StreamSourceType`, `TacticalNavTab`, and `TrackingMode`. |
| `telemetry.ts` | Interfaces for live sensor feeds, detected person bounding boxes, speed vectors, and drone avionics. |
| `incidents.ts` | Data models for incident alarms, threat categories, and event timestamps. |
| `reid.ts` | Interfaces for Person Re-Identification queries, candidate rankings, and similarity scores. |
| `videoTesting.ts` | Types for test video uploading, suspect selection sessions, and playback clock statuses. |
| `components/` | Dedicated prop interfaces for every single tactical React component (Header, Viewport, CameraWall, TuningPanel, Sidebar, etc.). |
| `index.ts` | Barrel export re-exporting all types from a single clean entrypoint `@/types`. |
