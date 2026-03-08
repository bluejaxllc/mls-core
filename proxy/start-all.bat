@echo off
set HOMEPATH=\Users\edgar
set USERPROFILE=C:\Users\edgar
echo Starting proxy on port 3004...
start /min node "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\proxy\ml-proxy.mjs"
timeout /t 3 >nul
echo Starting tunnel...
"C:\Users\edgar\.cloudflared\cloudflared.exe" tunnel --url http://localhost:3004 2> "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\proxy\tunnel.log"
