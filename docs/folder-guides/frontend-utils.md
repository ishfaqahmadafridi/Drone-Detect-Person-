# 🛠️ Folder Guide: `frontend/src/utils/`

## 🎯 What this folder does (Simple Words)
This folder holds **pure helper functions and mathematical utility functions**.

It contains functions for formatting timestamps, styling threat ribbons based on alarm severity, validating API errors, transforming normalized polygon coordinates into canvas pixel positions, and preparing CSV/JSON audit exports.

---

## 🛠️ Technologies & Libraries Used
- **Vanilla TypeScript**: Pure deterministic functions with zero side-effects.
- **Date & Math APIs**: Fast coordinate scaling and UTC clock string formatting.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `threatUtils.ts` | Resolves color tokens, badge backgrounds, and ribbon styles for each `ThreatLevel`. |
| `formatters.ts` | Formats UTC military timestamps (`HH:MM:SS UTC`), dates, file sizes (KB/MB), and telemetry values. |
| `canvasUtils.ts` | Converts normalized polygon geofence points `[0.0, 1.0]` into pixel coordinates on `<canvas>` elements. |
| `apiError.ts` | Extracts user-friendly error messages from Axios network exceptions. |
| `cameraUtils.ts` | Helper predicates for camera online statuses, IP stream validation, and perspective matching. |
| `suspectSnapshots.ts` | Generates safe download filenames and image blob representations for suspect evidence. |
| `exportUtils.ts` | Exports incident audit logs to CSV or JSON formats for offline security reviews. |
| `gridUtils.ts` | Calculates responsive split-screen viewport layout dimensions for multi-camera grids. |
