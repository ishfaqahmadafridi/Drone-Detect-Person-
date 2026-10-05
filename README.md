# AERO-GUARD: Person Detection and Tracking

A FastAPI computer-vision backend and Next.js dashboard for detecting individual people in ground-camera and aerial video. Every detected person receives a bounding box, confidence score and tracking ID. Ground operators can freeze the active frame to select suspects; selected people are highlighted while the remaining person boxes stay visible.

## Features

- Ground video: YOLO26n person detection with ByteTrack.
- Aerial video: YOLO11n VisDrone person detection with BoT-SORT.
- Test-video uploads with format, size and decode validation.
- One inference producer shared across MJPEG viewers, with WebSocket telemetry.
- Real-time uploaded-video preview: skips source frames when CPU processing falls behind; every displayed frame is analyzed.
- Ground-only frozen-frame suspect selection, cancellation and automatic expiry.
- Optional restricted-zone intrusion monitoring and evidence capture.

## Structure

```text
backend/
  main.py                    FastAPI entrypoint
  app/api/v1/endpoints/       HTTP and WebSocket routes
  app/schemas/               Request/response contracts
  app/services/detector/     Model inference and tracked detections
  app/services/annotation/   Individual person boxes and labels
  app/services/streaming/    Sources, playback clock, pipeline, selection
  app/services/zone/         Optional restricted-zone geometry
  app/core/                  Settings and constants
  models/                    Checkpoints and checksum-verified registry
  tests/                     Regression tests
frontend/src/
  components/tactical/       Dashboard components
  hooks/                     UI state and effects
  services/                  API calls and queries
  types/                     Shared contracts and component props
  constants/                 Settings and visual tokens
  utils/                     Reusable helpers
```

## Start locally

Create a backend Python environment and install `backend/requirements.txt`. In separate terminals:

```powershell
cd backend
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

```powershell
cd frontend
npm ci
npm run dev
```

Dashboard: http://127.0.0.1:3000. API documentation: http://127.0.0.1:8000/docs.

Select Ground CCTV for eye-level footage and Aerial Drone for drone footage before uploading. Synthetic feeds use simulated targets and do not measure model accuracy. CPU processing FPS is shown in the dashboard; real-time preview can skip frames and should not be treated as exhaustive offline analysis.

See [video testing and suspect selection](docs/video-testing-and-suspect-selection.md) and [model configuration](backend/models/README.md).

## Person re-identification module

The ground-to-aerial X-TFCLIP integration is documented in
[docs/person-reidentification.md](docs/person-reidentification.md), including
the module map, CPU setup, GPU migration, and benchmark procedure. The provided
environment template enables CPU ReID; the official checkpoint can be installed
with `python scripts/setup_reid.py --install-source --download-weights` from `backend`.
