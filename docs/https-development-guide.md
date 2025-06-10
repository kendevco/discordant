# HTTPS Development Setup Guide

This guide will help you configure Discordant for secure HTTPS development on localhost, which is essential for testing external integrations, webhooks, and modern web APIs.

## 🔐 Why HTTPS in Development?

- **External Integrations**: Many webhooks and APIs require HTTPS endpoints
- **Secure Cookies**: Authentication cookies work better with HTTPS
- **Modern Web APIs**: Geolocation, notifications, and other APIs require secure contexts
- **Production Parity**: Match your production environment locally
- **Widget Testing**: External chat widgets need HTTPS for proper iframe communication

## 🚀 Quick Setup

### Windows (PowerShell)
```powershell
# Run the automated setup script
./scripts/setup-https-dev.ps1

# Start the HTTPS development server
npm run dev:https
```

### macOS/Linux (Bash)
```bash
# Make the script executable and run it
chmod +x ./scripts/setup-https-dev.sh
./scripts/setup-https-dev.sh

# Start the HTTPS development server
npm run dev:https
```

## 🔧 Manual Setup

If you prefer to set up HTTPS manually or need to customize the configuration:

### 1. Install mkcert

**Windows (Chocolatey):**
```powershell
choco install mkcert
```

**macOS (Homebrew):**
```bash
brew install mkcert
```

**Linux (Manual):**
```bash
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

### 2. Install Local CA
```bash
mkcert -install
```

### 3. Generate Certificates
```bash
# Create certs directory
mkdir certs
cd certs

# Generate certificates for localhost
mkcert localhost 127.0.0.1 ::1 discordant.localhost api.localhost embed.localhost

# Rename files to standard names
mv localhost+5.pem localhost.pem
mv localhost+5-key.pem localhost-key.pem
```

### 4. Configure Environment

Create `.env.local` in your project root:

```env
# HTTPS Development Configuration
HTTPS=true
SSL_CRT_FILE=./certs/localhost.pem
SSL_KEY_FILE=./certs/localhost-key.pem

# Development URLs (HTTPS)
NEXT_PUBLIC_SITE_URL=https://localhost:3000
NEXT_PUBLIC_APP_URL=https://localhost:3000
NEXT_PUBLIC_SOCKET_URL=https://localhost:3000

# Your actual environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
DATABASE_URL=mysql://user:password@localhost:3306/discordant
UPLOADTHING_SECRET=sk_live_your_uploadthing_secret
UPLOADTHING_APP_ID=your_app_id

# n8n Integration (HTTPS)
N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook

# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
NEXT_PUBLIC_LIVEKIT_URL=wss://your_livekit_url

# External Integration
DISCORDANT_API_TOKEN=disc_your_api_token_here
DISCORDANT_BASE_URL=https://localhost:3000
NEXT_PUBLIC_DISCORDANT_URL=https://localhost:3000
```

### 5. Update package.json

Add the HTTPS development script to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:https": "next dev --experimental-https --experimental-https-key ./certs/localhost-key.pem --experimental-https-cert ./certs/localhost.pem",
    "build": "prisma generate && next build",
    "start": "next start"
  }
}
```

## 🌐 Accessing Your HTTPS App

After starting with `npm run dev:https`, you can access:

- **Main App**: https://localhost:3000
- **API Endpoints**: https://localhost:3000/api/*
- **Widget Library**: https://localhost:3000/discordant-widget.js
- **Embed Interface**: https://localhost:3000/embed/chat
- **Admin Panel**: https://localhost:3000/admin/integrations

## 🔍 Testing Your Setup

Run the automated test script to verify everything is working:

```powershell
# Windows
./scripts/test-https-integration.ps1

# macOS/Linux
chmod +x ./scripts/test-https-integration.sh
./scripts/test-https-integration.sh
```

This will test:
- ✅ Core application endpoints
- ✅ External integration APIs
- ✅ Widget embed functionality
- ✅ Socket.IO connections
- ✅ n8n webhook integration
- ✅ SSL certificate validity
- ✅ Environment configuration

## 🛠️ Troubleshooting

### Browser Certificate Warnings

**Chrome:**
- Click "Advanced" on the security warning
- Click "Proceed to localhost (unsafe)"
- Or type `thisisunsafe` on the warning page

**Firefox:**
- Click "Advanced"
- Click "Accept the Risk and Continue"

**Edge:**
- Click "Advanced"
- Click "Continue to localhost (unsafe)"

### Common Issues

**1. "mkcert not found"**
```bash
# Install mkcert using your package manager
# Windows: choco install mkcert
# macOS: brew install mkcert
# Linux: See manual installation above
```

**2. "Permission denied" on certificate files**
```bash
# Make sure you have read permissions
chmod 644 ./certs/localhost.pem
chmod 600 ./certs/localhost-key.pem
```

**3. "Address already in use"**
```bash
# Kill any existing processes on port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev:https -- -p 3001
```

**4. "SSL Certificate invalid"**
```bash
# Regenerate certificates
cd certs
rm *.pem
mkcert localhost 127.0.0.1 ::1
```

### Widget Integration Issues

**CORS Errors:**
Update your `.env.local` to include the correct origins:
```env
NEXT_PUBLIC_ALLOWED_ORIGINS=https://localhost:3000,https://your-portfolio-site.com
```

**Socket.IO Connection Fails:**
Ensure your socket configuration uses HTTPS:
```javascript
const socket = io('https://localhost:3000', {
  transports: ['websocket', 'polling']
});
```

## 🔌 External Integration Testing

### Testing Widget Embed

Create a test HTML file to test your widget:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Widget Test</title>
</head>
<body>
    <h1>Discordant Widget Test</h1>
    
    <!-- Load the widget -->
    <script src="https://localhost:3000/discordant-widget.js"
            data-discordant-url="https://localhost:3000"
            data-channel-id="your-channel-id"
            data-api-token="your-api-token"
            data-theme="light"
            data-position="bottom-right">
    </script>
</body>
</html>
```

### Testing API Endpoints

```bash
# Test external message API
curl -k -X POST "https://localhost:3000/api/external/messages" \
  -H "Authorization: Bearer your-api-token" \
  -H "Content-Type: application/json" \
  -d '{
    "channelId": "your-channel-id",
    "content": "Test message from HTTPS",
    "sourceType": "https-test"
  }'
```

### Testing n8n Webhooks

Update your n8n webhook URLs to use HTTPS:

```
Old: http://localhost:3000/api/external/webhook/n8n
New: https://localhost:3000/api/external/webhook/n8n
```

## 📋 Environment Variables Checklist

Make sure these are set in your `.env.local`:

- [ ] `HTTPS=true`
- [ ] `SSL_CRT_FILE=./certs/localhost.pem`
- [ ] `SSL_KEY_FILE=./certs/localhost-key.pem`
- [ ] `NEXT_PUBLIC_SITE_URL=https://localhost:3000`
- [ ] `NEXT_PUBLIC_APP_URL=https://localhost:3000`
- [ ] `NEXT_PUBLIC_SOCKET_URL=https://localhost:3000`
- [ ] All your actual API keys and database connections
- [ ] External integration URLs updated to HTTPS

## 🔄 Workflow Integration

For n8n workflow testing with HTTPS:

1. **Update Webhook URLs**: Change all localhost URLs to HTTPS
2. **Test Connectivity**: Use the test scripts to verify endpoints
3. **Check CORS**: Ensure your n8n instance allows HTTPS localhost
4. **Verify Certificates**: Make sure external services can reach your HTTPS endpoints

## 🎯 Production Considerations

When deploying to production:

1. **Environment Variables**: Update all URLs from localhost to your production domain
2. **Real Certificates**: Use Let's Encrypt or your SSL provider's certificates
3. **Security Headers**: Add proper security headers in production
4. **CORS Configuration**: Restrict CORS to only your trusted domains

## 📚 Additional Resources

- [Next.js HTTPS Configuration](https://nextjs.org/docs/api-reference/cli#development)
- [mkcert Documentation](https://github.com/FiloSottile/mkcert)
- [Socket.IO HTTPS Setup](https://socket.io/docs/v4/server-options/#https)
- [Discordant External Integration Guide](./external-integration-guide.md)

---

Your HTTPS development environment is now ready for secure local development and external integration testing! 🎉 