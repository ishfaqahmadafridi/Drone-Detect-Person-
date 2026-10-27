# 🛑 Folder Guide: `backend/app/services/zone/`

## 🎯 What this folder does (Simple Words)
This folder handles **Restricted Perimeter Geofencing & Intrusion Math**.

Operators can draw custom polygon zones (e.g. around a high-security gate or runway). This module calculates whether the bottom-center (feet position) of any detected person is standing inside the restricted boundary.

---

## 🛠️ Technologies & Libraries Used
- **OpenCV (`cv2.pointPolygonTest`)**: Ultra-fast C++ mathematical algorithm for checking whether 2D points lie inside, outside, or on the edge of a polygon.
- **NumPy**: Coordinate normalization between screen pixels and percentage coordinates `[0.0 to 1.0]`.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `zone_monitor.py` | `ZoneMonitorService` checks all detected persons against the active restricted polygon, marks intruders, and maintains geofence geometry. |
| `gathering.py` | Detects high-density clusters or crowds of people gathered in close proximity. |
