# ⚙️ Folder Guide: `backend/app/core/`

## 🎯 What this folder does (Simple Words)
This folder is the **central brain for settings and constants**. It ensures that no paths, API ports, default values, or model names are hardcoded inside the code.

It reads configuration from `.env` files, detects whether the computer has an NVIDIA GPU or CPU, and resolves where to store databases, logs, and video files on disk.

---

## 🛠️ Technologies & Libraries Used
- **Python `os` / `pathlib`**: File path management and operating system interaction.
- **Python `dataclasses`**: Typed, clean configuration objects (`DetectionConfig`, `ReIDConfig`).
- **PyTorch (`torch`)**: Detects available hardware (CUDA on NVIDIA GPUs vs. CPU fallback).
- **Dotenv**: Loads environment variables from `backend/.env`.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `config.py` | Defines `DetectionConfig` and `ReIDConfig` dataclasses with live threshold values, video playback modes (`loop` vs `hold`), and model defaults. |
| `constants.py` | Holds project-wide constants such as default restricted zone coordinates, model hashes (SHA-256), and UI tokens. |
| `paths.py` | Automatically calculates full paths for `runs/output/`, `evidence.db`, `snapshots/`, `recordings/`, and `uploads/`. |
| `device.py` | Checks hardware capabilities and selects `cuda` (NVIDIA GPU) or `cpu` (safe execution on Mac/Windows/Linux). |
| `env.py` | Reads `.env` key-value pairs safely with default fallbacks. |
