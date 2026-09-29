# 🚁 AERO-GUARD: Drone Aerial Person & Multi-Person Intrusion Detection HUD

A real-time aerial and ground surveillance platform featuring **YOLO11n (VisDrone) & YOLO26s (MOT20)** person detection with **BoT-SORT / ByteTrack** tracking, restricted perimeter intrusion alerts, gathering proximity analysis (≥ 2 persons), an interactive restricted zone editor, automated incident evidence snapshot logging, and a **Next.js 16 + TypeScript + Tailwind CSS** tactical HUD.

---

## 🏗️ Architecture Overview

```
Drone_FYP/
├── backend/                      # 🐍 FastAPI Computer Vision Backend
│   ├── main.py                  # FastAPI application with MJPEG streaming & WebSockets
│   ├── config.py                # System thresholds, polygon ROI, and filepaths
│   ├── detector.py              # YOLO11n / YOLO26s person inference & tracking engine
│   ├── zone_monitor.py          # Ray-casting polygon intrusion & gathering proximity
│   ├── alert_manager.py         # Threat state machine, evidence capture & CSV/JSON audit
│   ├── detect.py                # Standalone CLI detection runner
│   ├── generate_test_video.py   # Synthetic aerial footage generator
│   └── requirements.txt         # Backend Python dependencies
│
├── frontend/                     # ⚛️ Next.js TypeScript Tactical HUD
│   ├── src/
│   │   ├── app/                 # App Router (page.tsx, layout.tsx, globals.css)
│   │   ├── components/          # Tactical UI Components
│   │   │   ├── Header.tsx       # Live status ribbon, UTC clock, audio siren toggle
│   │   │   ├── VideoViewport.tsx# Real-time optical feed & interactive Canvas Zone Editor
│   │   │   ├── TelemetryCards.tsx# 4 tactical glowing metrics (Persons, Intruders, Clusters, FPS)
│   │   │   ├── TuningPanel.tsx  # Dynamic sliders for thresholds & proximity tuning
│   │   │   ├── IncidentLogs.tsx # Live incident table with CSV export
│   │   │   ├── SnapshotGallery.tsx# Evidentiary snapshot carousel & lightbox modal
│   │   │   └── AudioSynthesizer.ts# Web Audio API tactical alarm synthesizer
│   │   ├── lib/utils.ts         # Tailwind className merger (cn)
│   │   └── types/index.ts       # TypeScript interfaces for telemetry & alerts
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.ts           # Automatic API and WebSocket proxy to backend
│
├── runs/output/                 # 📂 Incident evidence snapshots & CSV event logs
├── start_system.ps1             # Windows launcher for backend & frontend
├── start_system.sh              # Bash launcher for backend & frontend
└── README.md
```

---

## ⚡ Quick Start

Use **Python 3.12** and **Node.js 20.9 or newer**. Run the following commands from the repository root (the folder containing this README).

### Windows (PowerShell)

First-time setup:

```powershell
py -3.12 -m venv backend\.venv
.\backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
.\backend\.venv\Scripts\python.exe backend\scripts\download_models.py
Set-Location frontend
npm ci
Set-Location ..
```

If the Python launcher reports no installed Python, install Python 3.12 first. Once `backend\.venv` exists, the launcher below uses it directly; activating the environment is unnecessary.

Start both services:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start_system.ps1
```

Open **http://127.0.0.1:3000** for the dashboard or **http://127.0.0.1:8000/docs** for the API. The services run in the background, with logs under `runs\system`. The first launch generates a synthetic demo video and compiles the frontend, so allow a few minutes.

Stop both services:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\start_system.ps1 -Stop
```

To run in two separate terminals instead:

```powershell
# Terminal 1, from the repository root
Set-Location backend
.\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000
```

```powershell
# Terminal 2, from the repository root
Set-Location frontend
npm run dev
```

### Linux / macOS (Bash)

```bash
python3 -m venv backend/.venv
backend/.venv/bin/python -m pip install -r backend/requirements.txt
backend/.venv/bin/python backend/scripts/download_models.py
(cd frontend && npm ci)
bash start_system.sh
```

The backend starts with synthetic footage, so a camera is not required. Use the dashboard's source selector to upload footage or connect a camera. The flight-control buttons reference `/api/drone/*` endpoints that are not implemented in this repository, so they do not control a physical drone.

### Pretrained aerial and ground models

The existing perspective selector chooses between these two detectors. The backend starts in **Aerial** view; selecting **Ground** loads the MOT20 checkpoint. The dashboard engine label follows the active model.

| View | Pretrained detector | Local checkpoint in `backend/models/` | Tracker |
| --- | --- | --- | --- |
| Aerial | [pratap424: YOLO11n trained on VisDrone](https://github.com/pratap424/visdrone_mot) | `visdrone_person_best.pt` | Ultralytics BoT-SORT |
| Ground | [Halftom: YOLO26s trained on MOT20](https://huggingface.co/Halftom/mot20-yolo26s-pedestrian) | `mot20_yolo26s_pedestrian.pt` | Ultralytics ByteTrack |

Both checkpoints output **class `0: person`**. The aerial training merged VisDrone's original pedestrian and people classes into this single output class. These models detect people and assign temporary tracking IDs; they do not identify a person's real-world identity.

`backend/models/registry.json` records the source revisions, download URLs, SHA-256 checksums, and inference settings. Both profiles use image size **1280** and confidence **0.25**, with IoU **0.45** for aerial and **0.50** for ground. Switching views applies the selected profile's defaults and resets tracking history. Confidence remains adjustable in the tuning panel.

The setup command downloads both checkpoints and verifies their checksums. Weights are ignored by Git, so run it on each new installation. To verify existing files without downloading:

```powershell
.\backend\.venv\Scripts\python.exe backend\scripts\download_models.py --verify-only
```

Use `--view aerial` or `--view ground` with the downloader to fetch just one checkpoint. Missing or invalid weights produce an explicit setup error; the application never silently substitutes a generic model.

For standalone processing, run from `backend/`:

```bash
python detect.py --view aerial --source aerial-video.mp4 --headless
python detect.py --view ground --source ground-video.mp4 --headless
```

Inference at 1280 can be slow on a CPU. The CLI accepts `--imgsz 640` as a speed/accuracy tradeoff; the dashboard reads `recommended_imgsz` from the registry at backend startup. `GET /api/stream/models/status` reports the profiles and loaded weights, and `POST /api/stream/view?view=ground` switches the running detector.

This integration uses the pretrained weights within AERO-GUARD's existing pipeline and the trackers shipped with Ultralytics. It does not reproduce the aerial repository's complete custom tracking/evaluation pipeline or its reported benchmark scores. Synthetic footage is a startup smoke test; assess detection quality with representative aerial and ground footage.

---

## 🌟 Key Features

1. **Interactive Restricted Zone Editor**:
   - Security operators can click and drag polygon vertices directly over the live drone video feed to redefine restricted perimeters dynamically in real time.
2. **Multi-Person Gathering Analytics**:
   - Triggers security alerts when ≥ 2 persons congregate within the specified proximity pixel radius.
3. **Stateless FastAPI REST & WebSocket Telemetry**:
   - `/api/stream/video_feed`: MJPEG live streaming.
   - `/ws/telemetry`: High-frequency metrics broadcast (detections, FPS, threat state).
   - `/api/config`: Dynamic runtime parameter tuning without restarting the server.
   - `/api/video/upload`: Custom drone footage upload & instant analysis.
4. **Automated Evidentiary Snapshot Capture**:
   - Timestamped evidence photos saved automatically to disk whenever an intrusion or gathering breach is detected (with cooldown control).
5. **Tactical Web Audio Alarm Synthesizer**:
   - Built-in Web Audio API alarm sounds for real-time alert dispatching without external assets.
