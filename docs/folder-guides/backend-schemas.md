# 📋 Folder Guide: `backend/app/schemas/`

## 🎯 What this folder does (Simple Words)
This folder defines the **data structures (schemas)** used by the backend. It acts as a contract specifying what fields must exist in requests sent from the frontend and what answers the backend will return.

If invalid data is sent (e.g., negative altitude or invalid coordinates), Pydantic automatically rejects it before it causes bugs.

---

## 🛠️ Technologies & Libraries Used
- **Pydantic (`pydantic.BaseModel`)**: Data validation and serialization framework for Python.

---

## 📄 Files Inside & What They Do

| File | What it does |
| :--- | :--- |
| `evidence.py` | Schema for database evidence records (`EvidenceRecord`, `EvidenceListResponse`). |
| `drone.py` | Schemas for flight commands (`DroneCommandRequest`, `DroneCommandResponse`, `DroneAvionicsData`). |
| `config.py` | Schemas for updating confidence thresholds, restricted zone polygons, and stream sources. |
| `cameras.py` | Schemas for registering tactical cameras, IP RTSP URLs, and connection statuses. |
| `reid.py` | Schemas for suspect matching (`ReIDTarget`, `ReIDCandidate`, `ReIDStatus`). |
| `tracking.py` | Schemas for tracking modes (automatic multi-target vs. manual single suspect lock). |
| `generative.py` | Schemas for generative aerial diffusion prompt requests and image output URLs. |
