# Gemini & AI Assistant Rules for Drone-Detect-Person

## System Directives & Non-Negotiable Engineering Standards

### 1. Zero Code Duplication (Strict DRY)
- **Frontend**: All component prop types live exclusively in `src/types/components.ts`. Threat logic in `src/utils/threatUtils.ts`. Hooks in `src/hooks/`.
- **Backend**: Microservice layers in `backend/app/services/` are decoupled. Pydantic schemas in `app/schemas/`. Detection profiles in `app/services/inference/profiles.py`.

### 2. Zero Code Inconsistency
- **Strict Perspective Coupling**:
  - `aerial`: Drone Flight, UAV Avionics, Overhead YOLO model, Synthetic Drone Simulation / RTSP Drone Link.
  - `ground`: Ground Security, Perimeter CCTV, Eye-level YOLO model, Hardware Webcam / Phone RTSP Stream.
- Standardized REST responses with typed envelopes and uniform error handling.

### 3. No Bad / Fragile Logic
- Zero unhandled promises, race conditions, or unvalidated array indexes.
- Dynamic fallback: Any disconnected hardware or network stream must automatically fallback to simulation without crashing the pipeline.

### 4. Zero Hardcoded Values
- **Frontend**: Centralize constants, stream source lists, and UI tokens in `src/constants/tactical.ts`.
- **Backend**: Centralize config parameters, thresholds, and paths in `app/core/config.py` loaded via `.env`.

### 5. Zero Inline Types
- Never declare `interface Props` inline inside `.tsx` files; always export from `src/types/components.ts` and import via `@/types`.
