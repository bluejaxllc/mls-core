# MLS Core Unified Launcher
# Cleans ports, configures auth, and starts both services.

Write-Host "--- MLS Unified Launcher ---" -ForegroundColor Cyan

# 1. Clean Stale Processes
Write-Host "Cleaning up ports 3000 and 3001..."
$ports = @(3000, 3001)
foreach ($port in $ports) {
    $pidsToCheck = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($pidsToCheck) {
        foreach ($p in $pidsToCheck) {
            Write-Host "Killing stale process $p on port $port" -ForegroundColor Yellow
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        }
    }
}

# 2. Check Database
Write-Host "Verifying Database..."
$pgService = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
if ($pgService.Status -ne "Running") {
    Write-Host "Starting PostgreSQL..."
    Start-Service -Name "postgresql-x64-17"
}

# 3. Start Backend (Background)
Write-Host "Starting MLS Core API (Backend)..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "npm" -ArgumentList "run dev" -WorkingDirectory "$PSScriptRoot" -PassThru -NoNewWindow

# 4. Start Frontend
Write-Host "Starting Blue Jax Web (Frontend)..." -ForegroundColor Green
# Give backend a moment
Start-Sleep -Seconds 5
Set-Location "$PSScriptRoot/web"
npm run dev
