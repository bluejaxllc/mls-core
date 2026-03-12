@echo off
:: ============================================================
:: MLS Named Tunnel Setup (ONE-TIME)
:: Run this once to:
::   1. Authenticate with Cloudflare
::   2. Create a named tunnel 'mls-proxy'
::   3. Route it to proxy.bluejax.ai
:: ============================================================
title MLS Tunnel Setup
set CF="C:\Program Files (x86)\cloudflared\cloudflared.exe"
set HOME=%USERPROFILE%

echo.
echo ============================================================
echo   Step 1: Cloudflare Login
echo   A browser window will open. Select your bluejax.ai domain.
echo ============================================================
echo.
%CF% tunnel login
if %errorlevel% neq 0 (
    echo.
    echo ❌ Login failed. Make sure to authorize bluejax.ai in the browser.
    pause
    exit /b 1
)

echo.
echo ============================================================
echo   Step 2: Create Named Tunnel 'mls-proxy'
echo ============================================================
echo.
%CF% tunnel create mls-proxy
if %errorlevel% neq 0 (
    echo ⚠️  Tunnel may already exist. Continuing...
)

echo.
echo ============================================================
echo   Step 3: Create DNS Route (proxy.bluejax.ai)
echo ============================================================
echo.
%CF% tunnel route dns mls-proxy proxy.bluejax.ai
if %errorlevel% neq 0 (
    echo ⚠️  DNS route may already exist. Continuing...
)

echo.
echo ============================================================
echo   Step 4: Create Config File
echo ============================================================
echo.

:: Create config file
(
echo tunnel: mls-proxy
echo credentials-file: %USERPROFILE%\.cloudflared\mls-proxy.json
echo.  
echo ingress:
echo   - hostname: proxy.bluejax.ai
echo     service: http://localhost:3004
echo   - service: http_status:404
) > "%USERPROFILE%\.cloudflared\config.yml"

echo Config written to %USERPROFILE%\.cloudflared\config.yml
echo.
echo ============================================================
echo   ✅ Setup Complete!
echo ============================================================
echo.
echo   Permanent URL: https://proxy.bluejax.ai
echo   Now update ML_PROXY_URL in Vercel to: https://proxy.bluejax.ai
echo.
echo   To test: %CF% tunnel run mls-proxy
echo.
pause
