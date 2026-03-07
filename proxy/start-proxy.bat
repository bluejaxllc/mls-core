@echo off
:: ============================================================
:: MLS Services Auto-Start
:: Launches the Node.js orchestrator that handles everything:
::   - Proxy server on :3004
::   - Cloudflare tunnel (auto-extracts URL)
::   - Updates Vercel ML_PROXY_URL automatically
::   - Auto-deploy watcher (git push on file changes)
:: ============================================================
title MLS Services
cd /d "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS"

:: Kill any existing proxy instances
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3004" ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul
taskkill /f /im "cloudflared.exe" 2>nul

:: Start the orchestrator
node start-services.mjs
pause
