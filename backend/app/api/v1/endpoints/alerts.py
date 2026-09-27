"""
Alerts Endpoints: Incident History Audit & CSV Export.
"""

import os
import csv
from fastapi import APIRouter
from app.services.stream_service import stream_service

router = APIRouter()

@router.get("/alerts")
def get_alerts():
    csv_file = stream_service.alert_manager.log_file_csv
    alerts = []
    if os.path.exists(csv_file):
        with open(csv_file, mode='r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                alerts.append(row)
    return {
        "total_alerts": len(alerts),
        "alerts": alerts[-60:][::-1]
    }
