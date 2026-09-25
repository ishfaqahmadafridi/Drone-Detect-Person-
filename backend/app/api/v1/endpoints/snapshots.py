"""
Snapshots Endpoints: Evidentiary Image Gallery & File Serving.
"""

import os
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.core.config import SNAPSHOTS_DIR

router = APIRouter()

@router.get("/snapshots")
def get_snapshots():
    files = []
    if os.path.exists(SNAPSHOTS_DIR):
        for f in os.listdir(SNAPSHOTS_DIR):
            if f.endswith(('.jpg', '.jpeg', '.png')):
                full_p = os.path.join(SNAPSHOTS_DIR, f)
                stat = os.stat(full_p)
                files.append({
                    "filename": f,
                    "url": f"/snapshots/{f}",
                    "created_at": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
                    "size_kb": round(stat.st_size / 1024, 1)
                })
    files.sort(key=lambda x: x["created_at"], reverse=True)
    return {"snapshots": files[:60]}

@router.get("/snapshots/{filename}")
def serve_snapshot(filename: str):
    file_path = os.path.join(SNAPSHOTS_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Snapshot not found")
    return FileResponse(file_path, media_type="image/jpeg")
