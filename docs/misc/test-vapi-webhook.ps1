# Test VAPI Webhook Integration
# This script tests the VAPI webhook endpoint with sample function calls

$baseUrl = "https://localhost:3000"  # Change to your dev server
# $baseUrl = "https://discordant.kendev.co"  # Change to production when ready

Write-Host "[TESTING] VAPI Webhook Integration" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "`n[Test 1] Health Check" -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Get
    Write-Host "[PASS] Health check passed" -ForegroundColor Green
    Write-Host "Supported functions: $($healthResponse.supportedFunctions -join ', ')" -ForegroundColor White
} catch {
    Write-Host "[FAIL] Health check failed: $_" -ForegroundColor Red
}

# Test 2: Function Call - Capture Contact Info
Write-Host "`n[Test 2] Function Call - Capture Contact Info" -ForegroundColor Green
$captureContactPayload = @{
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
    $captureResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $captureContactPayload -ContentType "application/json"
    Write-Host "[PASS] Capture contact info test passed" -ForegroundColor Green
    Write-Host "Response: $($captureResponse.result)" -ForegroundColor White
} catch {
    Write-Host "[FAIL] Capture contact info test failed: $_" -ForegroundColor Red
}

# Test 3: Function Call - Schedule Consultation
Write-Host "`n📅 Test 3: Function Call - Schedule Consultation" -ForegroundColor Green
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
    Write-Host "✅ Schedule consultation test passed" -ForegroundColor Green
    Write-Host "Response: $($scheduleResponse.result)" -ForegroundColor White
} catch {
    Write-Host "❌ Schedule consultation test failed: $_" -ForegroundColor Red
}

# Test 4: Function Call - Check Availability
Write-Host "`n🕐 Test 4: Function Call - Check Availability" -ForegroundColor Green
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
    Write-Host "✅ Check availability test passed" -ForegroundColor Green
    Write-Host "Response: $($availabilityResponse.result)" -ForegroundColor White
} catch {
    Write-Host "❌ Check availability test failed: $_" -ForegroundColor Red
}

# Test 5: Function Call - Create Lead
Write-Host "`n🎯 Test 5: Function Call - Create Lead" -ForegroundColor Green
$createLeadPayload = @{
    message = @{
        type = "function-call"
        call = @{
            id = "test-call-004"
            phoneNumber = "+1-555-123-4567"
            assistantId = "leo-assistant"
            status = "in-progress"
        }
        toolCalls = @(
            @{
                id = "tool-call-004"
                type = "function"
                function = @{
                    name = "create_lead"
                    arguments = '{"name":"Bob Wilson","email":"bob@bigcorp.com","phone":"+1-555-987-6543","company":"Big Corp","projectType":"legacy-modernization","timeline":"6 months","budget":"$100k+","qualificationNotes":"Serious buyer, has budget approved, decision maker"}'
                }
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $leadResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $createLeadPayload -ContentType "application/json"
    Write-Host "✅ Create lead test passed" -ForegroundColor Green
    Write-Host "Response: $($leadResponse.result)" -ForegroundColor White
} catch {
    Write-Host "❌ Create lead test failed: $_" -ForegroundColor Red
}

# Test 6: Tool Call Response (Conversation Analysis)
Write-Host "`n[Test 6] Tool Call Response - Conversation Analysis" -ForegroundColor Green
$analysisPayload = @{
    message = @{
        type = "tool-call-response"
        call = @{
            id = "test-call-005"
            phoneNumber = "+1-555-123-4567"
            assistantId = "leo-assistant"
            status = "completed"
        }
        toolCallId = "conversation_processed"
        transcript = "Customer expressed interest in NextJS development services. Provided contact information and scheduled follow-up."
        summary = "Qualified lead for NextJS development project"
    }
} | ConvertTo-Json -Depth 10

try {
    $analysisResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $analysisPayload -ContentType "application/json"
    Write-Host "✅ Conversation analysis test passed" -ForegroundColor Green
    Write-Host "Response: $($analysisResponse.result)" -ForegroundColor White
} catch {
    Write-Host "❌ Conversation analysis test failed: $_" -ForegroundColor Red
}

Write-Host "`n[SUCCESS] VAPI Webhook Testing Complete!" -ForegroundColor Cyan
Write-Host "[INFO] All tests completed. Check the responses above for any errors." -ForegroundColor Yellow

# Test Assistant Management API
Write-Host "`n[BONUS] Testing Assistant Management API" -ForegroundColor Magenta

try {
    $assistantResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/assistant" -Method Get
    Write-Host "✅ Assistant management API accessible" -ForegroundColor Green
    Write-Host "Leo config functions: $($assistantResponse.leoConfig.supportedFunctions.Count) functions available" -ForegroundColor White
} catch {
    Write-Host "❌ Assistant management API test failed: $_" -ForegroundColor Red
}

Write-Host "`n[NEXT STEPS]:" -ForegroundColor Cyan
Write-Host "1. Configure Leo assistant in VAPI dashboard with webhook URL:" -ForegroundColor White
Write-Host "   $baseUrl/api/voice-ai/vapi/webhook" -ForegroundColor Yellow
Write-Host "2. Add the 6 functions from the assistant config" -ForegroundColor White
Write-Host "3. Set server URL secret in VAPI dashboard" -ForegroundColor White
Write-Host "4. Test with real phone calls!" -ForegroundColor White 