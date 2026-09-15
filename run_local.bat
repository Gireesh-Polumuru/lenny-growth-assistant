@echo off
echo ==========================================================
echo  Starting The Lenny Growth Assistant (Local Mode)
echo ==========================================================

echo [1/3] Checking dependencies...
python -m pip install -r backend/requirements.txt

echo [2/3] Starting FastAPI Backend on http://localhost:8000 ...
start "Lenny Backend" cmd /k "python -m uvicorn app.main:app --app-dir backend --port 8000 --reload"

echo [3/3] Starting React Frontend on http://localhost:5173 ...
cd frontend
start "Lenny Frontend" cmd /k "npm run dev"

echo ==========================================================
echo  Application is running!
echo  - Frontend: http://localhost:5173
echo  - Backend API: http://localhost:8000/docs
echo  - Health Check: http://localhost:8000/health
echo ==========================================================
pause
