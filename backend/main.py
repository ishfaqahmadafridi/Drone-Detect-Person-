"""
FastAPI Application Entrypoint for Drone Aerial Person & Multi-Person Intrusion Detection System.
"""

import os
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.router import api_router
from app.core.config import SNAPSHOTS_DIR

app = FastAPI(
    title="AERO-GUARD Aerial Vision API",
    description="Decoupled Real-Time Aerial Person Detection, Multi-Person Gathering & Intrusion Monitoring Microservice",
    version="2.0.0"
)

# Enable CORS for cross-origin frontend clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 routes & root aliases
app.include_router(api_router, prefix="/api")
app.include_router(api_router)

@app.get("/api/health")
def get_health():
    return {
        "status": "online",
        "service": "AERO-GUARD Drone Aerial Detection Microservice",
        "timestamp": datetime.now().isoformat()
    }

# Mount static snapshots
if os.path.exists(SNAPSHOTS_DIR):
    app.mount("/snapshots", StaticFiles(directory=SNAPSHOTS_DIR), name="snapshots")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
