# 📡 Folder Guide: `backend/app/api/v1/`

## 🎯 What this folder does (Simple Words)
This folder holds all the **FastAPI web routes and API endpoints**. It acts as the "bridge" between the frontend Next.js interface and the backend computer vision system.

Whenever the user clicks a button, changes a camera, or looks at live telemetry on the dashboard, the frontend sends requests to the files in this folder.

---

## 🛠️ Technologies & Libraries Used
- **FastAPI**: Modern, fast web framework for building APIs in Python.
- **WebSockets (`websockets`)**: Real-time two-way communication for live drone telemetry.
- **Starlette / Pydantic**: Fast request validation and JSON parsing.
- **Multipart (`python-multipart`)**: Handles file uploads for test videos.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `router.py` | Combines all individual API routers into a single master `/api` router. |
| `endpoints/stream.py` | Streams live MJPEG video (`/api/stream/video_feed`), handles source switching (`synthetic`, `webcam`, `rtsp`, `file`), and video uploads (`/video/upload`). |
| `endpoints/ws.py` | WebSocket server (`/ws/telemetry`) streaming high-speed detection coordinates and drone avionics to the HUD. |
| `endpoints/cameras.py` | Manages the fleet of cameras (`/api/cameras`) — registering, updating, and probing camera statuses. |
| `endpoints/drone.py` | Handles drone flight commands (`takeoff`, `patrol`, `rtl`) and perimeter controls (`preset_gate`, `preset_patrol`). |
| `endpoints/reid.py` | Manages Ground-to-Aerial Person Re-Identification status and query retrievals. |
| `endpoints/config.py` | Allows live tuning of AI confidence thresholds and restricted zone polygons. |
| `endpoints/alerts.py` | Fetches active and recent intrusion alerts with threat severity levels. |
| `endpoints/snapshots.py` | Triggers on-demand or automated photo captures of intruders. |
| `endpoints/recordings.py` | Lists recorded MP4 video clips saved during security breaches. |
| `endpoints/evidence.py` | SQLite database search API for stored evidence with filters and pagination. |
| `endpoints/tracking.py` | Switches between automatic multi-person tracking and manual suspect target locking. |
| `endpoints/generative.py` | Generates aerial diffusion images using Replicate Cloud API for edge-case simulation. |
