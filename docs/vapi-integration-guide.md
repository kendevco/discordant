# VAPI Integration System for KenDev.co

## Overview

This comprehensive VAPI (Voice AI Platform Integration) system provides:

1. **Real-time Voice AI Sales Assistant** running on your website
2. **Automatic Discord System Notifications** for all customer interactions
3. **Google Calendar Integration** for appointment scheduling
4. **Email Automation** for follow-up and interaction reports
5. **Lead Qualification and Analysis** with sentiment scoring
6. **CORS Proxy** for handling problematic external API calls

## System Architecture

```
Customer Website (KenDev.co)
    ↓ (Voice Interaction)
VAPI AI Assistant
    ↓ (Webhook)
Next.js API Routes (/api/voice-ai/vapi)
    ↓ (Processes & Analyzes)
Multiple Output Channels:
    ├── Discord #system Channel (Real-time notifications)
    ├── Google Calendar (Meeting scheduling)
    ├── Email Reports (Kenneth + Customer)
    └── n8n Workflows (Additional automation)
```

## Features

### 🤖 Voice AI Sales Assistant
- **Real-time conversation handling** on KenDev.co website
- **Natural language processing** for customer inquiries
- **Lead qualification** with automatic scoring
- **Service interest detection** based on conversation content
- **Appointment scheduling** through voice commands

### 📧 Email Automation
- **Comprehensive interaction reports** sent to Kenneth after each call
- **Beautiful HTML email templates** with lead analysis
- **Automatic customer follow-up emails** with personalized content
- **Call transcript attachments** for detailed review
- **Lead quality scoring** and urgency assessment

### 📅 Google Calendar Integration
- **Automatic appointment scheduling** from voice requests
- **Conflict detection** and optimal time slot finding
- **Google Meet link generation** for virtual consultations
- **Calendar event creation** with detailed context
- **Email reminders** and notifications

### 💬 Discord System Notifications
- **Real-time system messages** in #system channel
- **Lead quality indicators** with emoji scoring
- **Contact information extraction** and display
- **Next action recommendations** based on conversation
- **Sentiment analysis** and urgency classification

### 🔄 n8n Workflow Integration
- **Seamless data flow** to existing automation workflows
- **Calendar event processing** for CRM integration
- **Lead scoring** and qualification routing
- **Follow-up sequence triggers** based on lead quality

## Setup Requirements

### Environment Variables

Add these to your `.env` file:

```bash
# VAPI Configuration
VAPI_API_KEY=your_vapi_api_key
VAPI_ASSISTANT_ID=your_assistant_id
VAPI_PHONE_NUMBER_ID=your_phone_number_id

# Google Calendar Integration
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_service_account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SERVICE_ACCOUNT_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_ID=your_calendar_id

# Email Configuration
GMAIL_USER=kenneth.courtney@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# n8n Integration
N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook

# Database
DATABASE_URL=your_database_url
```

### Google Calendar Setup

1. **Create Google Cloud Project**
   - Go to Google Cloud Console
   - Create new project or select existing
   - Enable Google Calendar API

2. **Create Service Account**
   - Navigate to IAM & Admin → Service Accounts
   - Create new service account
   - Download JSON key file
   - Extract email, private_key, and client_id for environment variables

3. **Share Calendar**
   - Open Google Calendar
   - Share your calendar with the service account email
   - Grant "Make changes and manage sharing" permissions

### Gmail App Password Setup

1. **Enable 2-Factor Authentication**
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Turn on 2FA

2. **Generate App Password**
   - Security → App passwords
   - Select "Mail" and "Other"
   - Name it "VAPI Integration"
   - Copy the generated password to `GMAIL_APP_PASSWORD`

## Installation

1. **Install Dependencies**
   ```bash
   npm install googleapis nodemailer @types/nodemailer
   ```

2. **Run Database Migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Main VAPI Webhook
- **URL**: `/api/voice-ai/vapi`
- **Method**: POST
- **Purpose**: Handles all VAPI webhook events

### CORS Proxy
- **URL**: `/api/voice-ai/vapi/proxy`
- **Method**: POST, OPTIONS, GET
- **Purpose**: Proxies requests to external APIs with CORS headers

### Call Management
- **URL**: `/api/voice-ai/vapi/call`
- **Method**: POST
- **Purpose**: Manages VAPI call creation and configuration

## Usage Examples

### 1. Customer Voice Interaction Flow

```javascript
// Customer says: "I need a website for my business"
// VAPI processes and triggers webhook:

{
  "message": {
    "call": {
      "id": "call_123",
      "status": "ended",
      "transcript": "user: I need a website for my business\nassistant: I'd be happy to help with that. What type of business do you have?",
      "duration": "00:03:45"
    },
    "customer": {
      "number": "+1234567890"
    }
  }
}
```

### 2. Automatic Lead Analysis

The system automatically analyzes:
- **Lead Quality**: HOT, WARM, COLD, or PROSPECT
- **Services of Interest**: Web Development, AI Integration, etc.
- **Urgency Level**: HIGH, MEDIUM, LOW
- **Sentiment Score**: 1-10 rating
- **Contact Information**: Name, email, phone, company

### 3. Discord System Message Example

```markdown
🤖 **VAPI Sales Interaction Report**

**📞 Call Information**
• Call ID: `call_123`
• Date & Time: Monday, January 15, 2024 at 2:30:00 PM Eastern Standard Time
• Duration: 00:03:45
• Customer Number: +1234567890

**📊 Lead Assessment**
• Lead Quality: 🔥 HOT LEAD
• Interest Level: 😊 8/10
• Urgency: ⚡ MEDIUM

**💼 Services Discussed**
• Full-Stack Development
• E-commerce Solutions

**📋 Next Actions Required**
• 📅 Schedule consultation call
• 💰 Prepare project estimate

**🎯 Recommended Follow-up**
• ⏰ Follow-up within 24 hours
• 📧 Send personalized email with relevant case studies
```

### 4. Email Report Features

- **Lead Quality Visualization** with color-coded sections
- **Interactive Contact Buttons** (call, email, view in Discord)
- **Transcript Attachment** for detailed review
- **Meeting Links** if consultation was scheduled
- **Action Item Checklist** for follow-up

## Advanced Configuration

### Lead Quality Scoring

The system uses keyword analysis to score leads:

```javascript
// High Quality Keywords
['budget', 'timeline', 'project', 'hire', 'contract', 'deadline', 'launch']

// Medium Quality Keywords  
['interested', 'tell me more', 'pricing', 'cost', 'quote']

// Low Quality Keywords
['just browsing', 'maybe', 'thinking about', 'someday']
```

### Service Detection

Automatically detects interest in:
- Full-Stack Development
- AI Integration
- Mobile Development
- E-commerce Solutions
- Consulting Services
- Custom Software

### Calendar Scheduling Logic

1. **Parse customer request** for preferred date/time
2. **Check calendar availability** using Google Calendar API
3. **Find optimal time slot** avoiding conflicts
4. **Create meeting** with Google Meet link
5. **Send invitations** to both parties
6. **Set reminders** (24 hours and 15 minutes before)

## Troubleshooting

### Common Issues

1. **Calendar Permission Errors**
   - Verify service account has calendar access
   - Check that calendar is shared with service account email

2. **Email Sending Failures**
   - Confirm Gmail app password is correct
   - Ensure 2FA is enabled on Google account

3. **VAPI Webhook Not Receiving**
   - Check webhook URL in VAPI dashboard
   - Verify environment variables are set correctly

4. **Discord System Messages Not Appearing**
   - Confirm "Code with KenDev" server exists
   - Verify #system channel is present
   - Check database connection

### Debug Logging

Enable detailed logging by checking:
- Browser console for frontend errors
- Server logs for API endpoint responses
- VAPI dashboard for webhook delivery status
- n8n execution logs for workflow processing

## Security Considerations

- **API Key Protection**: All sensitive keys stored as environment variables
- **Domain Whitelisting**: CORS proxy only allows approved domains
- **Email Validation**: Customer email addresses are validated before sending
- **Calendar Permissions**: Service account has minimal required permissions
- **Webhook Verification**: VAPI webhook signatures should be verified (implement as needed)

## Future Enhancements

1. **CRM Integration**: Automatic lead creation in popular CRM systems
2. **SMS Notifications**: Text message alerts for high-priority leads
3. **Analytics Dashboard**: Visual reporting of call metrics and conversion rates
4. **Multi-language Support**: Extend AI assistant to handle multiple languages
5. **Lead Scoring ML**: Machine learning model for more accurate lead qualification
6. **Outbound Campaign Management**: Automated follow-up sequences based on lead behavior

## Support

For issues or questions about this VAPI integration:

1. Check the troubleshooting section above
2. Review environment variable configuration
3. Test individual components (calendar, email, Discord)
4. Contact Kenneth Courtney for advanced configuration assistance

---

*This integration was built to provide comprehensive sales automation for KenDev.co, combining voice AI technology with modern business tools for maximum efficiency and conversion.* 