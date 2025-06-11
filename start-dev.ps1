#!/usr/bin/env pwsh

Write-Host "🚀 Starting Discordant Development Server with Optimized Memory Settings" -ForegroundColor Cyan

# Kill any existing Node processes
Write-Host "🔄 Cleaning up existing Node processes..." -ForegroundColor Yellow
taskkill /F /IM node.exe 2>$null | Out-Null

# Set memory limit to 8GB
Write-Host "💾 Setting Node.js memory limit to 8GB..." -ForegroundColor Green
$env:NODE_OPTIONS="--max-old-space-size=8192"

# Clear Next.js cache
Write-Host "🧹 Clearing Next.js cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Next.js cache cleared" -ForegroundColor Green
}

# Check if certificates exist
$certPath = "./certs/localhost.pem"
$keyPath = "./certs/localhost-key.pem"

if (-not (Test-Path $certPath) -or -not (Test-Path $keyPath)) {
    Write-Host "⚠️  HTTPS certificates not found. Running in HTTP mode..." -ForegroundColor Yellow
    Write-Host "📦 Starting development server (HTTP)..." -ForegroundColor Cyan
    npm run dev
} else {
    Write-Host "🔐 HTTPS certificates found" -ForegroundColor Green
    Write-Host "📦 Starting development server (HTTPS)..." -ForegroundColor Cyan
    npm run dev:https
}

# If the script exits, show memory optimization tips
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Server crashed. Here are some optimization tips:" -ForegroundColor Red
    Write-Host "1. Close other applications to free up memory" -ForegroundColor Yellow
    Write-Host "2. Try running 'npm run build' to check for build errors" -ForegroundColor Yellow
    Write-Host "3. Consider upgrading your system RAM if this persists" -ForegroundColor Yellow
    Write-Host "4. Run 'npm update' to ensure all packages are up to date" -ForegroundColor Yellow
} 