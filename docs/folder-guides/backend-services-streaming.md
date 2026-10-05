# 📹 Folder Guide: `backend/app/services/streaming/`

## 🎯 What this folder does (Simple Words)
This folder is the **live video streaming and camera pipeline engine**.

It captures frames from webcams, RTSP IP cameras, uploaded test videos, or synthetic drone simulations, sends frames through the AI detection pipeline, adds tactical HUD overlays (bounding boxes, telemetry, timestamps), and streams the result to the browser as an MJPEG video stream.

---

## 🛠️ Technologies & Libraries Used
- **OpenCV (`cv2`)**: Video capture, frame resizing, JPEG encoding, and text/box rendering.
- **MJPEG (Multipart HTTP Stream)**: Low-latency continuous video streaming to HTML `<img>` elements.
- **Threading & Queues**: Background worker threads that keep video streaming at a stable 25+ FPS without blocking API responses.

---

## 📄 Files Inside & What They Do

| File / Folder | What it does |
| :--- | :--- |
| `stream_coordinator.py` | `StreamManagerService` coordinates all live streaming components and connects sources to the broadcaster. |
| `channels.py` | Manages independent concurrent camera channels (e.g. Channel 1 for Aerial Drone, Channel 2 for Ground CCTV). |
| `frame_streamer.py` | Encodes annotated frames into multipart JPEG bytes for live browser consumption. |
| `pipeline_processor/` | Modular pipeline facade that takes each raw frame and runs it sequentially through detection, zoning, and alerts. |
| `coordinator/` | Subsystem managing drone flight state, viewpoint transitions, and tracking modes. |
| `source_provider/` | Abstract camera source layer with automated fallback to synthetic video if a hardware camera disconnects. |
| `sources/` | Ingestion classes for `synthetic`, `webcam`, `file` (video upload), `rtsp` (POE CCTV), and `http` (Mobile IP cameras). |
| `drone_service.py` | `DroneAvionicsManager` simulates 6S LiPo smart battery health, GPS RTK fix, altitude, and heading. |
| `connection_prober.py` | Diagnoses camera network latency and checks RTSP port reachability before connecting. |
| `telemetry_state.py` | Thread-safe store holding the latest sensor metrics, detections, and threat statuses. |
