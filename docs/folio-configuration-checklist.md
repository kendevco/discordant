# Folio Integration Configuration Checklist

Use this checklist to ensure proper integration between folio.kendev.co and your Discordant `#folio-site-assistant` channel.

## 📋 Pre-Integration Checklist

### ✅ **Step 1: Gather Required Information**
- [ ] Confirm Discordant server ID: `a90f1d41-12a9-4586-b9a4-a513d3bd01d9`
- [ ] Get exact `#folio-site-assistant` channel ID from the URL or admin
- [ ] Verify you have admin access to create API tokens
- [ ] Confirm HTTPS is working on both domains

### ✅ **Step 2: Create API Token**
1. [ ] Navigate to: `https://discordant.kendev.co/admin/external-integrations`
2. [ ] Click "Create New Token"
3. [ ] Configure token:
   ```json
   {
     "name": "Folio Site Integration",
     "permissions": [
       "SEND_MESSAGES",
       "READ_CHANNELS", 
       "WEBHOOK_ACCESS",
       "VISITOR_TRACKING"
     ],
     "agentId": "folio-assistant",
     "description": "Primary integration token for folio.kendev.co"
   }
   ```
4. [ ] Copy and securely store the generated token
5. [ ] Test token with health check endpoint

### ✅ **Step 3: Environment Configuration**
Add to your Folio `.env` or `.env.local`:
```bash
# Discordant Integration
DISCORDANT_API_URL=https://discordant.kendev.co
DISCORDANT_API_TOKEN=your_generated_token_here
DISCORDANT_SERVER_ID=a90f1d41-12a9-4586-b9a4-a513d3bd01d9
DISCORDANT_CHANNEL_ID=8dd52... # Replace with actual channel ID
DISCORDANT_AGENT_ID=folio-assistant

# Optional: Enhanced Features
DISCORDANT_WEBHOOK_SECRET=optional_webhook_secret
DISCORDANT_ENABLE_VOICE=true
DISCORDANT_ENABLE_ANALYTICS=true
```

## 🚀 Implementation Checklist

### ✅ **Phase 1: Basic Integration (Required)**

#### **1.1 Install Integration Library**
- [ ] Copy `folio-quick-start-template.js` to your project
- [ ] Include in your build process or load via script tag
- [ ] Initialize with your configuration

#### **1.2 Contact Form Integration**
- [ ] Identify all contact forms on Folio
- [ ] Add `data-track="contact"` attribute to forms
- [ ] Implement form submission handler:
```javascript
// Example implementation
const discordant = new FolioDiscordantIntegration({
  apiToken: process.env.DISCORDANT_API_TOKEN,
  channelId: process.env.DISCORDANT_CHANNEL_ID
});

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      await discordant.handleContactForm({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
      });
    });
  }
});
```

#### **1.3 Basic Visitor Tracking**
- [ ] Implement page view tracking
- [ ] Add service interest tracking
- [ ] Set up session management

#### **1.4 Test Basic Integration**
- [ ] Submit test contact form
- [ ] Verify message appears in `#folio-site-assistant` channel
- [ ] Check message formatting and metadata
- [ ] Confirm real-time delivery

### ✅ **Phase 2: Enhanced Features (Recommended)**

#### **2.1 Chat Widget Integration**
- [ ] Identify key pages for chat widget (homepage, services, contact)
- [ ] Add widget initialization code:
```html
<!-- Add to pages where chat is needed -->
<div id="discordant-chat-widget"></div>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    discordant.initializeChatWidget();
  });
</script>
```
- [ ] Test widget functionality
- [ ] Verify mobile responsiveness

#### **2.2 Service-Specific Tracking**
- [ ] Add `data-service` attributes to service buttons/links
- [ ] Implement service inquiry handlers
- [ ] Test service-specific message routing

#### **2.3 Advanced Analytics**
- [ ] Set up visitor journey tracking
- [ ] Implement conversion event tracking
- [ ] Add custom event tracking for key actions

### ✅ **Phase 3: Advanced Workflows (Optional)**

#### **3.1 n8n Workflow Integration**
- [ ] Configure n8n webhooks to receive Discordant data
- [ ] Set up automated response workflows
- [ ] Test workflow triggering and responses

#### **3.2 Voice Integration (VAPI)**
- [ ] Configure VAPI endpoints
- [ ] Add voice call triggers to high-value pages
- [ ] Test voice call functionality

#### **3.3 Appointment Scheduling**
- [ ] Integrate with calendar system
- [ ] Set up appointment notification workflows
- [ ] Test scheduling and notifications

## 🧪 Testing Checklist

### ✅ **Functional Testing**
- [ ] **Contact Form**: Submit test form, verify message in channel
- [ ] **Chat Widget**: Test widget load, send message, verify delivery
- [ ] **Page Tracking**: Navigate site, verify activity tracking
- [ ] **Service Interest**: Click service buttons, verify tracking
- [ ] **Error Handling**: Test with invalid data, verify graceful handling

### ✅ **Integration Testing**
- [ ] **API Health**: Test `/api/external/health` endpoint
- [ ] **Authentication**: Verify token works correctly
- [ ] **Message Delivery**: Test various message types
- [ ] **Metadata**: Verify all metadata is captured correctly
- [ ] **Session Tracking**: Test session persistence

### ✅ **Performance Testing**
- [ ] **Load Times**: Verify integration doesn't slow page load
- [ ] **Error Recovery**: Test behavior when Discordant is unavailable
- [ ] **Rate Limiting**: Test high-frequency requests
- [ ] **Mobile Performance**: Test on mobile devices

## 🔧 Troubleshooting Checklist

### ✅ **Common Issues**

#### **Authentication Problems**
- [ ] Verify API token is correct and not expired
- [ ] Check token permissions include required scopes
- [ ] Test token with curl: 
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     https://discordant.kendev.co/api/external/health
```

#### **Message Delivery Issues**
- [ ] Verify channel ID is correct (get from URL bar)
- [ ] Check server ID matches Front Desk server
- [ ] Ensure agent ID exists and has permissions
- [ ] Test with minimal message first

#### **Widget Problems**
- [ ] Check browser console for JavaScript errors
- [ ] Verify widget script loads correctly
- [ ] Test with different browsers
- [ ] Check CSP headers allow iframe embedding

#### **Tracking Issues**
- [ ] Verify event names match expected values
- [ ] Check network tab for failed requests
- [ ] Test with different page types
- [ ] Verify session ID generation

## 📊 Success Metrics

### ✅ **Key Performance Indicators**
- [ ] **Message Delivery Rate**: >99% of messages reach channel
- [ ] **Response Time**: <500ms for API calls
- [ ] **Widget Load Time**: <2 seconds
- [ ] **Error Rate**: <1% of requests fail
- [ ] **Session Tracking**: >95% of sessions tracked

### ✅ **Business Metrics**
- [ ] **Lead Capture**: Track increase in contact form submissions
- [ ] **Engagement**: Monitor chat widget usage
- [ ] **Conversion**: Measure inquiries to appointments
- [ ] **Response Quality**: Monitor AI response effectiveness

## 🔄 Maintenance Checklist

### ✅ **Regular Monitoring**
- [ ] **Weekly**: Check integration health dashboard
- [ ] **Weekly**: Review error logs for issues
- [ ] **Monthly**: Analyze usage metrics and trends
- [ ] **Monthly**: Update API tokens if needed
- [ ] **Quarterly**: Review and optimize workflows

### ✅ **Updates & Improvements**
- [ ] **Monitor**: Discordant API updates and changes
- [ ] **Update**: Integration library when new features available
- [ ] **Optimize**: Workflows based on usage patterns
- [ ] **Expand**: Integration to new pages/features as needed

## 🆘 Support Resources

### ✅ **Getting Help**
- [ ] **Technical Issues**: Post in `#system` channel
- [ ] **Integration Questions**: Ask in `#folio-site-assistant` channel
- [ ] **Emergency Support**: Direct message System User
- [ ] **Documentation**: Reference integration guide and API docs

### ✅ **Emergency Contacts**
- [ ] **Primary**: System User in Discordant
- [ ] **Secondary**: Tyler Suzanne for business issues
- [ ] **Technical**: NukeBot 3000 for automated support

---

## ✅ Final Verification

Once all items are complete:
- [ ] Integration is live and monitoring
- [ ] Team is trained on new workflows
- [ ] Success metrics are being tracked
- [ ] Support processes are documented
- [ ] Backup/fallback procedures tested

**Integration Status**: ⏳ In Progress | ✅ Complete | ❌ Issues Found

**Next Review Date**: ________________

**Team Sign-off**: ________________ 