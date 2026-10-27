# 🔍 Folder Guide: `backend/app/services/reid/`

## 🎯 What this folder does (Simple Words)
This folder implements **Ground-to-Aerial Person Re-Identification (Cross-Camera Matching)**.

When a security operator selects a suspect on a Ground CCTV camera, this service extracts visual feature vectors (embeddings) of the person and automatically searches for and ranks the most likely matching suspects in the Aerial Drone feed.

---

## 🛠️ Technologies & Libraries Used
- **X-TFCLIP (Cross-Modal Transformer)**: Deep learning model trained for person re-identification across different camera angles and elevations.
- **PyTorch & Torchvision**: Neural network forward pass on CPU or CUDA.
- **Cosine Similarity & NumPy**: Ranks the top candidate matches based on appearance similarity scores.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `service.py` | `ReIDService` coordinates suspect selection, samples clean person crops, manages query references, and ranks candidates. |
| `encoder.py` | Loads the X-TFCLIP transformer architecture and generates 512-dimensional embedding vectors from cropped images. |
| `crops.py` | Validates, normalizes, crops, and resizes detected person bounding boxes for feature extraction. |
| `worker.py` | Runs ReID feature extraction in an isolated background process to prevent latency spikes on the live video stream. |
| `tracklets.py` | Data structures tracking short sequences of person images across time. |
| `assets.py` | Manages downloading and verification of the official X-TFCLIP model checkpoint (`xtfclip.pth.tar`). |
