# HTTPS Development Quick Start

This guide gets you up and running with HTTPS development in under 5 minutes.

## 🚀 Step 1: Install mkcert

Choose the method that works for your system:

### Option A: Download Pre-built Binary (Recommended)

**Windows:**
1. Download from: https://github.com/FiloSottile/mkcert/releases/latest
2. Download `mkcert-v1.4.4-windows-amd64.exe`
3. Rename to `mkcert.exe` and add to your PATH
4. Or place in `C:\Windows\System32\`

**macOS:**
```bash
# Using Homebrew (recommended)
brew install mkcert

# Or download binary
curl -JLO "https://dl.filippo.io/mkcert/latest?for=darwin/amd64"
chmod +x mkcert-v*-darwin-amd64
sudo mv mkcert-v*-darwin-amd64 /usr/local/bin/mkcert
```

**Linux:**
```bash
curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
chmod +x mkcert-v*-linux-amd64
sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
```

### Option B: Package Managers

**Windows (Chocolatey) - Run as Administrator:**
```powershell
choco install mkcert
```

**Windows (Scoop):**
```powershell
scoop bucket add extras
scoop install mkcert
```

### Option C: Alternative Tools

If mkcert installation fails, you can use OpenSSL:

```bash
# Create certificates with OpenSSL
mkdir certs
cd certs

# Generate private key
openssl genrsa -out localhost-key.pem 2048

# Generate certificate
openssl req -new -x509 -key localhost-key.pem -out localhost.pem -days 365 -subj "/C=US/ST=Development/L=Localhost/O=Discordant/CN=localhost"
```

## 🚀 Step 2: Generate Certificates

```bash
# Install local certificate authority
mkcert -install

# Create certs directory
mkdir certs
cd certs

# Generate certificates for all localhost variations
mkcert localhost 127.0.0.1 ::1 discordant.localhost

# Rename files (adjust based on actual generated names)
# Files might be named: localhost+2.pem and localhost+2-key.pem
mv localhost*.pem localhost.pem
mv localhost*-key.pem localhost-key.pem
```

## 🚀 Step 3: Create Environment File

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

# Add your actual credentials here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_here
DATABASE_URL=mysql://user:password@localhost:3306/discordant

# External Integration
DISCORDANT_BASE_URL=https://localhost:3000
NEXT_PUBLIC_DISCORDANT_URL=https://localhost:3000
```

## 🚀 Step 4: Add NPM Script

Add to your `package.json` scripts section:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:https": "next dev --experimental-https --experimental-https-key ./certs/localhost-key.pem --experimental-https-cert ./certs/localhost.pem"
  }
}
```

## 🚀 Step 5: Start HTTPS Server

```bash
npm run dev:https
```

## 🔍 Step 6: Test Your Setup

Visit https://localhost:3000 in your browser:

1. **Chrome:** Click "Advanced" → "Proceed to localhost (unsafe)"
2. **Firefox:** Click "Advanced" → "Accept the Risk and Continue"
3. **Edge:** Click "Advanced" → "Continue to localhost (unsafe)"

## ✅ Verification Checklist

Test these URLs work:
- [ ] https://localhost:3000 (main app)
- [ ] https://localhost:3000/api/health (API)
- [ ] https://localhost:3000/discordant-widget.js (widget)
- [ ] https://localhost:3000/embed/chat (embed)

## 🛠️ Troubleshooting

### "mkcert not found" or "command not found"

**Solution 1:** Use the manual binary download method above

**Solution 2:** Add mkcert to your PATH:
```bash
# Windows (add to PATH environment variable)
C:\path\to\mkcert.exe

# macOS/Linux (move to /usr/local/bin)
sudo mv mkcert /usr/local/bin/
```

### "Certificate files not found"

Check what files were actually generated:
```bash
cd certs
ls -la
# Look for files like: localhost+2.pem, localhost+2-key.pem
# Rename them to: localhost.pem, localhost-key.pem
```

### "Permission denied" or "Access denied"

**Windows:** Run PowerShell as Administrator
**macOS/Linux:** Use `sudo` for file operations

### "Port 3000 already in use"

```bash
# Kill existing processes
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev:https -- -p 3001
```

### "SSL Certificate invalid"

This is normal for development. Each browser handles it differently:

**Chrome:** Type `thisisunsafe` on the warning page
**Firefox:** Click through the warnings
**Edge:** Click "Advanced" and proceed

## 🎯 Quick Test Script

Create `test-https.js` to verify everything works:

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('./certs/localhost-key.pem'),
  cert: fs.readFileSync('./certs/localhost.pem')
};

https.createServer(options, (req, res) => {
  res.writeHead(200);
  res.end('HTTPS is working!\n');
}).listen(8443, () => {
  console.log('Test HTTPS server running on https://localhost:8443');
});
```

Run with: `node test-https.js`

## 🔧 Development Workflow

1. **Start HTTPS server:** `npm run dev:https`
2. **Access app:** https://localhost:3000
3. **Test external integration:** Use the widget and API endpoints
4. **Debug with browser dev tools:** Check console for any HTTP/HTTPS mixed content warnings

## 📁 File Structure

After setup, you should have:
```
your-project/
├── certs/
│   ├── localhost.pem
│   └── localhost-key.pem
├── .env.local
├── package.json (with dev:https script)
└── ... (rest of your project)
```

## 🎉 You're Ready!

Your HTTPS development environment is now configured. You can:

✅ Test external integrations securely  
✅ Use modern web APIs that require HTTPS  
✅ Match your production environment  
✅ Embed widgets on external sites  
✅ Test webhook endpoints with n8n  

For advanced configuration and troubleshooting, see the [full HTTPS Development Guide](./https-development-guide.md). 