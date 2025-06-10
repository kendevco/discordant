# Simple VAPI Webhook Test Script
# Tests the webhook endpoint without Unicode characters

$baseUrl = "https://localhost:3000"
Write-Host "Testing VAPI Webhook Integration" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "`nTest 1: Health Check" -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Get
    Write-Host "PASS - Health check passed" -ForegroundColor Green
    Write-Host "Supported functions: $($healthResponse.supportedFunctions -join ', ')" -ForegroundColor White
} catch {
    Write-Host "FAIL - Health check failed: $_" -ForegroundColor Red
}

# Test 2: Capture Contact Info
Write-Host "`nTest 2: Capture Contact Info Function" -ForegroundColor Green
$capturePayload = @{
    message = @{
        type = "function-call"
        call = @{
            id = "test-call-001"
            phoneNumber = "+1-555-123-4567"
            assistantId = "leo-assistant"
            status = "in-progress"
        }
        toolCalls = @(
            @{
                id = "tool-call-001"
                type = "function"
                function = @{
                    name = "capture_contact_info"
                    arguments = '{"name":"John Doe","email":"john@example.com","phone":"+1-555-123-4567","company":"Example Corp","projectType":"nextjs-app","timeline":"2-3 months","budget":"$10k-25k","notes":"Interested in AI-powered e-commerce platform"}'
                }
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $captureResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $capturePayload -ContentType "application/json"
    Write-Host "PASS - Capture contact info test passed" -ForegroundColor Green
    Write-Host "Response: $($captureResponse.result)" -ForegroundColor White
} catch {
    Write-Host "FAIL - Capture contact info test failed: $_" -ForegroundColor Red
}

# Test 3: Schedule Consultation
Write-Host "`nTest 3: Schedule Consultation Function" -ForegroundColor Green
$schedulePayload = @{
    message = @{
        type = "function-call"
        call = @{
            id = "test-call-002"
            phoneNumber = "+1-555-123-4567"
            assistantId = "leo-assistant"
            status = "in-progress"
        }
        toolCalls = @(
            @{
                id = "tool-call-002"
                type = "function"
                function = @{
                    name = "schedule_consultation"
                    arguments = '{"name":"Jane Smith","email":"jane@example.com","date":"2024-01-15","time":"14:00","timezone":"America/New_York","projectType":"ai-automation","timeline":"ASAP","budget":"$25k+"}'
                }
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $scheduleResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $schedulePayload -ContentType "application/json"
    Write-Host "PASS - Schedule consultation test passed" -ForegroundColor Green
    Write-Host "Response: $($scheduleResponse.result)" -ForegroundColor White
} catch {
    Write-Host "FAIL - Schedule consultation test failed: $_" -ForegroundColor Red
}

# Test 4: Check Availability
Write-Host "`nTest 4: Check Availability Function" -ForegroundColor Green
$availabilityPayload = @{
    message = @{
        type = "function-call"
        call = @{
            id = "test-call-003"
            phoneNumber = "+1-555-123-4567"
            assistantId = "leo-assistant"
            status = "in-progress"
        }
        toolCalls = @(
            @{
                id = "tool-call-003"
                type = "function"
                function = @{
                    name = "check_availability"
                    arguments = '{"timeframe":"this week"}'
                }
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $availabilityResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $availabilityPayload -ContentType "application/json"
    Write-Host "PASS - Check availability test passed" -ForegroundColor Green
    Write-Host "Response: $($availabilityResponse.result)" -ForegroundColor White
} catch {
    Write-Host "FAIL - Check availability test failed: $_" -ForegroundColor Red
}

Write-Host "`nVAPI Webhook Testing Complete!" -ForegroundColor Cyan
Write-Host "All tests completed. Check responses above for any errors." -ForegroundColor Yellow

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Configure Leo assistant in VAPI dashboard with webhook URL:" -ForegroundColor White
Write-Host "   $baseUrl/api/voice-ai/vapi/webhook" -ForegroundColor Yellow
Write-Host "2. Add the 6 functions from the assistant config" -ForegroundColor White
Write-Host "3. Set server URL secret in VAPI dashboard" -ForegroundColor White
Write-Host "4. Test with real phone calls!" -ForegroundColor White 