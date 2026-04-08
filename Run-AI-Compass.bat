@echo off
echo ==============================================
echo Starting AI-Compass 
echo Unified Express Backend & SPA Frontend
echo ==============================================

start http://localhost:3000
cmd /k "cd /d %~dp0 && npm start"
