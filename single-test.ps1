#!/usr/bin/env pwsh

Write-Host "🔥 SINGLE WEBHOOK TEST" -ForegroundColor Red
Write-Host "Testing basic connectivity..." -ForegroundColor Yellow

$payload = @{
    message = "What do I have today?"
    userId = "kenneth-test"
    userName = "Kenneth"
    channelId = "test"
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

try {
    Write-Host "📤 Sending request..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/calendar" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -TimeoutSec 10

    Write-Host "🎉 SUCCESS! Webhook is working!" -ForegroundColor Green
    Write-Host "Response:" -ForegroundColor Cyan
    Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
    
    Write-Host "`n✅ Ready to run comprehensive test suite!" -ForegroundColor Green
    Write-Host "Run: .\comprehensive-calendar-test.ps1" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Not working yet: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`n🔧 Make sure in n8n you:" -ForegroundColor Yellow
    Write-Host "  1. Click 'Test workflow' button" -ForegroundColor White
    Write-Host "  2. Run this script immediately after" -ForegroundColor White
    Write-Host "  OR" -ForegroundColor Yellow
    Write-Host "  3. Activate the workflow (green toggle)" -ForegroundColor White
} 