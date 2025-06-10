# Production VAPI Webhook Test Script
# Tests the webhook endpoint at https://discordant.kendev.co

$baseUrl = "https://discordant.kendev.co"
Write-Host "Testing PRODUCTION VAPI Webhook Integration" -ForegroundColor Cyan
Write-Host "Base URL: $baseUrl" -ForegroundColor Yellow

# Test 1: Health Check
Write-Host "`nTest 1: Health Check" -ForegroundColor Green
try {
    $healthResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Get
    Write-Host "PASS - Health check passed" -ForegroundColor Green
    Write-Host "Supported functions: $($healthResponse.supportedFunctions -join ', ')" -ForegroundColor White
    Write-Host "Webhook version: $($healthResponse.version)" -ForegroundColor White
} catch {
    Write-Host "FAIL - Health check failed: $_" -ForegroundColor Red
    Write-Host "Make sure the production server is running" -ForegroundColor Yellow
}

# Test 2: Capture Contact Info
Write-Host "`nTest 2: Capture Contact Info Function" -ForegroundColor Green
$capturePayload = @{
    message = @{
        type = "function-call"
        call = @{
            id = "test-call-prod-001"
            phoneNumber = "+1-555-KENDEV-0"
            assistantId = "leo-assistant"
            status = "in-progress"
        }
        toolCalls = @(
            @{
                id = "tool-call-prod-001"
                type = "function"
                function = @{
                    name = "capture_contact_info"
                    arguments = '{"name":"Leo Test Contact","email":"test@kendev.co","phone":"+1-555-KENDEV-0","company":"KenDev Test Corp","projectType":"nextjs-app","timeline":"ASAP","budget":"$50k+","notes":"Production test of Leo voice assistant webhook integration"}'
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

# Test 3: Create Lead Function
Write-Host "`nTest 3: Create Lead Function" -ForegroundColor Green
$leadPayload = @{
    message = @{
        type = "function-call"
        call = @{
            id = "test-call-prod-002"
            phoneNumber = "+1-555-KENDEV-0"
            assistantId = "leo-assistant"
            status = "in-progress"
        }
        toolCalls = @(
            @{
                id = "tool-call-prod-002"
                type = "function"
                function = @{
                    name = "create_lead"
                    arguments = '{"name":"Production Test Lead","email":"lead@kendev.co","phone":"+1-555-KENDEV-0","company":"KenDev Productions","projectType":"ai-automation","timeline":"Q1 2024","budget":"$100k+","qualificationNotes":"High-value production test lead for Leo voice assistant"}'
                }
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $leadResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $leadPayload -ContentType "application/json"
    Write-Host "PASS - Create lead test passed" -ForegroundColor Green
    Write-Host "Response: $($leadResponse.result)" -ForegroundColor White
} catch {
    Write-Host "FAIL - Create lead test failed: $_" -ForegroundColor Red
}

# Test 4: Send Follow-up Email
Write-Host "`nTest 4: Send Follow-up Email Function" -ForegroundColor Green
$emailPayload = @{
    message = @{
        type = "function-call"
        call = @{
            id = "test-call-prod-003"
            phoneNumber = "+1-555-KENDEV-0"
            assistantId = "leo-assistant"
            status = "in-progress"
        }
        toolCalls = @(
            @{
                id = "tool-call-prod-003"
                type = "function"
                function = @{
                    name = "send_follow_up_email"
                    arguments = '{"name":"Production Test","email":"followup@kendev.co","emailType":"high-priority-lead","projectSummary":"AI automation and NextJS development needs","nextSteps":"Schedule consultation with Kenneth"}'
                }
            }
        )
    }
} | ConvertTo-Json -Depth 10

try {
    $emailResponse = Invoke-RestMethod -Uri "$baseUrl/api/voice-ai/vapi/webhook" -Method Post -Body $emailPayload -ContentType "application/json"
    Write-Host "PASS - Send follow-up email test passed" -ForegroundColor Green
    Write-Host "Response: $($emailResponse.result)" -ForegroundColor White
} catch {
    Write-Host "FAIL - Send follow-up email test failed: $_" -ForegroundColor Red
}

Write-Host "`nPRODUCTION VAPI Webhook Testing Complete!" -ForegroundColor Cyan
Write-Host "All production tests completed. Check Discord #folio-site-assistant for notifications." -ForegroundColor Yellow

Write-Host "`nProduction Configuration for VAPI Dashboard:" -ForegroundColor Cyan
Write-Host "Webhook URL: $baseUrl/api/voice-ai/vapi/webhook" -ForegroundColor Yellow
Write-Host "Server Secret: vapi-webhook-secret-2024" -ForegroundColor Yellow
Write-Host "Environment: PRODUCTION" -ForegroundColor Green

Write-Host "`nNext Steps:" -ForegroundColor Cyan
Write-Host "1. Update Leo assistant in VAPI dashboard with PRODUCTION webhook URL" -ForegroundColor White
Write-Host "2. Verify all 6 functions are configured" -ForegroundColor White
Write-Host "3. Test with real phone calls to Leo" -ForegroundColor White
Write-Host "4. Monitor Discord notifications for lead capture" -ForegroundColor White
Write-Host "5. Check n8n workflows for automation triggers" -ForegroundColor White 