# 🚀 Discordant External Integration - Quick Deploy Guide

This guide will get your external integration system live and processing customer inquiries in **under 30 minutes**.

## ⚡ Prerequisites (5 minutes)

1. **Discordant instance running** (Next.js + Prisma + MySQL)
2. **Database access** for schema updates
3. **n8n instance** (optional, for AI responses)
4. **Portfolio website** ready for widget integration

## 🛠️ Step 1: Database Migration (5 minutes)

```bash
# 1. Update your Prisma schema (already done if using our files)
npx prisma db push

# 2. Run the migration script
npx tsx scripts/migrate-external-integrations.ts

# 3. Verify tables created
npx prisma studio
# Check for: api_token, agent_profile, external_message, visitor_session
```

## 🔑 Step 2: Get Your API Credentials (2 minutes)

After migration, you'll see output like:
```
🧪 Test Token (for development):
Name: YourServer - Default Integration Token
Token: disc_ABC123...
Server: YourServer
```

**Save this token** - you'll need it for integration!

## 💬 Step 3: Test the API (3 minutes)

```bash
# Test message posting
curl -X POST "https://your-discordant.com/api/external/messages" \
  -H "Authorization: Bearer disc_ABC123..." \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "your-channel-id",
    "content": "Hello from external integration!",
    "sourceType": "test-deployment"
  }'
```

Expected response:
```json
{
  "success": true,
  "messageId": "msg_123...",
  "externalMessageId": "ext_456..."
}
```

## 🌐 Step 4: Deploy Chat Widget (10 minutes)

### Option A: Simple HTML Integration

Add to your portfolio's `<head>`:

```html
<!-- Discordant Chat Widget -->
<script 
  src="https://your-discordant.com/discordant-widget.js"
  data-discordant-url="https://your-discordant.com"
  data-channel-id="your-channel-id"
  data-api-token="disc_ABC123..."
  data-theme="light"
  data-position="bottom-right"
  data-auto-open="false">
</script>
```

### Option B: Programmatic Integration

```html
<script src="https://your-discordant.com/discordant-widget.js"></script>
<script>
  DiscordantWidget.init({
    discordantUrl: 'https://your-discordant.com',
    channelId: 'your-channel-id',
    apiToken: 'disc_ABC123...',
    theme: 'light',
    position: 'bottom-right',
    autoOpen: false,
    visitorData: {
      name: 'Portfolio Visitor',
      email: '', // Can be set dynamically
      page: window.location.href
    }
  });
</script>
```

### Option C: Contact Form Integration

```javascript
// When contact form is submitted
document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const message = `New contact form submission:
  
Name: ${formData.get('name')}
Email: ${formData.get('email')}
Message: ${formData.get('message')}`;

  // Send to Discordant
  const response = await fetch('https://your-discordant.com/api/external/messages', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer disc_ABC123...',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      channelId: 'your-channel-id',
      content: message,
      sourceType: 'contact-form',
      visitorData: {
        sessionId: DiscordantWidget.getSessionId(),
        name: formData.get('name'),
        email: formData.get('email'),
        metadata: {
          form: 'contact',
          page: window.location.href
        }
      }
    })
  });

  if (response.ok) {
    alert('Message sent! We\'ll get back to you soon.');
  }
});
```

## 🤖 Step 5: AI Workflow Setup (5 minutes)

### Import n8n Workflow

1. Open your n8n instance
2. Import the workflow file: `docs/workflows/enhanced-business-proposal.json`
3. Update the webhook URL to: `https://your-discordant.com/api/external/webhook/n8n`
4. Configure your AI credentials (OpenAI, etc.)
5. Activate the workflow

### Test AI Response

```bash
# Send a test message that will trigger AI
curl -X POST "https://your-discordant.com/api/external/messages" \
  -H "Authorization: Bearer disc_ABC123..." \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "your-channel-id",
    "content": "I need help with web development services",
    "sourceType": "test-ai"
  }'
```

You should see:
1. Message appears in Discordant channel
2. n8n workflow triggers
3. AI response appears automatically
4. Real-time updates via socket

## 📊 Step 6: Admin Dashboard

Access the admin interface at:
```
https://your-discordant.com/admin/integrations
```

Here you can:
- Monitor active visitors
- Manage API tokens
- View integration analytics
- Configure agent settings

## ✅ Verification Checklist

- [ ] Database tables created successfully
- [ ] API token works for message posting
- [ ] Chat widget loads on portfolio site
- [ ] Messages appear in Discordant channels
- [ ] Real-time updates working
- [ ] n8n workflow triggering (if configured)
- [ ] Admin dashboard accessible

## 🔧 Common Issues & Solutions

### "Unauthorized" API Response
- Check your API token is correct
- Verify token has access to the target channel
- Ensure `Authorization: Bearer` header format

### Widget Not Loading
- Check CORS settings on your Discordant instance
- Verify iframe embedding is allowed
- Check browser console for errors

### Messages Not Appearing
- Verify channel ID is correct
- Check if user has permission to access channel
- Look for socket connection issues

### AI Not Responding
- Check n8n workflow is active
- Verify webhook URL is correct
- Test n8n workflow manually

## 🎯 What's Next?

Now that your integration is live, you can:

1. **Customize the widget** styling and behavior
2. **Add VAPI integration** for voice calls
3. **Enhance AI workflows** with more tools
4. **Monitor analytics** and optimize response times
5. **Scale to multiple sites** with different tokens

## 📞 Support

If you run into issues:
1. Check the logs in your Discordant console
2. Review the full integration guide: `docs/external-integration-guide.md`
3. Test individual API endpoints manually
4. Verify socket connections in browser dev tools

---

**🎉 Congratulations!** Your Discordant external integration is now live and ready to turn website visitors into engaged customers with AI-powered responses!

**Key Benefits Now Active:**
- ✅ Real-time customer inquiries
- ✅ Automated AI responses
- ✅ Centralized communication hub
- ✅ Visitor tracking and analytics
- ✅ Seamless team collaboration 