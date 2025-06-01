#!/usr/bin/env pwsh

Write-Host "🚀 Testing Discordant → n8n Webhook Integration" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

# Test payload that mimics what system-messages.ts sends
$payload = @{
    message = "What meetings do I have today?"
    userId = "a90a7a15-1419-4c72-b58f-52adfc11a0aa"
    channelId = "test-channel-123"
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    platform = "discordant"
    metadata = @{
        sessionId = "a90a7a15-1419-4c72-b58f-52adfc11a0aa-test-channel-123"
        testMode = $false
        userAgent = "Discordant-Chat-App/1.0"
    }
} | ConvertTo-Json -Depth 3

Write-Host "📤 Sending test message through workflow proxy..." -ForegroundColor Yellow
Write-Host "📍 Webhook URL: https://n8n.kendev.co/webhook/discordant-ai-services" -ForegroundColor Gray
Write-Host "📦 Payload:" -ForegroundColor Gray
Write-Host $payload -ForegroundColor White

try {
    # Test the direct n8n webhook
    Write-Host "`n🎯 Testing direct n8n webhook..." -ForegroundColor Cyan
    $directResponse = Invoke-RestMethod -Uri "https://n8n.kendev.co/webhook/discordant-ai-services" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -TimeoutSec 30 `
        -Headers @{
            "User-Agent" = "Discordant-Chat-App/1.0"
        }
    
    Write-Host "✅ Direct n8n webhook SUCCESS!" -ForegroundColor Green
    Write-Host "📥 Response:" -ForegroundColor Yellow
    Write-Host ($directResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
    
    # Test through Discordant proxy (if running locally)
    Write-Host "`n🔄 Testing through Discordant workflow proxy..." -ForegroundColor Cyan
    $proxyResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/workflow" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -TimeoutSec 30 `
        -Headers @{
            "X-Workflow-Id" = "enhanced-business-intelligence"
            "X-Webhook-Path" = "discordant-ai-services"
            "User-Agent" = "Discordant-Chat-App/1.0"
        }
    
    Write-Host "✅ Discordant proxy SUCCESS!" -ForegroundColor Green
    Write-Host "📥 Response:" -ForegroundColor Yellow
    Write-Host ($proxyResponse | ConvertTo-Json -Depth 5) -ForegroundColor White
    
} catch {
    Write-Host "❌ Error occurred:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode
        Write-Host "HTTP Status: $statusCode" -ForegroundColor Yellow
        
        try {
            $errorResponse = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorResponse)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Error Response: $errorBody" -ForegroundColor Yellow
        } catch {
            Write-Host "Could not read error response body" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n🔧 Debug Info:" -ForegroundColor Cyan
Write-Host "• Make sure your Discordant app is running on localhost:3000" -ForegroundColor Gray
Write-Host "• Verify the n8n workflow is activated and listening" -ForegroundColor Gray
Write-Host "• Check that system-messages.ts is routing through the workflow proxy" -ForegroundColor Gray

Write-Host "`n📝 Test completed!" -ForegroundColor Green 