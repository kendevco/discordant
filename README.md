# Discordant

**Discordant** is a production-ready Discord-style communication platform with extensible n8n workflow automation. Built with **Next.js 15**, **Prisma**, **MySQL**, and **LiveKit**, it provides real-time chat, video/audio conferencing, and chat-driven AI workflows.

Each deployment creates a **private communication hub** with secure channels, file sharing, and intelligent automation. Perfect for consulting firms, agencies, and service providers who need AI-powered workflows in controlled environments.

---

## 🔑 Key Features

### 🤖 Extensible AI Workflows
- **Main AI Agent** (`discordant_agent_0011.json`) - Comprehensive business intelligence with Calendar, Search, Research, Gmail, YouTube, and Database tools
- **Image Processing** (`discordant_images_flow_0001.json`) - Advanced image analysis and generation with GPT-4o Vision and DALL-E
- **Async Processing** - All workflows run asynchronously with proper error handling and fallback mechanisms
- **Extensible Architecture** - Easy to add new specialized workflows for specific use cases

### 💬 Real-Time Communication
- Discord-style server and channel layout
- Live **video, audio, and screen sharing** via LiveKit
- Secure **file uploads** with UploadThing
- Advanced message search with member activity tracking
- **Clerk** authentication (production-grade)

### 🛠️ Modern Stack
- **Frontend**: Next.js 15 + Tailwind + shadcn/ui + Framer Motion
- **Backend**: Prisma ORM + MySQL
- **Real-time**: LiveKit WebRTC + Socket.IO
- **Automation**: n8n workflows with comprehensive tool integration
- **Auth**: Clerk.dev with role-based access

---

## ✨ Current Capabilities

### 🚀 **Production-Ready Workflows** ✅
- **Main AI Agent** - Business intelligence with 15+ integrated tools
- **Image Processing** - Analysis, generation, and OCR capabilities
- **Voice Integration** - VAPI voice-to-chat processing
- **Database Intelligence** - Direct SQL execution with schema awareness
- **Cold Start Resilience** - Robust error handling and recovery

### 🎯 **Extensible Use Cases**
The workflow architecture supports advanced scenarios like:
- **PDF Processing Pipelines** - Extract images from tax documents, process individually, create research manuals
- **Video Content Analysis** - Extract keyframes, analyze in context, generate companion textbooks
- **Document Intelligence** - OCR with context awareness for comprehensive analysis
- **Business Intelligence** - Real-time data analysis with multiple data sources

### 🔧 **Developer Experience**
- **KISS Principle** - Simple, descriptive naming without unnecessary complexity
- **One Week Productivity** - Comprehensive setup documentation for quick onboarding
- **Memory-Optimized Development** - PowerShell script for 8GB memory allocation
- **HTTPS Development** - Proper certificates for WebRTC and real-time features

### 🤖 **AI & Automation**
- **Share AI Responses** - Public links for AI-generated content
- **Rich Message Format** - Support for both text and structured JSON metadata
- **Perfect Markdown** - Code blocks, tables, and syntax highlighting
- **Workflow Inheritance** - Server and channel-level automation configuration

### 🔍 **Enhanced UX**
- **Advanced Search** (Ctrl+S) - Content, member, date, and activity filters
- **Member Presence** - Real-time online status and activity tracking
- **Smart Content** - Auto-collapse long messages with "Show More"
- **Enhanced Editor** - Rich text with emoji picker and keyboard shortcuts

---

## 🧱 Architecture

**Simple, scalable foundation:**

- **Next.js 15** frontend with app router
- **Prisma ORM** + **MySQL** database
- **LiveKit** for WebRTC video/audio
- **Clerk** for authentication and sessions
- **UploadThing** for secure file handling
- **n8n** for workflow automation (self-hosted or cloud)

> 🔹 Alternative Payload CMS version available at [spaces.kendev.co](https://spaces.kendev.co)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (8GB memory recommended for development)
- MySQL 8.0+
- n8n instance (local or hosted)
- Clerk account
- UploadThing account
- LiveKit account

### 1. Setup

```bash
git clone https://github.com/your-org/discordant.git
cd discordant
npm install
```

### 2. Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
NEXT_PUBLIC_SITE_URL=https://localhost:3000
DATABASE_URL=mysql://user:password@localhost:3306/discordant
N8N_API_URL=http://localhost:5678
N8N_API_TOKEN=your_n8n_token
```

### 3. Database Setup

```bash
npx prisma db push
```

### 4. Import n8n Workflows

Import these workflows from `/docs/workflows/`:
- **`discordant_agent_0011.json`** - Main AI agent with comprehensive tools
- **`discordant_images_flow_0001.json`** - Image analysis and generation

### 5. Development Server

**Windows (Recommended):**
```bash
.\start-dev.ps1
```

**Standard:**
```bash
npm run dev:https-auto
```

### 6. Access

Visit [https://localhost:3000](https://localhost:3000)

### Key Shortcuts
- **Ctrl+S** - Advanced message search
- **Enter** - Send message
- **Shift+Enter** - New line
- **Escape** - Cancel/close

---

## 🎯 Workflow Architecture

### Main AI Agent (`discordant_agent_0011.json`)
**Comprehensive business intelligence with:**
- 📅 **Calendar Management** - View, create, update, delete events
- 🔍 **Database Intelligence** - Direct SQL execution with schema awareness
- 🌐 **Web Research** - Tavily AI for real-time market intelligence
- 📧 **Email Integration** - Gmail and SMTP for communications
- 🎬 **YouTube Processing** - Video transcript analysis and insights
- 🏢 **Client Research** - GSA qualification and business analysis
- 📊 **Server Analytics** - Member management and activity tracking

### Image Processing (`discordant_images_flow_0001.json`)
**Advanced visual intelligence with:**
- 🔍 **Image Analysis** - GPT-4o Vision for detailed analysis
- 🎨 **Image Generation** - DALL-E for custom image creation
- 📄 **OCR Processing** - Text extraction from documents
- 📊 **Chart Analysis** - Business intelligence from visual data
- 🔄 **Auto-Detection** - Smart routing between analysis and generation

### Extensible Framework
The architecture supports advanced use cases:
- **Document Processing** - PDF → Image extraction → Individual analysis → Research manual
- **Video Intelligence** - Keyframe extraction → Context analysis → Companion textbook
- **Business Intelligence** - Multi-source data → Analysis → Actionable insights

---

## 📂 Project Structure

```
/docs/workflows/          # n8n workflow configurations
  ├── discordant_agent_0011.json      # Main AI agent
  └── discordant_images_flow_0001.json # Image processing
/components/              # React components
/app/                     # Next.js 15 app router
/lib/                     # Utilities and services
/prisma/                  # Database schema
start-dev.ps1            # Memory-optimized dev script
```

---

## 🎯 Use Cases

### Current Production Ready
- **Client Communication Portals** - Private Discord-style environments
- **AI-Powered Business Intelligence** - Automated research and analysis
- **Voice-Enabled Workflows** - VAPI integration for voice commands
- **Document Processing** - Image analysis and OCR capabilities
- **Team Collaboration** - Real-time chat with workflow automation

### Extensible Future Applications
- **Tax Document Processing** - PDF → Image extraction → Analysis → Research manual
- **Video Content Analysis** - Keyframe extraction → Context analysis → Textbook generation
- **Advanced OCR Workflows** - Context-aware document processing
- **Multi-Modal Intelligence** - Combined text, image, and voice processing

---

## 🎥 Demo

[![Watch Demo](https://img.shields.io/badge/🎬%20Watch%20Demo-blue?style=for-the-badge)](https://github.com/kendevco/discordant/raw/main/public/demo/Discordant_Chat_Overview_480p.mp4)

---

## 💼 Implementation Services

**Ready to deploy Discordant in your environment?**

I can help with:
- **Private deployment** and infrastructure setup
- **Custom workflow development** for your specific use cases
- **n8n integration** and automation design
- **Voice AI implementation** with VAPI
- **Advanced document processing** pipelines
- **White-label customization** and branding

🧑‍💻 **Connect on [LinkedIn](https://www.linkedin.com/in/kendevco/)** for consulting and implementation services.

---

## 🙏 Acknowledgments

Originally inspired by [Code with Antonio](https://www.youtube.com/@codewithantonio), evolved into an enterprise-grade platform for conversational automation and intelligent workflow processing.

Built with the **KISS principle** - keeping it simple, scalable, and extensible.
