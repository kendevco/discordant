**Discordant+n8n** is a production-ready, full-featured communication and automation platform. Built with **Next.js**, **Prisma ORM**, **MySQL**, and **LiveKit**, it combines a real-time Discord-style UX with low-code automation powered by **n8n**.

Each client receives a **white-labeled portal** (like a private Discord server) with secure channels, video/audio conferencing, file sharing, and chat-driven workflows. This platform is ideal for consulting firms, agencies, and automation-led service providers looking to deliver AI-powered solutions in private environments.

---

## 🔑 Highlights

### 🔁 Conversational Automation (n8n)
- **Async Workflow Processing** - Advanced asynchronous workflow execution with comprehensive debugging
- **VAPI Voice Integration** - Voice-to-AI chat processing via n8n workflows 
- Trigger and interact with **n8n workflows** directly from chat
- Chat-first interface for backend automation
- Fully self-hosted & isolated per client or tenant
- Token-based secure communication with n8n
- Configure workflows per server or channel with intelligent routing

### 💬 Real-Time Communication
- Multi-channel server layout (like Discord)
- Live **video, audio, and screen sharing** via LiveKit
- Secure **file uploads** using UploadThing
- Auth with **Clerk** (scalable, production-grade)
- Advanced message search with filters and member activity tracking

### 🛠️ Infrastructure & Stack
- Backend: **Prisma + MySQL**
- Frontend: **Next.js + Tailwind + shadcn/ui + Framer Motion**
- Real-time: **LiveKit WebRTC**
- Auth: **Clerk.dev**
- DevOps-ready and deployable in **private environments**

---

## ✨ Current Status & Recent Achievements

### 🚀 **Async Workflow Foundation** ✅
- **Production-Ready Async Processing** - Workflows now process asynchronously with proper webhook responses
- **Enhanced Business Intelligence AI Agent v3.0** - Comprehensive AI agent with Calendar, Search, Research, Gmail, and YouTube tools
- **Cold Start Resilience** - Robust error handling and fallback mechanisms for workflow initialization
- **Comprehensive Debugging** - Full execution data tracking and performance monitoring

### 🎙️ **VAPI Voice AI Integration** ✅  
- **Voice-to-Chat Processing** - VAPI calls route through Discordant AI workflow for sophisticated voice interactions
- **Tool Execution for Voice** - Voice callers get access to full AI tool suite (Calendar, Search, Research, etc.)
- **Unified AI Configuration** - Single workflow serves both Discord and voice interactions

### 🔧 **Developer Experience**
- **One Week Setup Target** - Any sufficiently skilled developer should be productive within a week
- **Memory-Optimized Development** - PowerShell script for handling large Next.js compilation with 8GB memory allocation
- **Comprehensive Documentation** - Updated workflow files and integration guides in `/docs/workflows/`
- **Production-Ready Deployment** - HTTPS development server with proper certificates

### 🤖 AI & Content Management
- **Share AI Generated Content** - Share AI responses with public links and enhanced formatting
- **Extensible Message Format** - Messages support both string and JSON formats for rich metadata
- **Perfect Markdown Rendering** - Flawless code blocks, tables, and formatting with proper syntax highlighting

### 🔍 Enhanced Search & Navigation
- **Advanced Message Search** (Ctrl+S) - Search by content, type, member, date range, and activity
- **Member Activity Tracking** - Real-time presence, online status, and activity history
- **Smart Content Collapse** - Long messages (40+ lines) auto-collapse with "Show More" button

### ⚙️ Workflow Integration
- **Server-Level Workflows** - Configure n8n workflows for entire servers
- **Channel-Specific Automation** - Override server settings with channel-specific workflows
- **Workflow Inheritance** - Channels can inherit server workflows or define their own
- **Message Pattern Detection** - Workflows automatically filter by message pattern support

### 💬 Communication Enhancements
- **Enhanced Message Editor** - Rich text editing with emoji picker and keyboard shortcuts
- **Improved File Display** - Better handling of images, PDFs, and document previews
- **Seamless Scrolling** - Optimized message list with proper scroll position management
- **Presence Indicators** - See who's online, typing, or active in real-time

---

## 🧱 Architecture

Discordant+ is built on a **simple, scalable stack**:

- Next.js frontend
- Prisma ORM connected to a **MySQL** database
- WebRTC with LiveKit
- Clerk for auth and session control
- UploadThing for file handling
- External integration with **n8n**, hosted privately or on-prem

> 🔹 A Payload CMS version also exists at [spaces.kendev.co](https://spaces.kendev.co) if you're exploring content-driven variations of this platform.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ with sufficient memory allocation (8GB recommended for development)
- MySQL 8.0+
- n8n instance (local or hosted)
- Clerk account for authentication
- UploadThing account for file handling
- LiveKit account for video/audio

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/discordant-plus.git
cd discordant-plus
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

```bash
# .env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
LIVEKIT_API_KEY=your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
NEXT_PUBLIC_LIVEKIT_URL=your_livekit_url
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
N8N_API_URL=http://localhost:5678
N8N_API_TOKEN=your_n8n_api_token
DATABASE_URL=mysql://user:password@localhost:3306/discordant

# Optional: For enhanced features
NEXT_PUBLIC_SOCKET_URL=http://localhost:3000
NEXT_PUBLIC_AI_SHARE_ENABLED=true
```

### 4. Setup the Database

```bash
npx prisma db push
```

### 5. Import n8n Workflows

Import the provided workflows from `/docs/workflows/`:
- `discordant-agent-0003.json` - Main AI agent with async processing
- `vapi-discord-integration-workflow-v2.json` - VAPI voice integration

### 6. Run the Development Server

For optimal performance with large builds:

**Windows (PowerShell):**
```bash
.\start-dev.ps1
```

**Standard:**
```bash
npm run dev
```

### 7. Launch the App

Visit [http://localhost:3000](http://localhost:3000)

### 8. Key Commands & Shortcuts

- **Ctrl+S** - Open advanced message search
- **Enter** - Send message (in editor)
- **Shift+Enter** - New line in message
- **Escape** - Cancel editing/close modals

### 📅 **Development Timeline**
With proper setup and the provided documentation, any sufficiently skilled developer should be able to:
- **Day 1-2**: Complete environment setup and basic deployment
- **Day 3-4**: Configure n8n workflows and test basic automation
- **Day 5-7**: Customize workflows, integrate additional tools, and achieve full productivity

---

## 🎥 Demo Video

[![Watch Demo](https://img.shields.io/badge/🎬%20Watch%20Video-blue?style=for-the-badge)](https://github.com/kendevco/discordant/raw/main/public/demo/Discordant_Chat_Overview_480p.mp4)

📅 Or [download the video directly](https://github.com/kendevco/discordant/raw/main/public/demo/Discordant_Chat_Overview_480p.mp4)

---

## 🌐 LiveKit + n8n Integration

Discordant+ integrates directly with your **n8n instance**, enabling:

- **Asynchronous workflow execution** with comprehensive error handling
- **Voice-driven automation** via VAPI integration
- Conversational workflow launches
- Slack/Discord-style automations via chat commands
- Visual feedback from flows into chat or modal components
- Works with any n8n trigger, including webhooks, schedulers, or external apps

> 🔐 You retain full control over your infrastructure — host n8n, LiveKit, and the app privately.

---

## 📂 Project Structure

```
/docs/workflows/          # n8n workflow configurations
  ├── discordant-agent-0003.json           # Main AI agent (async)
  └── vapi-discord-integration-workflow-v2.json  # Voice integration
/docs/misc/               # General documentation
/components/              # React components
/app/                     # Next.js 15 app router
/lib/                     # Utilities and services
start-dev.ps1            # Memory-optimized development script
```

---

## 📆 Use Cases

- Client Automation Portals  
- AI-Led Operational Interfaces  
- Internal Tools for Agencies  
- Private Collaboration Environments  
- White-Label Managed Service Platforms
- **Voice-Enabled Business Intelligence**
- **Async Workflow Processing Centers**

---

## 💼 Consulting & Private Integration

If you're looking to:

- Deploy Discordant+ in your own private environment
- Integrate it with your self-hosted **n8n**
- Customize portals, commands, or workflows
- Expand to include billing, analytics, or enterprise SSO
- **Implement voice AI integration with VAPI**
- **Scale async workflow processing**

🧑‍💻 **Connect with me on [LinkedIn](https://www.linkedin.com/in/kendevco/)** — I'm available for full-cycle consulting, white-label deployment, and integration work.

---

## 📚 Related Projects

- [spaces.kendev.co](https://spaces.kendev.co) — Payload CMS-powered version of Discordant+
- [Next LMS Clone](https://github.com/...)
- [Trello Clone (Taskify)](https://github.com/...)
- [Notion Clone](https://github.com/...)
- [n8n.io](https://n8n.io)

---

## 🙏 Acknowledgments

This project was originally inspired by the excellent teaching content from [Code with Antonio](https://www.youtube.com/@codewithantonio), then reimagined for enterprise-grade conversational automation with async workflow processing and voice AI integration.
