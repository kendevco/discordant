#!/usr/bin/env pwsh

Write-Host "🔧 Simple Workflow API Test" -ForegroundColor Cyan
Write-Host "=" * 40 -ForegroundColor Gray

# Test 1: Check if development server is running
Write-Host "`n1️⃣ Testing development server..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method GET -TimeoutSec 5
    Write-Host "✅ Development server is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Development server not accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Test workflow API without headers
Write-Host "`n2️⃣ Testing workflow API without X-Webhook-Path..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/workflow" `
        -Method POST `
        -ContentType "application/json" `
        -Body '{"message":"test"}' `
        -TimeoutSec 10
    Write-Host "❌ Should have failed but got: $($response | ConvertTo-Json)" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly returned error for missing webhook path" -ForegroundColor Green
}

# Test 3: Test workflow API with correct headers
Write-Host "`n3️⃣ Testing workflow API with headers..." -ForegroundColor Yellow
$payload = @{
    message = "What meetings do I have today?"
    userId = "test-user-123"
    userName = "Test User"
    channelId = "test-channel-123"
    timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    metadata = @{
        platform = "discordant-chat"
        messageType = "text"
        hasAttachment = $false
        priority = "normal"
        sessionId = "test-session-123"
        routedBy = "workflow-router"
        workflowId = "general-assistant"
        intent = "general"
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/workflow" `
        -Method POST `
        -ContentType "application/json" `
        -Headers @{
            "X-Workflow-Id" = "general-assistant"
            "X-Webhook-Path" = "discordant-ai-services"
        } `
        -Body $payload `
        -TimeoutSec 30
    
    Write-Host "✅ Workflow API SUCCESS!" -ForegroundColor Green
    Write-Host "📥 Response:" -ForegroundColor Yellow
    Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor White
    
} catch {
    Write-Host "❌ Workflow API Error:" -ForegroundColor Red
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

Write-Host "`n📝 Test completed!" -ForegroundColor Green 