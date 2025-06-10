#!/usr/bin/env pwsh

# HTTPS Development Setup for Discordant
# This script creates SSL certificates and configures HTTPS for local development

Write-Host "🔐 Setting up HTTPS Development Environment for Discordant" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

# Create certs directory if it doesn't exist
$certsDir = Join-Path $PSScriptRoot ".." "certs"
if (-not (Test-Path $certsDir)) {
    New-Item -ItemType Directory -Path $certsDir -Force | Out-Null
    Write-Host "📁 Created certs directory" -ForegroundColor Green
}

# Check if mkcert is installed
$mkcertInstalled = Get-Command mkcert -ErrorAction SilentlyContinue
if (-not $mkcertInstalled) {
    Write-Host "❌ mkcert is not installed. Installing via Chocolatey..." -ForegroundColor Yellow
    
    # Check if Chocolatey is installed
    $chocoInstalled = Get-Command choco -ErrorAction SilentlyContinue
    if (-not $chocoInstalled) {
        Write-Host "❌ Chocolatey is not installed. Please install it first:" -ForegroundColor Red
        Write-Host "   Run as Administrator: Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))" -ForegroundColor Gray
        Write-Host "   Then run this script again." -ForegroundColor Gray
        exit 1
    }
    
    # Install mkcert
    choco install mkcert -y
    $mkcertInstalled = Get-Command mkcert -ErrorAction SilentlyContinue
    
    if (-not $mkcertInstalled) {
        Write-Host "❌ Failed to install mkcert. Please install manually:" -ForegroundColor Red
        Write-Host "   https://github.com/FiloSottile/mkcert#installation" -ForegroundColor Gray
        exit 1
    }
}

Write-Host "✅ mkcert is available" -ForegroundColor Green

# Install mkcert CA
Write-Host "🔧 Installing mkcert CA..." -ForegroundColor Blue
mkcert -install

# Generate certificates for localhost development
Write-Host "🔑 Generating SSL certificates..." -ForegroundColor Blue
Set-Location $certsDir

$domains = @(
    "localhost",
    "127.0.0.1",
    "::1",
    "discordant.localhost",
    "api.localhost",
    "embed.localhost"
)

$domainsStr = $domains -join " "
mkcert $domainsStr

# Rename generated files to standard names
$latestCert = Get-ChildItem -Path $certsDir -Name "*.pem" | Sort-Object LastWriteTime | Select-Object -Last 2
if ($latestCert.Count -eq 2) {
    $certFile = $latestCert | Where-Object { $_ -like "*-cert.pem" } | Select-Object -First 1
    $keyFile = $latestCert | Where-Object { $_ -like "*-key.pem" } | Select-Object -First 1
    
    if ($certFile) {
        Rename-Item -Path $certFile -NewName "localhost.pem" -Force
        Write-Host "✅ Certificate: localhost.pem" -ForegroundColor Green
    }
    if ($keyFile) {
        Rename-Item -Path $keyFile -NewName "localhost-key.pem" -Force
        Write-Host "✅ Private Key: localhost-key.pem" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Certificate files not found with expected pattern. Please check certs directory." -ForegroundColor Yellow
}

# Create .env.local if it doesn't exist
$envLocalPath = Join-Path (Split-Path $certsDir) ".env.local"
if (-not (Test-Path $envLocalPath)) {
    Write-Host "📝 Creating .env.local with HTTPS configuration..." -ForegroundColor Blue
    
    $envContent = @"
# HTTPS Development Configuration
HTTPS=true
SSL_CRT_FILE=./certs/localhost.pem
SSL_KEY_FILE=./certs/localhost-key.pem

# Development URLs (HTTPS)
NEXT_PUBLIC_SITE_URL=https://localhost:3000
NEXT_PUBLIC_APP_URL=https://localhost:3000
NEXT_PUBLIC_SOCKET_URL=https://localhost:3000

# Update these with your actual values
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
CLERK_SECRET_KEY=your_clerk_secret_here
DATABASE_URL=your_database_url_here
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# n8n Integration (HTTPS)
N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook

# LiveKit (if using)
LIVEKIT_API_KEY=your_livekit_key_here
LIVEKIT_API_SECRET=your_livekit_secret_here
NEXT_PUBLIC_LIVEKIT_URL=wss://your_livekit_url_here

# External Integration (HTTPS)
DISCORDANT_API_TOKEN=your_api_token_here
DISCORDANT_BASE_URL=https://localhost:3000
NEXT_PUBLIC_DISCORDANT_URL=https://localhost:3000
"@
    
    Set-Content -Path $envLocalPath -Value $envContent -Encoding UTF8
    Write-Host "✅ Created .env.local" -ForegroundColor Green
} else {
    Write-Host "ℹ️  .env.local already exists. Please update it with HTTPS URLs manually." -ForegroundColor Yellow
}

# Update package.json with HTTPS dev script
Write-Host "📦 Updating package.json with HTTPS dev script..." -ForegroundColor Blue
$packageJsonPath = Join-Path (Split-Path $certsDir) "package.json"
$packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json

if (-not $packageJson.scripts."dev:https") {
    $packageJson.scripts | Add-Member -NotePropertyName "dev:https" -NotePropertyValue "next dev --experimental-https --experimental-https-key ./certs/localhost-key.pem --experimental-https-cert ./certs/localhost.pem"
    $packageJson | ConvertTo-Json -Depth 10 | Set-Content $packageJsonPath -Encoding UTF8
    Write-Host "✅ Added dev:https script to package.json" -ForegroundColor Green
} else {
    Write-Host "ℹ️  dev:https script already exists in package.json" -ForegroundColor Yellow
}

Write-Host "`n🎉 HTTPS Development Setup Complete!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Update .env.local with your actual environment variables" -ForegroundColor White
Write-Host "2. Run: npm run dev:https" -ForegroundColor White
Write-Host "3. Visit: https://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "🔗 HTTPS URLs:" -ForegroundColor Cyan
Write-Host "   • App: https://localhost:3000" -ForegroundColor White
Write-Host "   • API: https://localhost:3000/api" -ForegroundColor White
Write-Host "   • Widget: https://localhost:3000/discordant-widget.js" -ForegroundColor White
Write-Host "   • Embed: https://localhost:3000/embed/chat" -ForegroundColor White
Write-Host ""
Write-Host "🛠️  Troubleshooting:" -ForegroundColor Cyan
Write-Host "   • If browser shows certificate warning, click 'Advanced' → 'Proceed'" -ForegroundColor White
Write-Host "   • Chrome: Type 'thisisunsafe' on the warning page" -ForegroundColor White
Write-Host "   • Firefox: Click 'Advanced' → 'Accept Risk'" -ForegroundColor White
Write-Host ""
Write-Host "📁 Generated Files:" -ForegroundColor Cyan
Write-Host "   • ./certs/localhost.pem (certificate)" -ForegroundColor White
Write-Host "   • ./certs/localhost-key.pem (private key)" -ForegroundColor White
Write-Host "   • ./.env.local (environment variables)" -ForegroundColor White 