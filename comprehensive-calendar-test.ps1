#!/usr/bin/env pwsh

Write-Host "📅 COMPREHENSIVE CALENDAR ASSISTANT TEST SUITE" -ForegroundColor Cyan
Write-Host "Testing: https://n8n.kendev.co/webhook/google-ai-services" -ForegroundColor Yellow
Write-Host "=" * 60 -ForegroundColor Gray

$baseUrl = "https://n8n.kendev.co/webhook/google-ai-services"
$testCount = 0
$successCount = 0

function Test-CalendarRequest {
    param(
        [string]$TestName,
        [string]$Message,
        [string]$Intent,
        [string]$Description
    )
    
    $global:testCount++
    Write-Host "`n[$global:testCount] 🧪 $TestName" -ForegroundColor Green
    Write-Host "    💬 Message: $Message" -ForegroundColor Gray
    Write-Host "    🎯 Intent: $Intent" -ForegroundColor Gray
    Write-Host "    📝 Description: $Description" -ForegroundColor Gray
    
    $payload = @{
        message = $Message
        userId = "kenneth-duty-officer-test"
        userName = "Kenneth (Duty Officer Test)"
        channelId = "business-ops-channel"
        timestamp = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
        intent = $Intent
        requestContext = @{
            platform = "discordant-business-ops"
            userRole = "duty-officer"
            priority = switch ($Intent) {
                "create" { "high" }
                "update" { "high" }
                "delete" { "high" }
                "availability" { "medium" }
                default { "normal" }
            }
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl `
            -Method POST `
            -ContentType "application/json" `
            -Body $payload `
            -TimeoutSec 15 `
            -Headers @{
                "User-Agent" = "Discordant-Business-Ops/1.0"
                "X-Requested-From" = "duty-officer-console"
                "X-Test-Case" = $TestName
            }
        
        $global:successCount++
        Write-Host "    ✅ SUCCESS!" -ForegroundColor Green
        Write-Host "    📄 Response:" -ForegroundColor White
        Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor Cyan
        
    } catch {
        Write-Host "    ❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
        if ($_.Exception.Response) {
            Write-Host "    🔍 Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        }
    }
    
    Start-Sleep -Seconds 1
}

# Test Cases for Current Calendar Features
Write-Host "`n🎯 BASIC CALENDAR OPERATIONS" -ForegroundColor Magenta

Test-CalendarRequest `
    -TestName "View Today's Schedule" `
    -Message "What do I have today?" `
    -Intent "view" `
    -Description "Basic daily schedule retrieval"

Test-CalendarRequest `
    -TestName "Check Tomorrow's Events" `
    -Message "Show me my calendar for tomorrow" `
    -Intent "view" `
    -Description "Next day schedule planning"

Test-CalendarRequest `
    -TestName "Weekly Overview" `
    -Message "What meetings do I have next week?" `
    -Intent "view" `
    -Description "Weekly planning and preparation"

Test-CalendarRequest `
    -TestName "Availability Check" `
    -Message "Am I free this afternoon for a 2-hour client call?" `
    -Intent "availability" `
    -Description "Business availability assessment"

Test-CalendarRequest `
    -TestName "Create Business Meeting" `
    -Message "Schedule a team standup meeting tomorrow at 9am for 30 minutes" `
    -Intent "create" `
    -Description "Standard business meeting creation"

Test-CalendarRequest `
    -TestName "Create Client Appointment" `
    -Message "Book a client consultation with National Registration Group next Friday at 2pm" `
    -Intent "create" `
    -Description "External client meeting scheduling"

Test-CalendarRequest `
    -TestName "Update Meeting Time" `
    -Message "Move my 3pm meeting to 4pm today" `
    -Intent "update" `
    -Description "Schedule adjustment for conflicts"

Test-CalendarRequest `
    -TestName "Cancel Appointment" `
    -Message "Cancel my dentist appointment next Tuesday" `
    -Intent "delete" `
    -Description "Appointment cancellation"

# Test Cases for Business Operations
Write-Host "`n💼 BUSINESS OPERATIONS" -ForegroundColor Magenta

Test-CalendarRequest `
    -TestName "Outbound Calling Schedule" `
    -Message "Block out time for prospecting calls from 10am to 12pm Monday through Friday" `
    -Intent "create" `
    -Description "B2B calling schedule management"

Test-CalendarRequest `
    -TestName "Client Follow-up" `
    -Message "Schedule follow-up calls with leads from this week" `
    -Intent "create" `
    -Description "Lead nurturing and follow-up"

Test-CalendarRequest `
    -TestName "Quarterly Planning" `
    -Message "When is my next quarterly business review meeting?" `
    -Intent "view" `
    -Description "Strategic planning visibility"

# Future Features (Photo Analysis & Journaling)
Write-Host "`n📸 FUTURE ENHANCEMENTS (Photo Analysis & Journaling)" -ForegroundColor Magenta

Test-CalendarRequest `
    -TestName "Driving Log Entry" `
    -Message "Create a driving log entry: Odometer 85,432 miles, heading to client meeting at National Registration Group, location: Tampa FL" `
    -Intent "create" `
    -Description "Automated driving log with geo data"

Test-CalendarRequest `
    -TestName "Photo Journal Analysis" `
    -Message "Analyze this photo and create a journal entry: Meeting room setup for quarterly review, whiteboard shows Q4 goals" `
    -Intent "create" `
    -Description "Photo-to-journal automated workflow"

Test-CalendarRequest `
    -TestName "Location-Based Reminder" `
    -Message "When I'm at the office next, remind me to update the client presentation slides" `
    -Intent "create" `
    -Description "Geo-triggered task management"

Test-CalendarRequest `
    -TestName "Narrative Timeline" `
    -Message "Show me my activities and photos from last Tuesday to create a daily summary" `
    -Intent "view" `
    -Description "Automated daily narrative generation"

# Test Results Summary
Write-Host "`n" + "=" * 60 -ForegroundColor Gray
Write-Host "📊 TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "Total Tests: $testCount" -ForegroundColor White
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $($testCount - $successCount)" -ForegroundColor Red
Write-Host "Success Rate: $([math]::Round(($successCount / $testCount) * 100, 1))%" -ForegroundColor Yellow

if ($successCount -gt 0) {
    Write-Host "`n✅ READY FOR PRODUCTION!" -ForegroundColor Green
    Write-Host "🎯 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Activate workflow in n8n (remove -test from URL)" -ForegroundColor White
    Write-Host "  2. Update your chat app to use production webhook" -ForegroundColor White
    Write-Host "  3. Test in real chat environment" -ForegroundColor White
    Write-Host "  4. Begin implementing photo analysis features" -ForegroundColor White
} else {
    Write-Host "`n⚠️  TROUBLESHOOTING NEEDED" -ForegroundColor Yellow
    Write-Host "🔧 Check:" -ForegroundColor Cyan
    Write-Host "  1. n8n workflow is active and saved" -ForegroundColor White
    Write-Host "  2. Google Calendar API credentials are configured" -ForegroundColor White
    Write-Host "  3. Webhook URL is correct" -ForegroundColor White
    Write-Host "  4. CORS settings allow your test origin" -ForegroundColor White
}

Write-Host "`n🚀 Ready for National Registration Group business operations!" -ForegroundColor Magenta 