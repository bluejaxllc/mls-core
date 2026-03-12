@echo off
set HOMEPATH=\Users\edgar
set USERPROFILE=C:\Users\edgar
"C:\Users\edgar\.cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:3004 2> "C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\proxy\tunnel.log"
