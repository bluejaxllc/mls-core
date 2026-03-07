' MLS Services System Tray Launcher
' Launches the PowerShell tray app without showing a console window
Set objShell = CreateObject("WScript.Shell")
objShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File ""C:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\mls-tray.ps1""", 0, False
