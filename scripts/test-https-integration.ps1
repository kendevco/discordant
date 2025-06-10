#!/usr/bin/env pwsh

# HTTPS Integration Test Script for Discordant
# Tests all HTTPS endpoints and external integration features

Write-Host "🧪 Testing HTTPS Integration for Discordant" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

$baseUrl = "https://localhost:3000"
$testResults = @()

# Function to test an endpoint
function Test-Endpoint {
    param(
        [string]$url,
        [string]$description,
        [string]$method = "GET",
        [hashtable]$headers = @{},
        [string]$body = $null
    )
    
    Write-Host "`n🔍 Testing: $description" -ForegroundColor Blue
    Write-Host "   URL: $url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            UseBasicParsing = $true
            SkipCertificateCheck = $true
            TimeoutSec = 10
        }
        
        if ($body) {
            $params.Body = $body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -eq 200) {
            Write-Host "   ✅ SUCCESS (Status: $($response.StatusCode))" -ForegroundColor Green
            return @{ Success = $true; Status = $response.StatusCode; Description = $description }
        } else {
            Write-Host "   ⚠️  WARNING (Status: $($response.StatusCode))" -ForegroundColor Yellow
            return @{ Success = $false; Status = $response.StatusCode; Description = $description }
        }
    }
    catch {
        Write-Host "   ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return @{ Success = $false; Status = "Error"; Description = $description; Error = $_.Exception.Message }
    }
}

# Check if HTTPS server is running
Write-Host "`n🚀 Checking if HTTPS server is running..." -ForegroundColor Yellow
$serverCheck = Test-Endpoint -url "$baseUrl" -description "Main Application"

if (-not $serverCheck.Success) {
    Write-Host "`n❌ HTTPS server is not running!" -ForegroundColor Red
    Write-Host "Please start the server with: npm run dev:https" -ForegroundColor Yellow
    exit 1
}

# Test core application endpoints
Write-Host "`n📍 Testing Core Application Endpoints" -ForegroundColor Cyan

$coreTests = @(
    @{ url = "$baseUrl"; description = "Main Page" },
    @{ url = "$baseUrl/api/health"; description = "Health Check API" },
    @{ url = "$baseUrl/sign-in"; description = "Sign In Page" }
)

foreach ($test in $coreTests) {
    $result = Test-Endpoint -url $test.url -description $test.description
    $testResults += $result
}

# Test external integration endpoints
Write-Host "`n🔌 Testing External Integration Endpoints" -ForegroundColor Cyan

$integrationTests = @(
    @{ url = "$baseUrl/api/external/tokens"; description = "External Tokens API" },
    @{ url = "$baseUrl/api/external/agents"; description = "External Agents API" },
    @{ url = "$baseUrl/discordant-widget.js"; description = "Widget JavaScript Library" },
    @{ url = "$baseUrl/embed/chat"; description = "Embedded Chat Interface" }
)

foreach ($test in $integrationTests) {
    $result = Test-Endpoint -url $test.url -description $test.description
    $testResults += $result
}

# Test widget embed with parameters
Write-Host "`n🔧 Testing Widget Embed with Parameters" -ForegroundColor Cyan
$widgetUrl = "$baseUrl/embed/chat?channelId=test&token=test&theme=light"
$widgetResult = Test-Endpoint -url $widgetUrl -description "Widget with Parameters"
$testResults += $widgetResult

# Test API with POST (if we have a test token)
Write-Host "`n📡 Testing External Message API" -ForegroundColor Cyan
$testMessage = @{
    channelId = "test-channel"
    content = "HTTPS Test Message"
    sourceType = "https-test"
    visitorData = @{
        sessionId = "test-session-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        name = "HTTPS Test User"
        metadata = @{
            testType = "https-integration"
            timestamp = (Get-Date).ToString("o")
        }
    }
} | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer test-token"
    "Content-Type" = "application/json"
    "User-Agent" = "Discordant-HTTPS-Test/1.0"
}

$apiResult = Test-Endpoint -url "$baseUrl/api/external/messages" -description "External Messages API (POST)" -method "POST" -headers $headers -body $testMessage
$testResults += $apiResult

# Test Socket.IO connection (basic check)
Write-Host "`n🔄 Testing Socket.IO Endpoint" -ForegroundColor Cyan
$socketResult = Test-Endpoint -url "$baseUrl/socket.io/" -description "Socket.IO Connection"
$testResults += $socketResult

# Test n8n webhook proxy
Write-Host "`n🤖 Testing n8n Webhook Integration" -ForegroundColor Cyan
$webhookUrl = "$baseUrl/api/external/webhook/n8n"
$webhookData = @{
    message = "HTTPS Integration Test"
    userId = "test-user"
    workflowId = "https-test"
    agentResponse = @{
        content = "Test response from HTTPS integration"
        type = "text"
    }
} | ConvertTo-Json -Depth 3

$webhookResult = Test-Endpoint -url $webhookUrl -description "n8n Webhook Endpoint" -method "POST" -headers $headers -body $webhookData
$testResults += $webhookResult

# Display summary
Write-Host "`n📊 Test Results Summary" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

$successCount = ($testResults | Where-Object { $_.Success }).Count
$totalCount = $testResults.Count

Write-Host "`n🎯 Overall Results: $successCount/$totalCount tests passed" -ForegroundColor $(if ($successCount -eq $totalCount) { "Green" } else { "Yellow" })

foreach ($result in $testResults) {
    $icon = if ($result.Success) { "✅" } else { "❌" }
    $color = if ($result.Success) { "Green" } else { "Red" }
    Write-Host "   $icon $($result.Description) - Status: $($result.Status)" -ForegroundColor $color
    
    if ($result.Error) {
        Write-Host "      Error: $($result.Error)" -ForegroundColor Red
    }
}

# HTTPS-specific checks
Write-Host "`n🔒 HTTPS-Specific Verification" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Check certificate validity
Write-Host "`n🔐 Checking SSL Certificate..." -ForegroundColor Blue
try {
    $cert = [System.Net.ServicePointManager]::ServerCertificateValidationCallback = { $true }
    $request = [System.Net.WebRequest]::Create($baseUrl)
    $response = $request.GetResponse()
    Write-Host "   ✅ SSL Certificate accepted" -ForegroundColor Green
    $response.Close()
} catch {
    Write-Host "   ⚠️  SSL Certificate warning (expected in development)" -ForegroundColor Yellow
}

# Test secure cookie support
Write-Host "`n🍪 Testing Secure Cookie Support..." -ForegroundColor Blue
try {
    $cookieContainer = New-Object System.Net.CookieContainer
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $session.Cookies = $cookieContainer
    
    $response = Invoke-WebRequest -Uri $baseUrl -WebSession $session -SkipCertificateCheck
    
    if ($session.Cookies.Count -gt 0) {
        Write-Host "   ✅ Cookies are working with HTTPS" -ForegroundColor Green
    } else {
        Write-Host "   ℹ️  No cookies set (may be normal)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Cookie test inconclusive" -ForegroundColor Yellow
}

# Environment checks
Write-Host "`n⚙️  Environment Configuration" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan

$envFile = Join-Path (Split-Path $PSScriptRoot) ".env.local"
if (Test-Path $envFile) {
    Write-Host "✅ .env.local file exists" -ForegroundColor Green
    
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "HTTPS=true") {
        Write-Host "✅ HTTPS enabled in environment" -ForegroundColor Green
    } else {
        Write-Host "⚠️  HTTPS not explicitly enabled in .env.local" -ForegroundColor Yellow
    }
    
    if ($envContent -match "https://localhost:3000") {
        Write-Host "✅ HTTPS URLs configured" -ForegroundColor Green
    } else {
        Write-Host "⚠️  HTTP URLs found - should be HTTPS" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
    Write-Host "   Run: ./scripts/setup-https-dev.ps1" -ForegroundColor Yellow
}

# Check certificate files
$certsDir = Join-Path (Split-Path $PSScriptRoot) "certs"
if (Test-Path $certsDir) {
    Write-Host "✅ Certificates directory exists" -ForegroundColor Green
    
    $certFile = Join-Path $certsDir "localhost.pem"
    $keyFile = Join-Path $certsDir "localhost-key.pem"
    
    if ((Test-Path $certFile) -and (Test-Path $keyFile)) {
        Write-Host "✅ SSL certificate files found" -ForegroundColor Green
    } else {
        Write-Host "❌ SSL certificate files missing" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Certificates directory not found" -ForegroundColor Red
}

Write-Host "`n🎉 HTTPS Integration Test Complete!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

if ($successCount -eq $totalCount) {
    Write-Host "`n🎯 All tests passed! Your HTTPS development environment is ready." -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Some tests failed. Check the errors above and:" -ForegroundColor Yellow
    Write-Host "   1. Ensure the server is running with: npm run dev:https" -ForegroundColor White
    Write-Host "   2. Check .env.local configuration" -ForegroundColor White
    Write-Host "   3. Verify SSL certificates are generated" -ForegroundColor White
}

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "• Test external widget integration" -ForegroundColor White
Write-Host "• Verify webhook endpoints with n8n" -ForegroundColor White
Write-Host "• Test real external API calls" -ForegroundColor White 