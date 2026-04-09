@echo off
echo ==============================================
echo Starting AI-Compass Development Environment...
echo [IMPORTANT] Keep this window open while using the website!
echo ==============================================

:: Check for node_modules
if not exist "%~dp0node_modules" (
    echo [INFO] node_modules not found. Installing...
    cd /d %~dp0
    npm install
)

:: Wait a moment then open the browser
echo [INFO] Launching your browser...
start "" "http://localhost:8888"

:: Start the Netlify Dev server (this keeps the window active)
echo [INFO] Starting Backend & Frontend...
cd /d %~dp0
npx netlify dev

