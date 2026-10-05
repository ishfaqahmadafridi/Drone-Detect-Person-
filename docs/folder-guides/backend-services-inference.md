# 🧠 Folder Guide: `backend/app/services/inference/`

## 🎯 What this folder does (Simple Words)
This folder manages the **different AI model weights and perspective profiles**.

It knows which specific model to load when viewing from the sky (`aerial` drone view uses `visdrone_person_best.pt`) vs. from the ground (`ground` CCTV view uses `yolo26n.pt`), verifies that the model files are not corrupted, and caches them in memory for fast performance.

---

## 🛠️ Technologies & Libraries Used
- **Ultralytics YOLO & PyTorch**: Deep neural network loading and inference dispatch.
- **`hashlib`**: SHA-256 checksum verification to ensure model weight files are authentic.
- **JSON Registry**: Loads model configuration from `backend/models/registry.json`.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `dispatcher.py` | `MultiViewInferenceService` coordinates lazy loading, active perspective switching, and tracker resets. |
| `profiles.py` | Contains detection profiles for `aerial` (VisDrone) and `ground` (COCO) views. |
| `model_loader.py` | `ModelWeightLoader` verifies file existence, checks file sizes and SHA-256 hashes, and loads the YOLO model. |
| `registry_loader.py` | Reads and applies dynamic overrides from `registry.json`. |
| `status_reporter.py` | Builds detailed JSON reports on loaded models, hardware device in use, and memory state. |
