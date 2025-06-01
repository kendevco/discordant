#!/usr/bin/env pwsh

Write-Host "🚀 QUICK WEBHOOK TEST - Run immediately after clicking 'Test workflow' in n8n!" -ForegroundColor Green

$payload = @{
    message = "What do I have today?"
    userId = "kenneth-test"
    userName = "Kenneth"
    channelId = "test-channel"
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
} | ConvertTo-Json

Write-Host "📤 Testing..." -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "https://n8n.kendev.co/webhook/google-ai-services" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -TimeoutSec 10

    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
    
} catch {
    Write-Host "❌ FAILED:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`n🎯 If this worked, you can now activate the workflow in production mode!" -ForegroundColor Cyan 