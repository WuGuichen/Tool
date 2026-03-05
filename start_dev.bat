@echo off
echo Starting Web Toolbox Development Environment...

REM Start Backend
echo [1/2] Starting FastAPI Backend...
start "Web Toolbox - Backend" cmd /k "cd backend && call conda activate web-toolbox && python main.py"

REM Wait 2 seconds
timeout /t 2 /nobreak >nul

REM Start Frontend
echo [2/2] Starting React Frontend...
start "Web Toolbox - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo Environment startup commands sent!
echo Backend will run at: http://localhost:8000
echo Frontend will run at: http://localhost:5173
echo ========================================================
echo.
pause
