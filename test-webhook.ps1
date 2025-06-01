#!/usr/bin/env pwsh

# Test script for n8n Calendar Webhook
Write-Host "🧪 Testing n8n Calendar Webhook" -ForegroundColor Cyan
Write-Host "Webhook URL: https://n8n.kendev.co/webhook/google-ai-services" -ForegroundColor Yellow

# Test payload
$payload = @{
    message = "What do I have today?"
    userId = "test-user-123"
    userName = "Test User"
    channelId = "test-channel"
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    intent = "view"
    requestContext = @{
        platform = "discordant-chat-test"
        userRole = "staff"
        priority = "normal"
    }
} | ConvertTo-Json -Depth 3

Write-Host "📤 Sending payload:" -ForegroundColor Green
Write-Host $payload -ForegroundColor Gray

try {
    $response = Invoke-RestMethod -Uri "https://n8n.kendev.co/webhook/google-ai-services" `
        -Method POST `
        -ContentType "application/json" `
        -Body $payload `
        -TimeoutSec 30 `
        -Headers @{
            "User-Agent" = "Discordant-Chat-App/1.0-Test"
            "X-Requested-From" = "discordant-test-script"
        }
    
    Write-Host "✅ Success! Response received:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
    
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

Write-Host "`n🔧 CORS Configuration Instructions:" -ForegroundColor Cyan
Write-Host "In your n8n webhook settings, ensure CORS origins include:" -ForegroundColor White
Write-Host "https://discordant.kendev.co,http://localhost:3000,http://localhost:3001,http://localhost:8080" -ForegroundColor Yellow

Write-Host "`n📝 Test completed!" -ForegroundColor Cyan 