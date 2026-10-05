# 🎮 Folder Guide: `backend/app/simulator/`

## 🎯 What this folder does (Simple Words)
This folder is the **Procedural Synthetic Drone & Video Simulation Generator**.

If no physical drone or RTSP camera is connected, this module procedurally generates realistic video footage of walking pedestrians, drone flight motion, changing lighting, and shadows directly in software. This allows developers to test the entire system offline without needing live hardware.

---

## 🛠️ Technologies & Libraries Used
- **OpenCV & NumPy**: Procedural rendering of simulated people, terrain textures, shadows, and perspective cameras.
- **Python `math` & `random`**: Simulates physics-based wandering, waypoint navigation, and collision avoidance.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `video_generator.py` | `ProceduralDroneFlightSimulator` generates complete synthetic `.mp4` test videos with simulated pedestrians and flight telemetry. |
| `person.py` | Simulates individual pedestrian walking physics, trajectories, and body proportions. |
| `config.py` | Simulation configuration parameters (resolution, duration, crowd density). |
| `persons/ground_physics.py` | Ground-level perspective physics simulation for eye-level CCTV cameras. |
