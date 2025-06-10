/**
 * Folio → Discordant Integration Template
 * 
 * Copy this code to your Folio application and customize the configuration
 * to enable seamless communication with your Discordant #folio-site-assistant channel
 */

class FolioDiscordantIntegration {
  constructor(config) {
    this.config = {
      apiUrl: 'https://discordant.kendev.co',
      apiToken: process.env.DISCORDANT_API_TOKEN,
      serverId: 'a90f1d41-12a9-4586-b9a4-a513d3bd01d9',
      channelId: '8dd52...', // Replace with actual folio-site-assistant channel ID
      agentId: 'folio-assistant',
      ...config
    };
    
    this.sessionId = this.generateSessionId();
  }

  generateSessionId() {
    return `folio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async sendMessage(content, metadata = {}) {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/external/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          channelId: this.config.channelId,
          content,
          agentId: this.config.agentId,
          metadata: {
            source: 'folio.kendev.co',
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            ...metadata
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send message to Discordant:', error);
      throw error;
    }
  }

  async trackVisitorActivity(event, data = {}) {
    try {
      await fetch(`${this.config.apiUrl}/api/external/visitor-activity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          event,
          page: window.location.pathname,
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            ...data
          }
        })
      });
    } catch (error) {
      console.error('Failed to track visitor activity:', error);
    }
  }

  async handleContactForm(formData) {
    const message = `
🌟 **New Contact Form Submission**

**Name:** ${formData.name}
**Email:** ${formData.email}
**Phone:** ${formData.phone || 'Not provided'}
**Service Interest:** ${formData.service || 'General Inquiry'}

**Message:**
${formData.message}

**Source:** Folio Contact Form
**Priority:** ${this.determinePriority(formData)}
**Session:** \`${this.sessionId}\`
    `.trim();

    return await this.sendMessage(message, {
      type: 'contact_form',
      clientData: formData,
      urgency: this.determinePriority(formData),
      actions: ['assign_agent', 'send_welcome_email', 'schedule_follow_up']
    });
  }

  async handleServiceInquiry(inquiryData) {
    const message = `
💼 **Service Inquiry**

**Service:** ${inquiryData.service}
**Client:** ${inquiryData.name} (${inquiryData.email})
**Budget:** ${inquiryData.budget || 'Not specified'}
**Timeline:** ${inquiryData.timeline || 'Not specified'}

**Details:**
${inquiryData.details}

**Next Actions:** Schedule consultation call
    `.trim();

    return await this.sendMessage(message, {
      type: 'service_inquiry',
      service: inquiryData.service,
      clientData: inquiryData,
      urgency: 'high',
      actions: ['schedule_consultation', 'send_portfolio', 'prepare_proposal']
    });
  }

  async handleChatEscalation(chatData) {
    const message = `
🆘 **Chat Escalation Required**

**Session:** \`${chatData.sessionId}\`
**Duration:** ${chatData.duration} minutes
**Reason:** ${chatData.escalationReason}

**Recent Messages:**
${chatData.recentMessages.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

**Client Info:**
- Email: ${chatData.client.email || 'Unknown'}
- Page: ${chatData.client.currentPage}
- Intent: ${chatData.client.inferredIntent}

**Urgent:** Human agent needed immediately
    `.trim();

    return await this.sendMessage(message, {
      type: 'chat_escalation',
      sessionData: chatData,
      urgency: 'critical',
      actions: ['notify_available_agents', 'create_priority_ticket']
    });
  }

  async handleAppointmentScheduled(appointmentData) {
    const message = `
📅 **New Appointment Scheduled**

**Service:** ${appointmentData.service}
**Client:** ${appointmentData.clientName}
**Date:** ${appointmentData.date}
**Time:** ${appointmentData.time}
**Duration:** ${appointmentData.duration}
**Meeting Type:** ${appointmentData.type} (${appointmentData.location || 'Virtual'})

**Notes:** ${appointmentData.notes || 'None'}

**Preparation needed:** Review client requirements
    `.trim();

    return await this.sendMessage(message, {
      type: 'appointment_scheduled',
      appointmentData,
      urgency: 'normal',
      actions: ['calendar_invite', 'send_preparation_guide', 'set_reminders']
    });
  }

  determinePriority(data) {
    // Business logic to determine urgency
    if (data.budget && parseInt(data.budget.replace(/\D/g, '')) > 10000) return 'high';
    if (data.timeline && data.timeline.includes('urgent')) return 'high';
    if (data.service && data.service.includes('enterprise')) return 'high';
    return 'normal';
  }

  initializeChatWidget() {
    // Initialize embedded chat widget
    window.DiscordantConfig = {
      apiUrl: this.config.apiUrl,
      channelId: this.config.channelId,
      agentId: this.config.agentId,
      sessionId: this.sessionId,
      theme: {
        primaryColor: '#5865F2',
        secondaryColor: '#4f46e5',
        position: 'bottom-right',
        minimized: true,
        showTypingIndicator: true,
        showOnlineStatus: true
      },
      metadata: {
        source: 'folio.kendev.co',
        page: window.location.pathname,
        userAgent: navigator.userAgent
      }
    };

    // Load widget script
    const script = document.createElement('script');
    script.src = `${this.config.apiUrl}/embed/chat/widget.js`;
    script.async = true;
    document.head.appendChild(script);

    // Track widget load
    this.trackVisitorActivity('chat_widget_loaded');
  }

  setupPageTracking() {
    // Track page views
    this.trackVisitorActivity('page_view');

    // Track form interactions
    document.addEventListener('submit', (e) => {
      if (e.target.matches('form[data-track="contact"]')) {
        this.trackVisitorActivity('contact_form_submit');
      }
    });

    // Track service interest
    document.addEventListener('click', (e) => {
      if (e.target.matches('[data-service]')) {
        this.trackVisitorActivity('service_interest', {
          service: e.target.getAttribute('data-service')
        });
      }
    });
  }

  async checkIntegrationHealth() {
    try {
      const response = await fetch(`${this.config.apiUrl}/api/external/health`, {
        headers: { 'Authorization': `Bearer ${this.config.apiToken}` }
      });
      return response.ok;
    } catch (error) {
      console.error('Discordant integration health check failed:', error);
      return false;
    }
  }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FolioDiscordantIntegration;
} else if (typeof window !== 'undefined') {
  window.FolioDiscordantIntegration = FolioDiscordantIntegration;
}

// Usage Examples:

/* 
// 1. Initialize integration
const discordant = new FolioDiscordantIntegration({
  apiToken: 'your_token_here',
  channelId: 'actual_channel_id'
});

// 2. Handle contact form
document.getElementById('contact-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  try {
    await discordant.handleContactForm({
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      service: formData.get('service'),
      message: formData.get('message')
    });
    
    showSuccessMessage('Thank you! We\'ll be in touch soon.');
  } catch (error) {
    showErrorMessage('Something went wrong. Please try again.');
  }
});

// 3. Initialize chat widget and tracking
document.addEventListener('DOMContentLoaded', () => {
  discordant.initializeChatWidget();
  discordant.setupPageTracking();
});

// 4. Service-specific tracking
document.querySelectorAll('[data-service]').forEach(button => {
  button.addEventListener('click', () => {
    discordant.trackVisitorActivity('service_clicked', {
      service: button.getAttribute('data-service')
    });
  });
});

// 5. Check integration health
discordant.checkIntegrationHealth().then(isHealthy => {
  if (!isHealthy) {
    console.warn('Discordant integration may be experiencing issues');
  }
});
*/ 