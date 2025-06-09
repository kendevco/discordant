import nodemailer from 'nodemailer';

interface VAPIEmailData {
  callId: string;
  customerInfo: {
    name?: string;
    email?: string;
    phone: string;
    company?: string;
  };
  callSummary: {
    duration: string;
    transcript: string;
    leadQuality: string;
    interestedServices: string[];
    urgency: string;
    sentimentScore: number;
    nextActions: string[];
  };
  scheduledMeeting?: {
    eventId: string;
    meetingTime: string;
    meetLink: string;
  };
}

export class VAPIEmailService {
  private transporter;

  constructor() {
    // Initialize email transporter
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'kenneth.courtney@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD
      }
    });
  }

  async sendInteractionReport(emailData: VAPIEmailData): Promise<boolean> {
    try {
      const htmlContent = this.generateInteractionReportHTML(emailData);
      const textContent = this.generateInteractionReportText(emailData);

      const mailOptions = {
        from: process.env.GMAIL_USER || 'kenneth.courtney@gmail.com',
        to: 'kenneth.courtney@gmail.com',
        subject: `🤖 VAPI Sales Lead: ${emailData.callSummary.leadQuality} - ${emailData.customerInfo.name || 'Anonymous Caller'}`,
        html: htmlContent,
        text: textContent,
        attachments: [
          {
            filename: `vapi-call-${emailData.callId}.txt`,
            content: emailData.callSummary.transcript,
            contentType: 'text/plain'
          }
        ]
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`[VAPI_EMAIL] ✅ Interaction report sent for call ${emailData.callId}`);
      
      return true;
    } catch (error) {
      console.error('[VAPI_EMAIL] ❌ Failed to send interaction report:', error);
      return false;
    }
  }

  private generateInteractionReportHTML(data: VAPIEmailData): string {
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'long'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; }
            .lead-hot { background-color: #fff3cd; border-left: 5px solid #ff6b6b; }
            .lead-warm { background-color: #d1ecf1; border-left: 5px solid #17a2b8; }
            .lead-cold { background-color: #f8f9fa; border-left: 5px solid #6c757d; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat { text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px; }
            .stat-value { font-size: 24px; font-weight: bold; color: #495057; }
            .stat-label { font-size: 12px; color: #6c757d; text-transform: uppercase; }
            .contact-info { background: #e8f5e8; padding: 15px; border-radius: 5px; }
            .actions { background: #fff3e0; padding: 15px; border-radius: 5px; }
            .urgency-high { color: #dc3545; font-weight: bold; }
            .urgency-medium { color: #fd7e14; font-weight: bold; }
            .urgency-low { color: #28a745; }
            .transcript { background: #f8f9fa; padding: 15px; border-radius: 5px; font-family: monospace; max-height: 300px; overflow-y: auto; }
            .meeting-scheduled { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; }
            .cta-button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .sentiment-excellent { color: #28a745; }
            .sentiment-good { color: #20c997; }
            .sentiment-neutral { color: #6c757d; }
            .sentiment-poor { color: #dc3545; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🤖 VAPI Sales Interaction Report</h1>
                <p>AI-Generated Lead Analysis & Follow-up Recommendations</p>
                <small>${timestamp}</small>
            </div>

            <div class="section ${this.getLeadQualityClass(data.callSummary.leadQuality)}">
                <h2>📊 Lead Assessment</h2>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-value">${data.callSummary.leadQuality}</div>
                        <div class="stat-label">Lead Quality</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value ${this.getSentimentClass(data.callSummary.sentimentScore)}">${data.callSummary.sentimentScore}/10</div>
                        <div class="stat-label">Interest Level</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value ${this.getUrgencyClass(data.callSummary.urgency)}">${data.callSummary.urgency}</div>
                        <div class="stat-label">Urgency</div>
                    </div>
                    <div class="stat">
                        <div class="stat-value">${data.callSummary.duration}</div>
                        <div class="stat-label">Call Duration</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>📞 Customer Information</h2>
                <div class="contact-info">
                    <p><strong>Name:</strong> ${data.customerInfo.name || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${data.customerInfo.phone}</p>
                    <p><strong>Email:</strong> ${data.customerInfo.email || 'Not provided'}</p>
                    <p><strong>Company:</strong> ${data.customerInfo.company || 'Not provided'}</p>
                </div>
            </div>

            <div class="section">
                <h2>💼 Services of Interest</h2>
                <ul>
                    ${data.callSummary.interestedServices.map(service => `<li>${service}</li>`).join('')}
                </ul>
            </div>

            ${data.scheduledMeeting ? `
            <div class="section">
                <h2>📅 Meeting Scheduled</h2>
                <div class="meeting-scheduled">
                    <p><strong>Meeting Time:</strong> ${data.scheduledMeeting.meetingTime}</p>
                    <p><strong>Event ID:</strong> ${data.scheduledMeeting.eventId}</p>
                    <a href="${data.scheduledMeeting.meetLink}" class="cta-button">Join Meeting</a>
                </div>
            </div>
            ` : ''}

            <div class="section">
                <h2>📋 Recommended Actions</h2>
                <div class="actions">
                    <ul>
                        ${data.callSummary.nextActions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            </div>

            <div class="section">
                <h2>💬 Call Transcript</h2>
                <div class="transcript">
                    ${data.callSummary.transcript.replace(/\n/g, '<br>')}
                </div>
            </div>

            <div class="section">
                <h2>🎯 Quick Actions</h2>
                <a href="mailto:${data.customerInfo.email}" class="cta-button">Send Email</a>
                <a href="tel:${data.customerInfo.phone}" class="cta-button">Call Customer</a>
                <a href="https://discordant.kendev.co" class="cta-button">View in Discord</a>
            </div>

            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #6c757d;">
                <p><small>This report was automatically generated by your VAPI AI assistant.<br>
                Call ID: ${data.callId} | Generated: ${timestamp}</small></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateInteractionReportText(data: VAPIEmailData): string {
    const timestamp = new Date().toLocaleString();
    
    return `
🤖 VAPI SALES INTERACTION REPORT
Generated: ${timestamp}

📊 LEAD ASSESSMENT
• Lead Quality: ${data.callSummary.leadQuality}
• Interest Level: ${data.callSummary.sentimentScore}/10
• Urgency: ${data.callSummary.urgency}
• Call Duration: ${data.callSummary.duration}

📞 CUSTOMER INFORMATION
• Name: ${data.customerInfo.name || 'Not provided'}
• Phone: ${data.customerInfo.phone}
• Email: ${data.customerInfo.email || 'Not provided'}
• Company: ${data.customerInfo.company || 'Not provided'}

💼 SERVICES OF INTEREST
${data.callSummary.interestedServices.map(service => `• ${service}`).join('\n')}

${data.scheduledMeeting ? `
📅 MEETING SCHEDULED
• Meeting Time: ${data.scheduledMeeting.meetingTime}
• Event ID: ${data.scheduledMeeting.eventId}
• Meet Link: ${data.scheduledMeeting.meetLink}
` : ''}

📋 RECOMMENDED ACTIONS
${data.callSummary.nextActions.map(action => `• ${action}`).join('\n')}

💬 CALL TRANSCRIPT
${data.callSummary.transcript}

---
Call ID: ${data.callId}
This report was automatically generated by your VAPI AI assistant.
    `;
  }

  private getLeadQualityClass(quality: string): string {
    if (quality.includes('HOT')) return 'lead-hot';
    if (quality.includes('WARM')) return 'lead-warm';
    return 'lead-cold';
  }

  private getSentimentClass(score: number): string {
    if (score >= 8) return 'sentiment-excellent';
    if (score >= 6) return 'sentiment-good';
    if (score >= 4) return 'sentiment-neutral';
    return 'sentiment-poor';
  }

  private getUrgencyClass(urgency: string): string {
    return `urgency-${urgency.toLowerCase()}`;
  }

  async sendCustomerFollowupEmail(customerEmail: string, customerName: string, serviceType: string): Promise<boolean> {
    try {
      const htmlContent = this.generateCustomerFollowupHTML(customerName, serviceType);
      
      const mailOptions = {
        from: process.env.GMAIL_USER || 'kenneth.courtney@gmail.com',
        to: customerEmail,
        subject: `Thank you for your interest in ${serviceType} - KenDev.co`,
        html: htmlContent,
        replyTo: 'kenneth.courtney@gmail.com'
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`[VAPI_EMAIL] ✅ Follow-up email sent to ${customerEmail}`);
      
      return true;
    } catch (error) {
      console.error('[VAPI_EMAIL] ❌ Failed to send follow-up email:', error);
      return false;
    }
  }

  private generateCustomerFollowupHTML(customerName: string, serviceType: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
            .cta-button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thank You ${customerName}!</h1>
                <p>Your interest in ${serviceType} means a lot to us</p>
            </div>

            <p>Hi ${customerName},</p>
            
            <p>Thank you for speaking with our AI assistant about ${serviceType}. I'm Kenneth Courtney, and I personally handle all client relationships at KenDev.co.</p>
            
            <p>Based on our conversation, I'll be putting together some relevant case studies and examples that align with your needs. You can expect a personalized follow-up from me within 24 hours.</p>
            
            <p>In the meantime, feel free to:</p>
            <ul>
                <li>Browse our portfolio at <a href="https://kendev.co">KenDev.co</a></li>
                <li>Check out our recent projects and client testimonials</li>
                <li>Reach out directly if you have any immediate questions</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://kendev.co" class="cta-button">View Our Portfolio</a>
                <a href="mailto:kenneth.courtney@gmail.com" class="cta-button">Contact Kenneth</a>
            </div>
            
            <p>Looking forward to discussing how we can help bring your project to life!</p>
            
            <p>Best regards,<br>
            Kenneth Courtney<br>
            Founder & Lead Developer<br>
            KenDev.co</p>
            
            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center; color: #6c757d;">
                <p><small>This email was sent following your conversation with our AI assistant. If you have any concerns, please contact us directly.</small></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
} 