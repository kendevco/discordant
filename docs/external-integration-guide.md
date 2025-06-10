# Discordant External Integration Guide

This guide covers how to integrate external applications (portfolio sites, VAPI, n8n workflows) with Discordant as a central communication hub.

## Overview

Discordant provides a robust external integration system that allows:

1. **External Message Posting** - Send messages from external sources into Discordant channels
2. **Agent/Bot Management** - Create and manage automated users for different services
3. **API Token Authentication** - Secure access control with rate limiting
4. **n8n Workflow Integration** - Bidirectional communication with workflow automation
5. **Real-time Events** - Socket-based notifications for external apps
6. **Embeddable Widgets** - Chat widgets for portfolio sites

## Quick Start

### 1. Create an API Token

First, create an API token through the Discordant admin interface or API:

```typescript
// POST /api/external/tokens
{
  "name": "Portfolio Integration",
  "type": "SERVICE_ACCOUNT",
  "serverId": "your-server-id",
  "channelIds": ["portfolio-inquiries-channel-id"],
  "permissions": {
    "canSendMessages": true,
    "canCreateAgents": true
  },
  "sourceOrigin": "https://yourportfolio.com",
  "rateLimit": 100,
  "rateLimitWindow": 3600
}

// Response includes your API token:
{
  "success": true,
  "token": {
    "token": "disc_abc123...xyz789" // Save this securely!
  }
}
```

### 2. Send Your First External Message

```typescript
// POST /api/external/messages
// Authorization: Bearer disc_abc123...xyz789

{
  "channelId": "portfolio-inquiries-channel-id",
  "content": "New contact form submission from John Doe",
  "sourceType": "contact-form",
  "visitorData": {
    "sessionId": "session_123",
    "email": "john@example.com",
    "name": "John Doe",
    "metadata": {
      "page": "/contact",
      "userAgent": "Mozilla/5.0...",
      "origin": "https://yourportfolio.com"
    }
  }
}
```

### 3. Create an Agent Bot

```typescript
// POST /api/external/agents
// Authorization: Bearer disc_abc123...xyz789

{
  "agentType": "AI_ASSISTANT",
  "displayName": "Portfolio AI Assistant",
  "email": "ai-assistant@yourportfolio.com",
  "description": "Handles portfolio inquiries and provides AI responses",
  "canImpersonate": false,
  "systemBot": false
}
```

## Complete Integration Examples

### Portfolio Site Integration

```typescript
// portfolio-backend/lib/discordant-client.ts
export class DiscordantClient {
  private apiToken: string;
  private baseUrl: string;

  constructor(apiToken: string, baseUrl = 'https://your-discordant.com') {
    this.apiToken = apiToken;
    this.baseUrl = baseUrl;
  }

  async sendContactFormMessage(formData: {
    name: string;
    email: string;
    message: string;
    page: string;
    sessionId: string;
  }) {
    const response = await fetch(`${this.baseUrl}/api/external/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channelId: process.env.DISCORDANT_PORTFOLIO_CHANNEL_ID,
        content: `**New Contact Form Submission**

**From:** ${formData.name} (${formData.email})
**Page:** ${formData.page}
**Message:**
${formData.message}`,
        sourceType: 'contact-form',
        visitorData: {
          sessionId: formData.sessionId,
          email: formData.email,
          name: formData.name,
          metadata: {
            page: formData.page,
            origin: process.env.NEXT_PUBLIC_SITE_URL
          }
        }
      })
    });

    return response.json();
  }

  async sendVAPITranscript(callData: {
    sessionId: string;
    transcript: string;
    duration: number;
    callerId?: string;
  }) {
    return fetch(`${this.baseUrl}/api/external/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channelId: process.env.DISCORDANT_VAPI_CHANNEL_ID,
        content: `**VAPI Call Transcript**

**Session:** ${callData.sessionId}
**Duration:** ${callData.duration}s
**Caller:** ${callData.callerId || 'Anonymous'}

**Transcript:**
${callData.transcript}`,
        sourceType: 'vapi-call',
        sourceId: callData.sessionId,
        visitorData: {
          sessionId: callData.sessionId,
          metadata: {
            duration: callData.duration,
            callType: 'vapi'
          }
        }
      })
    }).then(r => r.json());
  }
}

// Usage in your API routes
const discordant = new DiscordantClient(process.env.DISCORDANT_API_TOKEN);

// Contact form handler
export async function POST(req: Request) {
  const formData = await req.json();
  
  // Send to Discordant
  await discordant.sendContactFormMessage({
    ...formData,
    sessionId: generateSessionId()
  });
  
  return NextResponse.json({ success: true });
}
```

### n8n Workflow Integration

#### Portfolio → Discordant → n8n → Response Flow

1. **Message arrives** from portfolio contact form
2. **Discordant** receives via external API
3. **n8n webhook** is triggered with message data
4. **AI processing** happens in n8n workflow
5. **Response** is sent back to Discordant channel

```javascript
// n8n Workflow Node: HTTP Trigger
// Webhook URL: https://your-n8n.com/webhook/discordant-portfolio

// n8n Workflow Node: Function - Process Input
const messageData = $input.all()[0].json;

return {
  message: messageData.content,
  userId: messageData.visitorData?.email || 'anonymous',
  channelId: messageData.channelId,
  userName: messageData.visitorData?.name || 'Anonymous Visitor',
  serverId: messageData.serverId,
  externalMessageId: messageData.externalMessageId, // Key for response routing
  sessionData: messageData.visitorData
};

// n8n Workflow Node: OpenAI - Generate Response
// Uses the processed message data for AI response

// n8n Workflow Node: HTTP Request - Send Response to Discordant
// POST https://your-discordant.com/api/external/webhook/n8n
// Authorization: Bearer {your-token}
{
  "externalMessageId": "{{$node['Process Input'].json.externalMessageId}}",
  "agentResponse": {
    "content": "{{$node['OpenAI'].json.choices[0].message.content}}",
    "type": "markdown"
  },
  "workflowId": "portfolio-ai-assistant",
  "workflowName": "Portfolio AI Assistant v3.0",
  "processingTime": "{{$workflow.startTime - $workflow.endTime}}"
}
```

### Real-time Event Listening

```typescript
// portfolio-frontend/lib/discordant-events.ts
import { io, Socket } from 'socket.io-client';

export class DiscordantEventListener {
  private socket: Socket;
  private channelId: string;

  constructor(channelId: string) {
    this.channelId = channelId;
    this.socket = io(process.env.NEXT_PUBLIC_DISCORDANT_URL, {
      transports: ['websocket']
    });
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for new messages in portfolio channel
    this.socket.on(`chat:${this.channelId}:messages`, (message) => {
      if (message.role === 'system') {
        // This is likely an AI response
        this.handleAIResponse(message);
      }
    });

    // Listen for agent status updates
    this.socket.on('agent-status-update', (data) => {
      this.handleAgentStatusUpdate(data);
    });
  }

  private handleAIResponse(message: any) {
    // Show notification to portfolio visitor
    if (typeof window !== 'undefined') {
      const notification = new Notification('AI Assistant Response', {
        body: message.content.slice(0, 100) + '...',
        icon: '/ai-assistant-icon.png'
      });
    }
  }

  disconnect() {
    this.socket.disconnect();
  }
}
```

### Embeddable Chat Widget

```html
<!-- portfolio-site/contact.html -->
<div id="discordant-chat-widget"></div>

<script>
(function() {
  const config = {
    channelId: 'portfolio-chat-channel-id',
    theme: 'light',
    visitorData: {
      sessionId: generateSessionId(),
      page: window.location.pathname
    }
  };

  const iframe = document.createElement('iframe');
  iframe.src = `https://your-discordant.com/embed/chat?${new URLSearchParams(config)}`;
  iframe.style.width = '100%';
  iframe.style.height = '500px';
  iframe.style.border = 'none';
  iframe.style.borderRadius = '8px';
  
  document.getElementById('discordant-chat-widget').appendChild(iframe);
})();
</script>
```

## API Reference

### Authentication

All external API requests require authentication via API token:

```http
Authorization: Bearer disc_your_token_here
```

Or via header:
```http
X-API-Key: disc_your_token_here
```

### Rate Limiting

- Default: 100 requests per hour
- Configurable per token
- Returns `429` when exceeded
- Headers include rate limit info

### Endpoints

#### POST /api/external/messages
Send a message from external source to Discordant channel.

**Request:**
```typescript
{
  channelId?: string;           // Target channel ID
  conversationId?: string;      // Target conversation ID (for DMs)
  content: string;              // Message content
  sourceType: string;           // Source identifier (contact-form, vapi-call, etc)
  sourceId?: string;            // External source ID
  visitorData?: {
    sessionId?: string;
    email?: string;
    name?: string;
    metadata?: Record<string, any>;
  };
  agentData?: {
    displayName?: string;
    avatarUrl?: string;
    description?: string;
  };
  impersonateUser?: string;     // Profile ID to send as (requires permission)
}
```

**Response:**
```typescript
{
  success: boolean;
  externalMessageId: string;
  messageId?: string;
  directMessageId?: string;
  channelId?: string;
  conversationId?: string;
}
```

#### POST /api/external/agents
Create and manage agent users.

**Request:**
```typescript
{
  agentType: "AI_ASSISTANT" | "VAPI_TRANSCRIBER" | "SYSTEM_NOTIFIER" | "PORTFOLIO_VISITOR" | "WORKFLOW_RESPONDER" | "EXTERNAL_SERVICE";
  displayName: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  canImpersonate?: boolean;
  canCreateUsers?: boolean;
  systemBot?: boolean;
  sourceConfig?: Record<string, any>;
  responseConfig?: Record<string, any>;
}
```

#### POST /api/external/tokens
Create and manage API tokens.

**Request:**
```typescript
{
  name: string;
  type: "SERVICE_ACCOUNT" | "WEBHOOK_INTEGRATION" | "WIDGET_EMBED" | "AGENT_BOT";
  serverId?: string;
  channelIds?: string[];
  permissions?: Record<string, any>;
  sourceOrigin?: string;
  webhookUrl?: string;
  metadata?: Record<string, any>;
  expiresAt?: string;
  rateLimit?: number;
  rateLimitWindow?: number;
}
```

#### POST /api/external/webhook/n8n
Receive responses from n8n workflows.

**Request:**
```typescript
{
  externalMessageId?: string;   // ID of original external message
  responseType?: "channel" | "conversation" | "webhook";
  agentResponse?: {
    content: string;
    type: "text" | "markdown" | "html";
    metadata?: Record<string, any>;
  };
  workflowId?: string;
  workflowName?: string;
  executionId?: string;
  processingTime?: number;
  callbackUrl?: string;
}
```

## Security Best Practices

1. **Secure Token Storage**: Store API tokens in environment variables, never in code
2. **Origin Validation**: Set `sourceOrigin` to restrict token usage to specific domains
3. **Channel Restrictions**: Use `channelIds` to limit access to specific channels
4. **Rate Limiting**: Configure appropriate rate limits for your use case
5. **Token Rotation**: Regularly rotate API tokens
6. **Audit Logging**: Monitor token usage via the admin interface

## Common Integration Patterns

### 1. Contact Form → AI Response
Portfolio visitor fills contact form → Message to Discordant → n8n workflow with AI → Response back to channel → Real-time notification to visitor

### 2. VAPI Call → Transcript Processing
Voice call via VAPI → Transcript sent to Discordant → AI analysis workflow → Insights shared in team channel

### 3. Anonymous Chat Widget
Portfolio visitor starts chat → Creates visitor session → Messages flow to Discordant team → Team responds → Visitor sees responses in widget

### 4. Multi-Channel Notification
External event → Multiple Discordant channels notified → Different workflows triggered based on channel → Team coordination

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check API token format and validity
2. **403 Forbidden**: Verify token permissions for target channel/server
3. **429 Rate Limited**: Reduce request frequency or increase rate limit
4. **404 Channel Not Found**: Verify channel ID and access permissions
5. **500 Internal Error**: Check request format and server logs

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=discordant:external:*
```

### Test Endpoints

Use the GET endpoints to verify integration status:
- `GET /api/external/messages` - Check authentication and permissions
- `GET /api/external/webhook/n8n` - Verify webhook capabilities

This integration system provides a powerful foundation for connecting Discordant with external applications while maintaining security, scalability, and real-time communication capabilities. 