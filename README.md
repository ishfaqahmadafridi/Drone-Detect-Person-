# 🚁 AERO-GUARD: Drone Aerial Person & Multi-Person Intrusion Detection HUD

A real-time aerial surveillance platform designed for drones, featuring **YOLOv8 & ByteTrack** multi-person detection, restricted perimeter intrusion tracking, gathering proximity analysis (≥ 2 persons), an interactive restricted zone editor, automated incident evidence snapshot logging, and a **Next.js 16 + TypeScript + Tailwind CSS** tactical HUD.

---

## 🏗️ Architecture Overview

```
Drone_FYP/
├── backend/                      # 🐍 FastAPI Computer Vision Backend
│   ├── app.py                   # FastAPI application with MJPEG streaming & WebSockets
│   ├── config.py                # System thresholds, polygon ROI, and filepaths
│   ├── detector.py              # YOLOv8 / YOLOv11 person inference & tracking engine
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
├── start_system.sh              # 🚀 One-click launcher for backend & frontend
└── README.md
```

---

## ⚡ Quick Start

### 1. Install Backend Dependencies
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Launch Both Services (One Command)
```bash
./start_system.sh
```
Or start them individually:

- **Backend (Port 8000)**:
  ```bash
  cd backend
  python3 app.py
  ```
- **Frontend (Port 3000)**:
  ```bash
  cd frontend
  npm run dev
  ```

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
