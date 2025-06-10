# Folio ↔ Discordant Integration Guide

This guide provides step-by-step instructions for integrating **folio.kendev.co** with your **Discordant** application for seamless client communication and AI-powered assistance.

## 🎯 Integration Overview

**Discordant** acts as your central communication hub where:
- Client inquiries from Folio are automatically routed to the `#folio-site-assistant` channel
- AI agents process and respond to client questions
- Team members can engage in real-time conversations
- Voice calls and video meetings are facilitated through integrated systems

## 🔐 Authentication Setup

### Step 1: Generate API Token

1. **Access Admin Panel**: Navigate to `https://discordant.kendev.co/admin/external-integrations`
2. **Create New Token**:
   ```json
   {
     "name": "Folio Site Integration",
     "permissions": ["SEND_MESSAGES", "READ_CHANNELS", "WEBHOOK_ACCESS"],
     "agentId": "folio-assistant",
     "description": "Integration token for folio.kendev.co client communications"
   }
   ```
3. **Save Token**: Copy and securely store the generated API token

### Step 2: Configure Environment Variables

Add to your Folio `.env` file:
```bash
# Discordant Integration
DISCORDANT_API_URL=https://discordant.kendev.co
DISCORDANT_API_TOKEN=your_generated_token_here
DISCORDANT_SERVER_ID=a90f1d41-12a9-4586-b9a4-a513d3bd01d9
DISCORDANT_CHANNEL_ID=8dd52... # folio-site-assistant channel ID
DISCORDANT_AGENT_ID=folio-assistant
```

## 📡 API Integration Endpoints

### Core Messaging API

**Send Message to Channel:**
```javascript
// POST https://discordant.kendev.co/api/external/messages
const response = await fetch(`${DISCORDANT_API_URL}/api/external/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DISCORDANT_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    channelId: DISCORDANT_CHANNEL_ID,
    content: "New client inquiry from Folio",
    agentId: DISCORDANT_AGENT_ID,
    metadata: {
      source: 'folio.kendev.co',
      clientId: 'client_123',
      urgency: 'normal',
      category: 'sales_inquiry'
    }
  })
});
```

**Visitor Activity Tracking:**
```javascript
// POST https://discordant.kendev.co/api/external/visitor-activity
await fetch(`${DISCORDANT_API_URL}/api/external/visitor-activity`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DISCORDANT_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sessionId: generateSessionId(),
    page: window.location.pathname,
    event: 'page_view',
    metadata: {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    }
  })
});
```

## 🤖 n8n Workflow Integration

### Webhook Setup
Configure n8n workflows to receive data from Discordant:

**Webhook URL:** `https://discordant.kendev.co/api/external/webhook/n8n`

**Payload Structure:**
```json
{
  "workflowId": "folio_client_inquiry",
  "trigger": "new_message",
  "data": {
    "messageId": "msg_123",
    "content": "Client inquiry content",
    "channelId": "8dd52...",
    "agentId": "folio-assistant",
    "metadata": {
      "source": "folio.kendev.co",
      "clientData": {...}
    }
  }
}
```

### Example n8n Workflow Response
```json
{
  "response": {
    "type": "ai_response",
    "content": "Thank you for your inquiry. Let me help you with that...",
    "actions": ["schedule_call", "send_brochure"],
    "metadata": {
      "confidence": 0.95,
      "next_steps": ["follow_up_in_24h"]
    }
  }
}
```

## 💬 Embedded Chat Widget

### Implementation
Add to your Folio pages where you want the chat widget:

```html
<!-- Chat Widget Integration -->
<div id="discordant-chat-widget"></div>

<script>
window.DiscordantConfig = {
  apiUrl: 'https://discordant.kendev.co',
  channelId: '8dd52...', // folio-site-assistant channel
  agentId: 'folio-assistant',
  sessionId: generateUniqueSessionId(),
  theme: {
    primaryColor: '#5865F2',
    position: 'bottom-right',
    minimized: true
  },
  metadata: {
    source: 'folio.kendev.co',
    page: window.location.pathname,
    clientIp: '${CLIENT_IP}' // Server-side replacement
  }
};

// Load widget
(function() {
  const script = document.createElement('script');
  script.src = 'https://discordant.kendev.co/embed/chat/widget.js';
  script.async = true;
  document.head.appendChild(script);
})();
</script>
```

### Widget Features
- **Real-time messaging** with Discordant team
- **AI-powered responses** from configured agents
- **Session persistence** across page navigation
- **Mobile responsive** design
- **Customizable themes** and positioning

## 🎤 Voice Integration (VAPI)

### Setup Voice Calls
For voice-enabled client support:

```javascript
// Initialize VAPI integration
const vapiConfig = {
  apiUrl: 'https://discordant.kendev.co/api/voice-ai/vapi',
  assistantId: 'folio-assistant',
  sessionId: getCurrentSessionId(),
  webhook: {
    url: 'https://discordant.kendev.co/api/external/webhook/vapi',
    events: ['call:started', 'call:ended', 'transcript:updated']
  }
};

// Trigger voice call
async function initiateVoiceCall(clientData) {
  const response = await fetch(`${vapiConfig.apiUrl}/call`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${DISCORDANT_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      assistantId: vapiConfig.assistantId,
      customer: {
        number: clientData.phone,
        name: clientData.name
      },
      metadata: {
        source: 'folio.kendev.co',
        inquiryType: clientData.inquiryType
      }
    })
  });
  
  return response.json();
}
```

## 🔄 Integration Workflows

### 1. Contact Form Submission
```javascript
// When client submits contact form on Folio
async function handleContactForm(formData) {
  // Send to Discordant
  await sendToDiscordant({
    type: 'contact_form',
    content: `New contact form submission from ${formData.name}`,
    data: formData,
    urgency: determineUrgency(formData),
    actions: ['assign_agent', 'send_welcome_email']
  });
  
  // Trigger n8n workflow for automated processing
  await triggerN8nWorkflow('folio_contact_form', formData);
}
```

### 2. Live Chat Escalation
```javascript
// When chat needs human intervention
async function escalateToHuman(chatSession) {
  await sendToDiscordant({
    type: 'chat_escalation',
    content: `Chat escalation needed for session ${chatSession.id}`,
    data: {
      sessionId: chatSession.id,
      transcript: chatSession.messages,
      clientInfo: chatSession.client
    },
    urgency: 'high',
    actions: ['notify_available_agents', 'create_ticket']
  });
}
```

### 3. Appointment Scheduling
```javascript
// When client schedules appointment
async function handleAppointmentScheduled(appointment) {
  await sendToDiscordant({
    type: 'appointment_scheduled',
    content: `New appointment scheduled: ${appointment.service}`,
    data: appointment,
    actions: ['calendar_invite', 'preparation_checklist', 'reminder_sequence']
  });
}
```

## 📊 Monitoring & Analytics

### Health Check Endpoint
```javascript
// Monitor integration health
const healthCheck = await fetch(`${DISCORDANT_API_URL}/api/external/health`, {
  headers: { 'Authorization': `Bearer ${DISCORDANT_API_TOKEN}` }
});
```

### Analytics Tracking
```javascript
// Track integration metrics
await fetch(`${DISCORDANT_API_URL}/api/external/analytics`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${DISCORDANT_API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: 'folio_integration_metric',
    metrics: {
      messages_sent: messageCount,
      response_time: averageResponseTime,
      conversion_rate: conversionRate
    }
  })
});
```

## 🛠 Implementation Checklist

### Phase 1: Basic Integration
- [ ] Generate and configure API tokens
- [ ] Set up environment variables
- [ ] Test basic message sending
- [ ] Configure webhook endpoints
- [ ] Implement contact form integration

### Phase 2: Enhanced Features
- [ ] Deploy chat widget on key pages
- [ ] Configure n8n workflows for automation
- [ ] Set up visitor activity tracking
- [ ] Implement voice call integration
- [ ] Add analytics and monitoring

### Phase 3: Advanced Workflows
- [ ] AI-powered response automation
- [ ] Multi-channel communication flows
- [ ] Advanced client segmentation
- [ ] Predictive engagement triggers
- [ ] Performance optimization

## 🔧 Troubleshooting

### Common Issues

**Authentication Errors:**
```bash
# Check token validity
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://discordant.kendev.co/api/external/health
```

**Message Delivery Issues:**
- Verify channel ID is correct
- Check agent permissions
- Ensure server is accessible

**Webhook Problems:**
- Validate webhook URL is reachable
- Check n8n workflow configuration
- Verify payload structure

### Support Channels
- **Technical Issues**: `#system` channel in Discordant
- **Integration Questions**: `#folio-site-assistant` channel
- **Emergency Support**: Direct message System User

## 📱 Mobile Considerations

### Responsive Chat Widget
```css
/* Mobile optimizations */
@media (max-width: 768px) {
  .discordant-chat-widget {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
  }
}
```

### Progressive Web App Integration
```javascript
// Service worker for offline capabilities
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/discordant-sw.js');
}
```

## 🚀 Next Steps

1. **Complete Phase 1 Implementation**
2. **Test Integration Thoroughly**
3. **Deploy to Production**
4. **Monitor Performance**
5. **Iterate and Optimize**

---

**Need Help?** Join the `#folio-site-assistant` channel in Discordant for real-time support and collaboration! 