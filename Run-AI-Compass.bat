@echo off
echo ==============================================
echo Starting AI-Compass with Netlify Dev
echo ==============================================

cmd /k "cd /d %~dp0 && npx netlify dev"
