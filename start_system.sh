#!/usr/bin/env bash
# ==============================================================================
# AERO-GUARD Launch Script: Starts FastAPI Backend & Next.js Frontend
# ==============================================================================

set -e

echo "========================================================================"
echo "🚁 LAUNCHING AERO-GUARD SURVEILLANCE ECOSYSTEM"
echo "========================================================================"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cleanup on exit
cleanup() {
    echo ""
    echo "[INFO] Shutting down services..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT INT TERM

# 1. Start FastAPI Backend Microservice
echo "[1/2] Starting FastAPI Backend on http://localhost:8000..."
cd "$ROOT_DIR/backend"
if [ ! -d "venv" ] && command -v python3 &>/dev/null; then
    echo "[INFO] Ensure backend dependencies are installed: pip install -r requirements.txt"
fi

python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "[INFO] Backend running with PID $BACKEND_PID"

# 2. Start Next.js Frontend Dashboard
if [ -d "$ROOT_DIR/frontend" ]; then
    echo "[2/2] Starting Next.js Tactical HUD on http://localhost:3000..."
    cd "$ROOT_DIR/frontend"
    npm run dev &
    FRONTEND_PID=$!
    echo "[INFO] Frontend running with PID $FRONTEND_PID"
fi

echo "========================================================================"
echo "✅ SYSTEM ACTIVE & READY"
echo "👉 Tactical HUD Dashboard:     http://localhost:3000"
echo "👉 FastAPI Swagger Docs:       http://localhost:8000/docs"
echo "👉 Live MJPEG Video Stream:    http://localhost:8000/api/stream/video_feed"
echo "👉 WebSocket Telemetry:        ws://localhost:8000/ws/telemetry"
echo "========================================================================"
echo "Press [Ctrl+C] to stop all services."

# Wait for processes
wait
