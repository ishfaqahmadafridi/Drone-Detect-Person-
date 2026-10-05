# 🚨 Folder Guide: `backend/app/services/alert/`

## 🎯 What this folder does (Simple Words)
This folder manages the **Threat Level Classification and Alert Triggering System**.

It evaluates whether the current scene is `CLEAR` (no intruders), `MONITORING` (people detected outside zone), `INTRUSION` (unauthorized breach), or `MANUAL` (operator tracking). When an intrusion happens, it debounces the alert, plays alarms, and takes photographic evidence snapshots.

---

## 🛠️ Technologies & Libraries Used
- **Python `threading` & `time`**: Implements snapshot cooldown timers so the system does not spam thousands of duplicate photos for the same event.
- **OpenCV**: Encodes and saves high-resolution alert snapshots to disk (`runs/output/snapshots/`).
- **SQLite Database**: Persists alert metadata immediately to `evidence.db`.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `alert_manager.py` | `AlertManagerService` evaluates overall threat tier, formats situational alert messages, and manages state transitions. |
| `evidence_recorder.py` | `EvidenceRecorder` saves JPEG images to disk when an intrusion occurs and registers the row in SQLite. |
| `state_evaluator.py` | Calculates whether alert cooldowns have expired and ensures threat transitions are debounced smoothly. |
