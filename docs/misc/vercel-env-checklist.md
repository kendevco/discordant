# Vercel Environment Variables Checklist

## 🔑 **Required for n8n Integration**

### Core App Configuration
```
NEXT_PUBLIC_APP_URL=https://discordant.kendev.co
NEXT_PUBLIC_SITE_URL=https://discordant.kendev.co
NODE_ENV=production
```

### n8n Workflow Integration
```
N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook
```

### AI Services
```
OPENAI_API_KEY=sk-your-openai-key
GROQ_API_KEY=your-groq-key
GROQ_BASE_URL=https://api.groq.com/openai/v1
```

### System Configuration
```
SYSTEM_USER_ID=system-user-9000
SYSTEM_USER_NAME=System User
MODEL_VISION=llama-3.2-11b-vision-preview
```

### Database
```
DATABASE_URL=your-mysql-connection-string
```

### Authentication (Clerk)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_your_clerk_key
CLERK_SECRET_KEY=sk_your_clerk_secret
CLERK_WEBHOOK_SECRET=your-webhook-secret
```

### Media Services
```
LIVEKIT_API_KEY=your-livekit-api-key
LIVEKIT_API_SECRET=your-livekit-secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your-livekit-domain
```

### File Uploads
```
UPLOADTHING_SECRET=sk_your_uploadthing_secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
```

### External APIs (Optional)
```
OPENCAGE_API_KEY=your-geocoding-key
```

## 🚨 **Critical Issues Found**

Based on the Vercel logs analysis:

1. **N8N_WEBHOOK_URL** - Likely missing or incorrect
2. **NEXT_PUBLIC_APP_URL** - Must match production domain
3. **Socket.io errors** - Check NEXT_PUBLIC_SITE_URL

## 🔧 **Debug Steps**

1. **Check Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Verify all variables listed above are present
   - Pay special attention to `N8N_WEBHOOK_URL`

2. **Test n8n Connectivity:**
   ```bash
   node test-production-n8n.js
   ```

3. **Check Vercel Function Logs:**
   - Look for `[WORKFLOW_HANDLER]` log entries
   - Check for environment variable values in logs

4. **Verify n8n Webhook:**
   - Ensure `https://n8n.kendev.co/webhook/discordant-ai-services` is accessible
   - Test direct webhook call from external tool

## 🎯 **Likely Root Cause**

The n8n integration is not working because:
- **Missing `N8N_WEBHOOK_URL` environment variable** in Vercel
- **Incorrect production URL configuration**
- **n8n webhook endpoint not accessible from Vercel**

## ✅ **Fix Actions**

1. **Add Missing Environment Variables:**
   ```
   N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook
   NEXT_PUBLIC_APP_URL=https://discordant.kendev.co
   ```

2. **Redeploy Application** after setting environment variables

3. **Test Message Flow** in production Discord app

4. **Monitor Vercel Function Logs** for detailed debugging output 