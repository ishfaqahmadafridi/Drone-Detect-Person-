# 📦 Folder Guide: `backend/models/`

## 🎯 What this folder does (Simple Words)
This folder stores the **Deep Learning AI Model Weight Files (`.pt`)** and their verification registry.

These `.pt` files contain the trained neural network weights that enable YOLO to recognize people from high-altitude aerial views as well as ground security camera views.

---

## 🛠️ Technologies & Libraries Used
- **PyTorch (`.pt` files)**: Serialized neural network weights.
- **JSON Registry (`registry.json`)**: Checksums, download URLs, and metadata for every model.
- **SHA-256 Hashes**: Security checks that guarantee the model file has not been altered or corrupted.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `visdrone_person_best.pt` | **Aerial Drone Model**: YOLO11n fine-tuned on the VisDrone dataset to detect small, overhead pedestrians from high altitudes. |
| `yolo26n.pt` | **Ground CCTV Model**: YOLO26n model optimized for eye-level person detection on CCTV, webcams, and mobile IP cameras. |
| `mot20_yolo26s_pedestrian.pt` | High-accuracy pedestrian tracking checkpoint trained on crowded surveillance footage. |
| `registry.json` | Master catalog defining model architectures, confidence thresholds, IOU ratios, and download URLs. |
| `README.md` | Detailed guide explaining dataset origins, benchmark statistics, and setup instructions. |
