@echo off
echo ==============================================
echo Starting AI-Compass with Netlify Dev
echo ==============================================

:: Check if node_modules exists; if not, install dependencies first
if not exist "%~dp0node_modules" (
    echo [INFO] node_modules not found. Running npm install first...
    cd /d %~dp0
    npm install
)

cmd /k "cd /d %~dp0 && npx --no-install netlify dev"
