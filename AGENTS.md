# Agent Guidelines for Drone-Detect-Person (AERO-GUARD)

This repository is governed by strict, senior-level engineering rules across both Frontend and Backend microservices:

## Directory Structure
- `backend/`: FastAPI Computer Vision & Aerial Detection Engine (YOLOv8 + ByteTrack + WebSockets + MJPEG stream).
- `frontend/`: Next.js 16 + TypeScript + Tailwind CSS Tactical HUD (interactive canvas zone editor, Web Audio siren, telemetry tiles).

## Core Quality & Architecture Directives

### 1. Zero Code Duplication (Strict DRY)
- **Frontend**:
  - Prop contracts and types MUST be centralized in `src/types/components.ts` and `src/types/index.ts`. Never redeclare types or interfaces in `.tsx` files.
  - Reusable domain logic (e.g. threat predicates, badge styles, metric formatting) MUST live in `src/utils/`.
  - State, side-effects, and queries MUST be abstracted into dedicated custom hooks in `src/hooks/`.
- **Backend**:
  - Pydantic schemas must be centralized in `app/schemas/`.
  - Vision processing, tracking, zoning, and alerts must remain modular under `app/services/` with zero redundant frame processing loops.
  - Coordinate transformations and polygon math must reside in `app/services/zone/` and `app/services/tracking/`.

### 2. Zero Code Inconsistency
- **Perspective & Source Coupling**:
  - **`AERIAL DRONE` (`aerial`)**: Strictly maps to drone flight feeds (Synthetic UAV Simulation or live Drone RTSP/Wi-Fi link). Associated with UAV telemetry, flight control deck, and top-down aerial vision models.
  - **`GROUND CCTV` (`ground`)**: Strictly maps to perimeter security cameras (Local Webcam, IP Phone Stream, or Perimeter CCTV RTSP). Associated with eye-level vision models and fixed perimeter security controls.
- **Naming Conventions**:
  - React components must follow PascalCase and be export-pure from index files.
  - Backend endpoints, models, and services must maintain snake_case naming and adhere to unified response envelopes.

### 3. Zero Bad / Fragile Logic
- **Defensive Engineering**:
  - Safe property access everywhere (e.g. `.get()` with fallbacks on dictionaries, optional chaining in TypeScript).
  - Robust hardware stream fallbacks: If a webcam, capture card, or RTSP network link is disconnected, the system must gracefully fall back to procedural simulation without dropping the MJPEG connection or crashing the server.
- **No Race Conditions**: State updates and camera perspective switches must be idempotent, debounced where appropriate, and synchronized across WebSockets and Redux.

### 4. Zero Hardcoded Values
- **Frontend**:
  - All stream source options, threat ribbon styling tokens, default polygons, and UI thresholds must be declared in `src/constants/tactical.ts`.
  - Never hardcode API ports, endpoint paths, or styling colors inside individual UI components.
- **Backend**:
  - All model names, paths, confidence thresholds, IOU ratios, snapshot directories, and timeouts must be defined in `app/core/config.py` and `app/core/constants.py` and overridden via `.env`.

### 5. Strict Component Purity & Modularity
- Zero inline types in `.tsx` files: Every component imports its props interface from `@/types`.
- All modals, overlays, toolbars, and badges are atomic components with single responsibilities.
