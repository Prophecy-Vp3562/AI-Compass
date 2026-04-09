@echo on
echo Starting AI-Compass with Netlify Dev...
echo This will start both the frontend and the local serverless functions automatically!
cmd /k "cd /d %~dp0 && npx netlify dev"
