# Computer Vision Model Registry & Technical Architecture (FYP Defense Guide)

This document provides the formal academic and engineering justification for the specialized deep learning vision weights employed in the **AERO-GUARD** Drone Aerial Surveillance and Intrusion Detection System.

---

## 1. Executive Summary & Problem Formulation

Standard generic object detectors (e.g., standard YOLOv8 pre-trained on Microsoft COCO) are unsuitable for mission-critical aerial surveillance and perimeter defense for two critical reasons:

1. **The Aerial Nadir Problem (Top-Down UAV Distortion)**:
   - COCO images are captured at human eye level with prominent leg/torso features.
   - Drones operate at 20–100m altitudes looking down obliquely or directly nadir. Human targets appear as tiny blobs (10–30 pixels) showing only head and shoulders, with perspective foreshortening and high UAV camera motion blur.
   - Standard COCO models suffer **>45% false negative rates** on high-altitude drone footage.
2. **The Dense Crowd Occlusion Problem (Perimeter CCTV)**:
   - In perimeter security and facility monitoring, pedestrians cluster and occlude one another.
   - Standard detectors group multiple individuals into a single bounding box or lose tracks when people overlap by more than 50%.

To solve these domain challenges, AERO-GUARD utilizes **two purpose-built, domain-adapted models** selected for their specialized training datasets:

---

## 2. Model Specifications & Comparison Matrix

| Metric / Dimension | Ground CCTV / Perimeter | Aerial Drone / UAV Airspace |
|---|---|---|
| **Operational Perspective** | Eye-Level & Fixed Mount Perimeter CCTV | Top-Down & Oblique UAV Drone Flight |
| **Model Filename** | `mot20_yolo26s_pedestrian.pt` | `visdrone_person_best.pt` |
| **Architecture** | YOLO26s (Small) | YOLO11n (Nano) |
| **Training Dataset** | **MOT20** (Multiple Object Tracking 2020) | **VisDrone** (UAV Drone Benchmark) |
| **Source Repository** | [Halftom Hugging Face](https://huggingface.co/Halftom/mot20-yolo26s-pedestrian) | [pratap424/visdrone_mot GitHub](https://github.com/pratap424/visdrone_mot) |
| **Target Classes** | Class `0`: `person` (Single-class focused) | Class `0`: `person` (Merged pedestrian + people) |
| **Tracking Engine** | ByteTrack (`bytetrack.yaml`) | BoT-SORT (`botsort.yaml`) |
| **Inference Resolution** | 1280x1280 (High resolution for crowds) | 1280x1280 (High resolution for tiny targets) |
| **Checkpoint Size** | 20,371,909 bytes (~19.4 MB) | 5,534,611 bytes (~5.3 MB) |
| **Cryptographic SHA-256** | `f24d5aa4af4948f2d0357baef34d8dcea03e4b0caef4fee5c0471de9297d30e4` | `e3ada842a2bf94dd420c45ab34669c874a180160fa302bab3a2d6e7a44e263a2` |

---

## 3. Detailed Justification for Model Selection

### 3.1 Ground Model: `mot20_yolo26s_pedestrian.pt`
- **Trained by**: Halftom (Hugging Face)
- **Dataset Context**: MOT20 consists of 8 outdoor and indoor video sequences with an average density of **246 pedestrians per frame**, exhibiting extreme crowd gatherings and severe occlusions.
- **Why It Was Selected**:
  - Fine-tuned strictly for human pedestrians, eliminating false positives from non-human COCO categories (bicycles, backpacks, benches).
  - Paired with **ByteTrack**, which retains low-confidence detection boxes to recover tracks across continuous severe occlusions.
  - Ideal for facility gates, restricted building corridors, and perimeter fences.

### 3.2 Aerial Model: `visdrone_person_best.pt`
- **Trained by**: Pratap (GitHub: `pratap424/visdrone_mot`)
- **Dataset Context**: VisDrone is the international benchmark for aerial drone computer vision collected by the AISKYEYE team from drone platforms across 14 cities in China under various altitudes, weather conditions, and camera angles.
- **Why It Was Selected**:
  - The model merges VisDrone's distinct `pedestrian` and `people` labels into a single robust `person` class.
  - Optimized for tiny object detection where bounding box areas are often $< 32^2$ pixels.
  - Paired with **BoT-SORT** with camera motion compensation (CMC), preventing track ID switches caused by drone yaw and pitch drift.

---

## 4. Code Architecture & Traceability in the Repository

The models are integrated using clean, decoupled architectural patterns with zero hardcoded values:

1. **Model Registry Definition** ([`registry.json`](file:///Users/mc/Documents/Drone_FYP/backend/models/registry.json)):
   - Defines source URLs, cryptographic checksums, recommended image resolutions, and tracker configurations.
2. **Automated Downloader & Integrity Verifier** ([`scripts/download_models.py`](file:///Users/mc/Documents/Drone_FYP/backend/scripts/download_models.py)):
   - Downloads checkpoints atomically via HTTP/HTTPS and verifies SHA-256 digests before placing them into `models/`.
   - Command: `python scripts/download_models.py --verify-only`
3. **Environment & App Configuration** ([`app/core/config.py`](file:///Users/mc/Documents/Drone_FYP/backend/app/core/config.py)):
   - Model filenames are loaded via `os.getenv("GROUND_MODEL_NAME")` and `os.getenv("AERIAL_MODEL_NAME")`, allowing custom weights without editing code.
4. **Dynamic Inference Dispatcher** ([`app/services/inference/dispatcher.py`](file:///Users/mc/Documents/Drone_FYP/backend/app/services/inference/dispatcher.py)):
   - Lazily loads models into memory on first perspective activation.
   - Provides `/api/v1/stream/models/status` returning complete diagnostics for the frontend UI.
5. **Detection Coordinator** ([`app/services/detector/detector.py`](file:///Users/mc/Documents/Drone_FYP/backend/app/services/detector/detector.py)):
   - Executes multi-object tracking (`model.track()`) using the respective profile's tracker (`bytetrack.yaml` for ground, `botsort.yaml` for aerial).

---

## 5. Demonstration & Presentation Guide

During an FYP evaluation or project defense:

1. **Live Model Status Inspection**:
   - Send `GET http://localhost:8000/api/v1/stream/models/status` to show evaluators that both models are cryptographically verified, loaded in memory, and mapped to their respective architectures.
2. **Real-time Perspective Switching**:
   - In the Tactical HUD, switch from **Aerial Drone** to **Ground CCTV**.
   - Observe the Top-Right HUD Badge immediately update from `ENGINE: YOLO11n + BoT-SORT` to `ENGINE: YOLO26s + ByteTrack`.
   - Show that track IDs reset cleanly without state corruption.
3. **Verification Command**:
   ```bash
   cd backend
   .venv/bin/python3 scripts/download_models.py --verify-only
   ```
   Outputs:
   ```
   [OK] Verified ground: mot20_yolo26s_pedestrian.pt
   [OK] Verified aerial: visdrone_person_best.pt
   ```
