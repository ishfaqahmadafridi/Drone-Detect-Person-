# 📼 Folder Guide: `backend/app/services/recording/`

## 🎯 What this folder does (Simple Words)
This folder handles **Incident Video Clip Recording and Rolling Pre-Roll Buffering**.

When an intrusion occurs, security teams need to see what happened *a few seconds before* the alarm was triggered. This module keeps a rolling memory buffer of recent video frames and saves an MP4 video clip containing before-and-after footage of the incident.

---

## 🛠️ Technologies & Libraries Used
- **OpenCV (`cv2.VideoWriter`)**: Encodes raw video frames into compressed `.mp4` video files.
- **Python `collections.deque`**: Efficient circular buffer holding pre-roll frames in RAM.
- **Background Worker Threads**: Writes video clips to disk asynchronously without slowing down real-time camera inference.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `recorder.py` | `VideoClipRecorder` coordinates recording triggers, durations, and clip completions. |
| `preroll_buffer.py` | `PreRollBuffer` maintains a rolling queue of previous frames to include in incident clips. |
| `container_writer.py` | `VideoContainerWriter` handles OpenCV VideoWriter lifecycle and container formatting. |
| `persistence.py` | Saves the resulting `.mp4` file path, duration, and thumbnail to SQLite `evidence_records`. |
