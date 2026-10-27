# AERO-GUARD

AERO-GUARD combines a FastAPI computer-vision backend with a Next.js tactical dashboard for person detection, tracking, ground-to-aerial suspect workflows, and manual Tello control.

## Features

- **Ground CCTV:** webcam, IP camera, and uploaded-video workflows with person detection and tracking.
- **Aerial Drone:** aerial detection profiles, synthetic feeds, and supported live video sources.
- **Suspect selection:** freeze a ground frame, select tracked people, and capture portraits for the optional re-identification workflow.
- **Streaming:** MJPEG previews and WebSocket telemetry, with isolated named camera channels and shared processing for viewers of the same channel.
- **Monitoring:** restricted-zone editing, intrusion alerts, snapshots, and recordings.
- **Tello manual control:** connect, take off, hold directional controls, rotate, hover, land, and disconnect. Simulation is enabled by default.

Ground and aerial channels have distinct source roles. Model selection and tracker settings are defined in the [model registry](backend/models/README.md). The default ground model is YOLO26n with ByteTrack; the aerial VisDrone profile uses YOLO11n with BoT-SORT. An optional general aerial profile supports closer footage.

## Technology

| Backend | Frontend |
| --- | --- |
| Python 3.12, FastAPI, OpenCV, Ultralytics | Next.js 16, React, TypeScript, Tailwind CSS |
| MJPEG, WebSockets, UDP Tello SDK transport | Redux Toolkit, TanStack Query |
| pytest and local UDP integration tests | Vitest, Testing Library, Playwright |

## Local setup

Use Python 3.12 and Node.js 20.9 or newer. Run the backend and frontend in separate terminals.

### Backend

From the repository root on macOS or Linux:

```sh
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements-test.txt
cp .env.example .env
```

On Windows PowerShell, create the environment with `py -3.12 -m venv .venv`, activate it with `.\.venv\Scripts\Activate.ps1`, and copy the template with `Copy-Item .env.example .env`.

Review `.env` before starting. For basic detection without the optional ReID checkpoint, set `REID_ENABLED=false`. To enable ReID, follow the [ReID setup guide](docs/person-reidentification.md). Optional external services require their own configuration; keep credentials out of version control.

With the virtual environment active, download the registered detection checkpoints and start the API:

```sh
python scripts/download_models.py
python -m uvicorn main:app --host 127.0.0.1 --port 8000
```

`requirements-test.txt` includes runtime and test dependencies. Deployments that do not run tests can install `requirements.txt` instead.

### Frontend

```sh
cd frontend
npm ci
npm run dev
```

- Dashboard: <http://127.0.0.1:3000>
- API documentation: <http://127.0.0.1:8000/docs>

The frontend proxies requests to the local backend by default. Set `BACKEND_ORIGIN` when using a different backend address. Shared defaults live in `frontend/src/constants/deployment.json`; browser API and WebSocket overrides are defined in `frontend/src/constants/network.ts`.

## Using the dashboard

1. Select **Ground CCTV** for eye-level camera footage or **Aerial Drone** for drone footage.
2. Choose a source or upload a video. Synthetic feeds demonstrate application behavior using simulated targets.
3. On a ground feed, freeze a frame to select suspects. Enable the optional ReID module when using cross-camera matching.
4. Use the separate **Tello manual control** panel for Tello movement. The older mission controls use simulated avionics.

Preview capture can run independently of inference, and slower processing can skip source frames. Synthetic results and detection confidence do not establish model accuracy. See [video testing and suspect selection](docs/video-testing-and-suspect-selection.md) for playback and selection behavior.

## Tello connection

Control starts in `DRONE_CONTROL_MODE=simulation`, which does not connect to an aircraft. For a real Tello:

1. Connect the computer running the backend to the drone's Wi-Fi network and close competing control apps.
2. Set `DRONE_CONTROL_MODE=tello` in `backend/.env` and restart the backend with a single worker.
3. With the aircraft on the ground, select **Connect controls** in the manual panel. SDK acknowledgment confirms the control connection; joining Wi-Fi alone does not.

Manual movement uses the Tello SDK protocol. It does not automatically provide Tello video, measured flight telemetry, or autonomous person-following. Aircraft state in the panel is command-derived. Real-flight smoothness and parity with the official Tello app remain unverified; the reported control lag is not established as fixed by automated tests.

Read [Tello manual control](docs/tello-manual-control.md) for configuration, input expiry, connection limitations, and trusted-local-network operation.

## Tests and checks

With the backend virtual environment active, from `backend`:

```sh
python -m pytest tests -q
```

From `frontend`:

```sh
npm test
npx tsc --noEmit
npm run lint
npm run build
npm run test:e2e
```

Browser tests require Chrome by default. They start isolated local frontend/backend servers and exercise the real manual-control API against a loopback UDP emulator. They do not fly an aircraft. Backend integration tests also require permission to bind local sockets. Production builds require access to the configured Google Fonts resources; browser tests use an offline font fixture.

GitHub Actions runs backend tests, model verification, synthetic-video pipeline checks, API import checks, and frontend type checking, linting, and production build.

## Project structure

```text
backend/
  main.py                         FastAPI application
  app/api/v1/                     HTTP and WebSocket routes
  app/core/                       Environment settings, constants, and paths
  app/schemas/                    Request and response contracts
  app/services/drone_control/     Tello controller and UDP transport
  app/services/streaming/         Sources, channel coordination, frame stages
  app/services/tracking/          Tracking helpers and target matching
  app/services/zone/              Restricted-zone geometry
  app/services/alert/             Alerts and evidence capture
  models/                         Detection registry and checkpoints
  tests/                          Unit, workflow, and UDP integration tests
frontend/
  src/components/tactical/        Dashboard and atomic UI components
  src/hooks/                      State, effects, and interaction workflows
  src/services/                   API clients and queries
  src/types/                      Shared contracts and component props
  src/constants/                  Network settings and visual tokens
  src/utils/                      Reusable domain helpers
  tests/                          Unit, architecture, and browser tests
docs/                             Setup, workflow, and architecture guides
```

## Documentation

- [Video testing and suspect selection](docs/video-testing-and-suspect-selection.md)
- [Detection model configuration](backend/models/README.md)
- [Person re-identification](docs/person-reidentification.md)
- [Tello manual control](docs/tello-manual-control.md)
- [System documentation](docs/AERO_GUARD_SYSTEM_DOCUMENTATION.md)
- [Repository engineering guidelines](AGENTS.md)
