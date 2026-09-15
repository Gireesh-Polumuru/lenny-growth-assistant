#!/usr/bin/env bash
set -e

echo "=========================================================="
echo " Starting The Lenny Growth Assistant                      "
echo "=========================================================="

if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo "Starting with Docker Compose..."
    docker compose up --build
else
    echo "Docker not detected. Starting local services..."
    echo "1. Ingesting transcripts & starting backend..."
    python -m pip install -r backend/requirements.txt
    python -m uvicorn app.main:app --app-dir backend --port 8000 --reload &
    BACKEND_PID=$!
    
    echo "2. Starting frontend..."
    cd frontend && npm install && npm run dev &
    FRONTEND_PID=$!
    
    trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
    wait
fi
