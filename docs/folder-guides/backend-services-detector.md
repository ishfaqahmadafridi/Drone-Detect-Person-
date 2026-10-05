# 👁️ Folder Guide: `backend/app/services/detector/`

## 🎯 What this folder does (Simple Words)
This folder contains the **YOLO AI Person Detection & Multi-Object Tracking Engine**.

It takes raw video frames from cameras or drone feeds, runs them through the neural network, draws bounding boxes around people, calculates movement speeds, and assigns a unique ID to each detected person.

---

## 🛠️ Technologies & Libraries Used
- **Ultralytics YOLO (v8 / v11 / v26)**: State-of-the-art real-time object detection models.
- **ByteTrack & BoT-SORT**: Deep learning multi-object trackers that track individuals across video frames even when they are briefly obstructed.
- **OpenCV (`cv2`) & NumPy**: Fast matrix math and image processing.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `detector.py` | `DronePersonDetectorService` orchestrates YOLO inference, applies confidence/IOU thresholds, switches models between `aerial` and `ground`, and tracks motion trajectories. |
| `profiler.py` | `FPSProfiler` calculates smooth real-time Frames Per Second (FPS) performance metrics. |
