#!/bin/bash

# HTTPS Development Setup for Discordant
# This script creates SSL certificates and configures HTTPS for local development

echo "🔐 Setting up HTTPS Development Environment for Discordant"
echo "================================================================"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CERTS_DIR="$PROJECT_ROOT/certs"

# Create certs directory if it doesn't exist
if [ ! -d "$CERTS_DIR" ]; then
    mkdir -p "$CERTS_DIR"
    echo "📁 Created certs directory"
fi

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed. Installing..."
    
    # Detect OS and install mkcert
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew install mkcert
        else
            echo "❌ Homebrew not found. Please install mkcert manually:"
            echo "   Visit: https://github.com/FiloSottile/mkcert#installation"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        if command -v apt &> /dev/null; then
            sudo apt update
            sudo apt install -y libnss3-tools
            curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
            chmod +x mkcert-v*-linux-amd64
            sudo mv mkcert-v*-linux-amd64 /usr/local/bin/mkcert
        else
            echo "❌ Unsupported Linux distribution. Please install mkcert manually:"
            echo "   Visit: https://github.com/FiloSottile/mkcert#installation"
            exit 1
        fi
    else
        echo "❌ Unsupported OS. Please install mkcert manually:"
        echo "   Visit: https://github.com/FiloSottile/mkcert#installation"
        exit 1
    fi
    
    # Check if installation was successful
    if ! command -v mkcert &> /dev/null; then
        echo "❌ Failed to install mkcert. Please install manually."
        exit 1
    fi
fi

echo "✅ mkcert is available"

# Install mkcert CA
echo "🔧 Installing mkcert CA..."
mkcert -install

# Generate certificates for localhost development
echo "🔑 Generating SSL certificates..."
cd "$CERTS_DIR"

DOMAINS="localhost 127.0.0.1 ::1 discordant.localhost api.localhost embed.localhost"
mkcert $DOMAINS

# Find and rename generated files to standard names
CERT_FILE=$(ls -t *-cert.pem 2>/dev/null | head -n1)
KEY_FILE=$(ls -t *-key.pem 2>/dev/null | head -n1)

if [ -n "$CERT_FILE" ] && [ -n "$KEY_FILE" ]; then
    mv "$CERT_FILE" "localhost.pem"
    mv "$KEY_FILE" "localhost-key.pem"
    echo "✅ Certificate: localhost.pem"
    echo "✅ Private Key: localhost-key.pem"
else
    echo "⚠️  Certificate files not found with expected pattern. Please check certs directory."
fi

# Create .env.local if it doesn't exist
ENV_LOCAL_PATH="$PROJECT_ROOT/.env.local"
if [ ! -f "$ENV_LOCAL_PATH" ]; then
    echo "📝 Creating .env.local with HTTPS configuration..."
    
    cat > "$ENV_LOCAL_PATH" << 'EOF'
# HTTPS Development Configuration
HTTPS=true
SSL_CRT_FILE=./certs/localhost.pem
SSL_KEY_FILE=./certs/localhost-key.pem

# Development URLs (HTTPS)
NEXT_PUBLIC_SITE_URL=https://localhost:3000
NEXT_PUBLIC_APP_URL=https://localhost:3000
NEXT_PUBLIC_SOCKET_URL=https://localhost:3000

# Update these with your actual values
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
CLERK_SECRET_KEY=your_clerk_secret_here
DATABASE_URL=your_database_url_here
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# n8n Integration (HTTPS)
N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.kendev.co/webhook

# LiveKit (if using)
LIVEKIT_API_KEY=your_livekit_key_here
LIVEKIT_API_SECRET=your_livekit_secret_here
NEXT_PUBLIC_LIVEKIT_URL=wss://your_livekit_url_here

# External Integration (HTTPS)
DISCORDANT_API_TOKEN=your_api_token_here
DISCORDANT_BASE_URL=https://localhost:3000
NEXT_PUBLIC_DISCORDANT_URL=https://localhost:3000
EOF
    
    echo "✅ Created .env.local"
else
    echo "ℹ️  .env.local already exists. Please update it with HTTPS URLs manually."
fi

# Update package.json with HTTPS dev script
echo "📦 Updating package.json with HTTPS dev script..."
PACKAGE_JSON_PATH="$PROJECT_ROOT/package.json"

# Check if dev:https script already exists
if grep -q '"dev:https"' "$PACKAGE_JSON_PATH"; then
    echo "ℹ️  dev:https script already exists in package.json"
else
    # Use Node.js to update package.json
    node -e "
        const fs = require('fs');
        const packageJson = JSON.parse(fs.readFileSync('$PACKAGE_JSON_PATH', 'utf8'));
        packageJson.scripts['dev:https'] = 'next dev --experimental-https --experimental-https-key ./certs/localhost-key.pem --experimental-https-cert ./certs/localhost.pem';
        fs.writeFileSync('$PACKAGE_JSON_PATH', JSON.stringify(packageJson, null, 2) + '\n');
    "
    echo "✅ Added dev:https script to package.json"
fi

echo ""
echo "🎉 HTTPS Development Setup Complete!"
echo "================================================"
echo ""
echo "📋 Next Steps:"
echo "1. Update .env.local with your actual environment variables"
echo "2. Run: npm run dev:https"
echo "3. Visit: https://localhost:3000"
echo ""
echo "🔗 HTTPS URLs:"
echo "   • App: https://localhost:3000"
echo "   • API: https://localhost:3000/api"
echo "   • Widget: https://localhost:3000/discordant-widget.js"
echo "   • Embed: https://localhost:3000/embed/chat"
echo ""
echo "🛠️  Troubleshooting:"
echo "   • If browser shows certificate warning, click 'Advanced' → 'Proceed'"
echo "   • Chrome: Type 'thisisunsafe' on the warning page"
echo "   • Firefox: Click 'Advanced' → 'Accept Risk'"
echo ""
echo "📁 Generated Files:"
echo "   • ./certs/localhost.pem (certificate)"
echo "   • ./certs/localhost-key.pem (private key)"
echo "   • ./.env.local (environment variables)" 