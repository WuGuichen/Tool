@echo off
echo Starting Web Toolbox Development Environment...

REM Backend Startup: Check if environment exists, create if not, then run
echo [1/2] Checking Backend Environment and Starting...
start "Web Toolbox - Backend" cmd /k "cd backend && (conda run -n web-toolbox python --version >nul 2>&1 || conda env create -f environment.yml -n web-toolbox) && call conda activate web-toolbox && python main.py"

timeout /t 3 /nobreak >nul

REM Frontend Startup: Auto install dependencies then run
echo [2/2] Checking Frontend Environment and Starting...
start "Web Toolbox - Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo ========================================================
echo Environment startup commands sent!
echo If this is your first run, Conda and NPM might take a
echo few minutes to install dependencies in the background windows.
echo.
echo Backend will run at: http://localhost:8000
echo Frontend will run at: http://localhost:5173
echo ========================================================
echo.
pause
