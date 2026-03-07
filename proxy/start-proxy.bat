@echo off
:: ============================================================
:: MLS Full Auto-Start
:: Starts: Proxy Server + Cloudflare Tunnel + Auto-Deploy Watcher
:: ============================================================
title MLS Services
cd /d "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS"

:: ── Kill any existing instances ──
echo [%time%] Cleaning up previous instances...
taskkill /f /im "cloudflared.exe" 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3004" ^| findstr "LISTENING"') do taskkill /f /pid %%a 2>nul

:: ── Start Proxy Server ──
echo [%time%] Starting MLS Scrape Proxy on :3004...
cd /d "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\proxy"
start /b node ml-proxy.mjs > proxy.log 2>&1
timeout /t 3 /nobreak > nul

:: ── Start Cloudflare Tunnel ──
echo [%time%] Starting Cloudflare Tunnel...
set CF="C:\Program Files (x86)\cloudflared\cloudflared.exe"

:: Check if named tunnel exists, otherwise use quick tunnel
%CF% tunnel list 2>nul | findstr "mls-proxy" >nul
if %errorlevel% equ 0 (
    echo [%time%] Using named tunnel 'mls-proxy'...
    start /b %CF% tunnel run mls-proxy > tunnel.log 2>&1
) else (
    echo [%time%] Using quick tunnel (temporary URL)...
    start /b %CF% tunnel --url http://localhost:3004 > tunnel.log 2>&1
)

timeout /t 8 /nobreak > nul

:: ── Start Auto-Deploy Watcher ──
echo [%time%] Starting Auto-Deploy Watcher...
cd /d "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS"
start /b node auto-deploy.mjs > deploy.log 2>&1

:: ── Summary ──
echo.
echo ============================================================
echo   MLS Services Started
echo ============================================================
echo   Proxy:       http://localhost:3004
echo   Auto-Deploy: Watching web/ and proxy/ for changes
echo.
echo   Tunnel URL (check tunnel.log):
type "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\proxy\tunnel.log" 2>nul | findstr "trycloudflare.com"
type "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\proxy\tunnel.log" 2>nul | findstr "bluejax"
echo.
echo   Logs:
echo     proxy/proxy.log   - Proxy server
echo     proxy/tunnel.log  - Cloudflare tunnel
echo     deploy.log        - Auto deploy watcher
echo ============================================================
echo.
echo Press any key to open log monitor...
pause > nul

:: ── Tail logs ──
echo Monitoring logs (Ctrl+C to stop)...
:loop
timeout /t 5 /nobreak > nul
echo --- [%time%] Latest ---
type "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\deploy.log" 2>nul | more +0
goto loop
