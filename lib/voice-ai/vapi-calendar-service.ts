import { google } from 'googleapis';

interface CalendarEvent {
  summary: string;
  description: string;
  start: {
    dateTime: string;
    timeZone: string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  attendees: Array<{
    email: string;
    displayName?: string;
  }>;
  reminders: {
    useDefault: boolean;
    overrides?: Array<{
      method: string;
      minutes: number;
    }>;
  };
}

interface VAPICallData {
  callId: string;
  customerPhone: string;
  customerEmail?: string;
  customerName?: string;
  requestedDate?: string;
  requestedTime?: string;
  serviceType?: string;
  notes?: string;
}

export class VAPICalendarService {
  private calendar;
  private auth;

  constructor() {
    // Initialize Google Calendar API
    this.auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_id: process.env.GOOGLE_SERVICE_ACCOUNT_CLIENT_ID,
      },
      scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events'
      ],
    });

    this.calendar = google.calendar({ version: 'v3', auth: this.auth });
  }

  async scheduleConsultationFromVAPI(callData: VAPICallData): Promise<{ success: boolean; eventId?: string; meetLink?: string; error?: string }> {
    try {
      // Determine the best available time slot
      const scheduledTime = await this.findOptimalTimeSlot(callData.requestedDate, callData.requestedTime);

      // Create calendar event
      const event: CalendarEvent = {
        summary: `🤖 VAPI Consultation - ${callData.customerName || 'Potential Client'}`,
        description: this.createEventDescription(callData),
        start: {
          dateTime: scheduledTime.start,
          timeZone: 'America/New_York',
        },
        end: {
          dateTime: scheduledTime.end,
          timeZone: 'America/New_York',
        },
        attendees: [
          {
            email: 'kenneth.courtney@gmail.com',
            displayName: 'Kenneth Courtney'
          },
          ...(callData.customerEmail ? [{
            email: callData.customerEmail,
            displayName: callData.customerName || 'Client'
          }] : [])
        ],
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 day before
            { method: 'popup', minutes: 15 }, // 15 minutes before
          ],
        },
      };

      const response = await this.calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        requestBody: {
          ...event,
          conferenceData: {
            createRequest: {
              requestId: `vapi-${callData.callId}-${Date.now()}`,
              conferenceSolutionKey: {
                type: 'hangoutsMeet'
              }
            }
          }
        },
        conferenceDataVersion: 1,
      });

      // Send notification to Discord system channel
      await this.notifyCalendarEvent(callData, response.data);

      return {
        success: true,
        eventId: response.data.id || undefined,
        meetLink: response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || undefined,
      };

    } catch (error) {
      console.error('Calendar scheduling error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  private async findOptimalTimeSlot(requestedDate?: string, requestedTime?: string): Promise<{ start: string; end: string }> {
    const now = new Date();
    let targetDate = new Date();

    // Parse requested date/time or default to next business day
    if (requestedDate) {
      targetDate = new Date(requestedDate);
    } else {
      // Default to next business day at 2 PM
      targetDate.setDate(now.getDate() + 1);
      while (targetDate.getDay() === 0 || targetDate.getDay() === 6) {
        targetDate.setDate(targetDate.getDate() + 1);
      }
    }

    // Set time - default to 2 PM if not specified
    if (requestedTime) {
      const [hours, minutes] = requestedTime.split(':').map(Number);
      targetDate.setHours(hours, minutes, 0, 0);
    } else {
      targetDate.setHours(14, 0, 0, 0); // 2 PM
    }

    // Check for conflicts and adjust if necessary
    const adjustedTime = await this.findAvailableSlot(targetDate);

    const startTime = adjustedTime.toISOString();
    const endTime = new Date(adjustedTime.getTime() + 60 * 60 * 1000).toISOString(); // 1 hour meeting

    return { start: startTime, end: endTime };
  }

  private async findAvailableSlot(preferredTime: Date): Promise<Date> {
    try {
      const timeMin = new Date(preferredTime);
      timeMin.setHours(9, 0, 0, 0); // Start of business day

      const timeMax = new Date(preferredTime);
      timeMax.setHours(17, 0, 0, 0); // End of business day

      const response = await this.calendar.freebusy.query({
        requestBody: {
          timeMin: timeMin.toISOString(),
          timeMax: timeMax.toISOString(),
          items: [
            { id: process.env.GOOGLE_CALENDAR_ID || 'primary' }
          ]
        }
      });

      const busyTimes = response.data.calendars?.[process.env.GOOGLE_CALENDAR_ID || 'primary']?.busy || [];
      
      // Simple conflict checking - if preferred time is busy, move to next hour
      const checkTime = new Date(preferredTime);
      for (const busy of busyTimes) {
        const busyStart = new Date(busy.start!);
        const busyEnd = new Date(busy.end!);
        
        if (checkTime >= busyStart && checkTime < busyEnd) {
          checkTime.setTime(busyEnd.getTime()); // Move to end of busy period
          checkTime.setMinutes(0, 0, 0); // Round to next hour
          if (checkTime.getMinutes() > 0) {
            checkTime.setHours(checkTime.getHours() + 1, 0, 0, 0);
          }
        }
      }

      return checkTime;
    } catch (error) {
      console.error('Error checking calendar availability:', error);
      return preferredTime; // Return original time if check fails
    }
  }

  private createEventDescription(callData: VAPICallData): string {
    return `🤖 Consultation scheduled via VAPI

**Call Details:**
• Call ID: ${callData.callId}
• Customer Phone: ${callData.customerPhone}
• Service Interest: ${callData.serviceType || 'General Development'}

**Customer Information:**
• Name: ${callData.customerName || 'Not provided'}
• Email: ${callData.customerEmail || 'Not provided'}

**Notes from Call:**
${callData.notes || 'No additional notes'}

**Preparation:**
• Review customer's requirements
• Prepare relevant portfolio examples
• Have project estimate template ready

**Meeting Agenda:**
1. Introduction and rapport building
2. Understand project requirements
3. Discuss timeline and budget
4. Present relevant case studies
5. Next steps and proposal timeline

Generated automatically from VAPI voice interaction.`;
  }

  private async notifyCalendarEvent(callData: VAPICallData, eventData: any) {
    try {
      // Send to n8n for additional processing
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(`${webhookUrl}/vapi-calendar-scheduled`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CALENDAR_EVENT_CREATED',
            callId: callData.callId,
            eventId: eventData.id,
            eventLink: eventData.htmlLink,
            meetLink: eventData.hangoutLink,
            customerPhone: callData.customerPhone,
            customerEmail: callData.customerEmail,
            customerName: callData.customerName,
            scheduledTime: eventData.start?.dateTime,
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.error('Error notifying calendar event:', error);
    }
  }

  async getUpcomingConsultations(days: number = 7): Promise<any[]> {
    try {
      const now = new Date();
      const timeMax = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

      const response = await this.calendar.events.list({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        timeMin: now.toISOString(),
        timeMax: timeMax.toISOString(),
        q: 'VAPI Consultation',
        orderBy: 'startTime',
        singleEvents: true,
      });

      return response.data.items || [];
    } catch (error) {
      console.error('Error fetching upcoming consultations:', error);
      return [];
    }
  }

  async cancelConsultation(eventId: string, reason: string = 'Cancelled by system'): Promise<boolean> {
    try {
      await this.calendar.events.delete({
        calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
        eventId: eventId,
      });

      // Notify via n8n
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      if (webhookUrl) {
        await fetch(`${webhookUrl}/vapi-calendar-cancelled`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'CALENDAR_EVENT_CANCELLED',
            eventId,
            reason,
            timestamp: new Date().toISOString()
          })
        });
      }

      return true;
    } catch (error) {
      console.error('Error cancelling consultation:', error);
      return false;
    }
  }
} 