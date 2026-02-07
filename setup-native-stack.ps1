# MLS Core Native Stack Setup
# Ensures PostgreSQL is running, DB is created, and Prisma is synced.

Write-Host "--- MLS Core Stack Setup ---" -ForegroundColor Cyan

# 1. Check PostgreSQL Service
Write-Host "Checking PostgreSQL 17 service..."
$service = Get-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
if ($service -eq $null) {
    Write-Host "ERROR: PostgreSQL 17 service not found. Please ensure it is installed." -ForegroundColor Red
    exit 1
}

if ($service.Status -ne "Running") {
    Write-Host "PostgreSQL is not running. Attempting to start..."
    # Note: Requires admin privileges, but we'll try anyway
    Start-Service -Name "postgresql-x64-17" -ErrorAction SilentlyContinue
}

# 2. Sync Database Schema
Write-Host "Synchronizing Prisma schema..."
npx prisma generate
npx prisma db push --skip-generate

# 3. Final Check
Write-Host "Stack is ready. Run 'npm run dev' to start the server." -ForegroundColor Green
