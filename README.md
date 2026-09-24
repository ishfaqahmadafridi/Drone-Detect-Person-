# Drone-Detect-Person: Aerial Multi-Person Intrusion & Gathering Detection System

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![YOLOv8](https://img.shields.io/badge/YOLO-v8%20%2F%20v11-green.svg)](https://github.com/ultralytics/ultralytics)
[![UI/UX Pro Max](https://img.shields.io/badge/UI%2FUX-Pro%20Max-violet.svg)](.agents/skills/expert-ui-ux-design/SKILL.md)
[![Cloud Architect](https://img.shields.io/badge/Cloud-Ready-orange.svg)](.agents/skills/expert-cloud-agent-architecture/SKILL.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A real-time aerial computer vision and drone surveillance system. Detects people from overhead drone camera feeds, tracks individual movement paths, monitors restricted zones (ROI), and automatically triggers high-priority security alarms when **two or more people** gather or enter restricted perimeters.

---

## 🚀 Key Features

- 🎯 **Aerial Drone Person Detection**: Optimized for high-altitude overhead and oblique drone camera perspectives using YOLOv8 / YOLOv11.
- 🚨 **Multi-Person Gathering Triggers**: Real-time detection and alarm trigger whenever **2 or more people** are present in the frame or cluster together.
- 🛡️ **Restricted Zone (ROI) Perimeters**: Configurable polygonal / rectangular security perimeters with instant breach alerts.
- 📍 **Multi-Object Tracking (MOT)**: Persistent target ID assignment, trajectory trails, and dwell-time monitoring.
- 📏 **Proximity & Clustering Engine**: Calculates pairwise Euclidean distances between persons and flags close-contact gatherings with visual links.
- 📸 **Automatic Evidence Capture**: Saves timestamped high-resolution snapshot evidence and writes structured event logs (`CSV` / `JSON`).
- 🧪 **Zero-Hardware Simulation**: Built-in synthetic drone flight video generator to test detection and alert pipelines immediately without needing a physical drone.
- ☁️ **Cloud & Agent Ready**: Pre-configured with Principal Cloud Architect and UI/UX Pro Max skills for scalable container deployment (AWS ECS / GCP) and telemetry dashboards.

---

## 📁 Repository Structure

```tree
Drone-Detect-Person/
├── .agents/
│   ├── skills/
│   │   ├── expert-cloud-agent-architecture/ # Cloud IaC, AWS/GCP, & Autonomous Agent Skill
│   │   └── expert-ui-ux-design/             # UI/UX Pro Max Design System & Accessibility Skill
│   └── rules/
│       ├── cloud-agent-architecture.md      # Cloud architecture governance rules
│       └── ui-ux-pro-max.md                 # UI/UX Pro Max design rules
├── AGENTS.md                                # AI Agent guidelines and directives
├── GEMINI.md                                # System configuration rules
├── config.py                                # Central configuration for thresholds, zones, and alerts
├── detector.py                              # YOLO aerial detection, tracking, & tactical HUD engine
├── zone_monitor.py                          # ROI polygon intrusion & proximity calculation
├── alert_manager.py                         # Threat levels, cooldowns, logs, & evidence snapshots
├── detect.py                                # Main CLI & stream processing pipeline
├── generate_test_video.py                   # Synthetic drone flight simulator for instant testing
├── requirements.txt                         # Package dependencies
├── .gitignore                               # Comprehensive gitignore rules
└── README.md                                # Project documentation
```

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ishfaqahmadafridi/Drone-Detect-Person-.git
   cd Drone-Detect-Person-
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

---

## 🎮 Quickstart Guide

### 1. Test Instantly with Synthetic Drone Footage (No Drone Needed)
Generate a realistic overhead drone aerial test video and run the detection pipeline:
```bash
python generate_test_video.py --output test_drone.mp4 --num-people 4
python detect.py --source test_drone.mp4
```

### 2. Live Webcam / USB Drone Receiver
```bash
python detect.py --source 0
```

### 3. Drone RTSP Live Stream
```bash
python detect.py --source rtsp://username:password@192.168.1.100:554/stream1
```

### 4. Headless Mode & Video Recording
```bash
python detect.py --source input_footage.mp4 --headless --save-video --output-video runs/output/recorded.mp4
```

---

## ⚙️ Configuration & Custom Alert Rules

Customize parameters in [`config.py`](file:///Users/mc/.gemini/antigravity-ide/scratch/Drone-Detect-Person-/config.py):

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `model_name` | `"yolov8n.pt"` | YOLO weights (`yolov8n.pt`, `yolov8s.pt`, or custom drone weights) |
| `confidence_threshold` | `0.35` | Confidence threshold for small aerial targets |
| `multi_person_threshold` | `2` | Number of people to trigger multi-person gathering alert |
| `proximity_alert_distance_px`| `120` | Distance in pixels to flag close gathering clusters |
| `enable_zone_intrusion` | `True` | Enables polygonal security zone breach detection |
| `snapshot_cooldown_seconds` | `3.0` | Cooldown period between auto-captured evidence snapshots |

---

## 🤖 Agent Customizations & Skills

This repository includes workspace customizations in `.agents/`:
- **Expert Cloud Architecture**: Multi-cloud deployment topologies, ECS Fargate containerization, and FinOps practices.
- **UI/UX Pro Max**: Design tokens, glassmorphism, fluid typography, and WCAG 2.2 AAA accessibility standards.

---

## 📜 License
This project is open-source and licensed under the [MIT License](LICENSE).
