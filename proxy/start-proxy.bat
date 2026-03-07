@echo off
:: MLS Scrape Proxy Auto-Start Script
:: Starts the proxy server and Cloudflare tunnel in the background.
:: Place a shortcut to this in shell:startup to auto-run on login.

title MLS Proxy + Tunnel
cd /d "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\proxy"

:: Kill any existing instances
taskkill /f /im "cloudflared.exe" 2>nul
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3004"') do taskkill /f /pid %%a 2>nul

echo [%date% %time%] Starting MLS Scrape Proxy...
start /b node ml-proxy.mjs > proxy.log 2>&1

:: Wait for proxy to be ready
timeout /t 3 /nobreak > nul

echo [%date% %time%] Starting Cloudflare Tunnel...
start /b cloudflared.exe tunnel --url http://localhost:3004 > tunnel.log 2>&1

:: Wait for tunnel URL to appear in logs
timeout /t 8 /nobreak > nul

:: Extract and display the tunnel URL
echo.
echo === MLS Proxy Status ===
echo Proxy: http://localhost:3004
type tunnel.log | findstr "trycloudflare.com"
echo.
echo Logs: proxy/proxy.log and proxy/tunnel.log
echo.
echo IMPORTANT: Copy the tunnel URL above and set it as ML_PROXY_URL in Vercel!
echo.
pause
