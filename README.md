**Discordant+n8n** is a production-ready, full-featured communication and automation platform. Built with **Next.js**, **Prisma ORM**, **MySQL**, and **LiveKit**, it combines a real-time Discord-style UX with low-code automation powered by **n8n**.

Each client receives a **white-labeled portal** (like a private Discord server) with secure channels, video/audio conferencing, file sharing, and chat-driven workflows. This platform is ideal for consulting firms, agencies, and automation-led service providers looking to deliver AI-powered solutions in private environments.

---

## 🔑 Highlights

### 🔁 Conversational Automation (n8n)
- Trigger and interact with **n8n workflows** directly from chat
- Chat-first interface for backend automation
- Fully self-hosted & isolated per client or tenant
- Token-based secure communication with n8n

### 💬 Real-Time Communication
- Multi-channel server layout (like Discord)
- Live **video, audio, and screen sharing** via LiveKit
- Secure **file uploads** using UploadThing
- Auth with **Clerk** (scalable, production-grade)

### 🛠️ Infrastructure & Stack
- Backend: **Prisma + MySQL**
- Frontend: **Next.js + Tailwind + shadcn/ui + Framer Motion**
- Real-time: **LiveKit WebRTC**
- Auth: **Clerk.dev**
- DevOps-ready and deployable in **private environments**

---

## 🧱 Architecture

Discordant+ is built on a **simple, scalable stack**:

- Next.js frontend
- Prisma ORM connected to a **MySQL** database
- WebRTC with LiveKit
- Clerk for auth and session control
- UploadThing for file handling
- External integration with **n8n**, hosted privately or on-prem

> 🔹 A Payload CMS version also exists at [spaces.kendev.co](https://spaces.kendev.co) if you’re exploring content-driven variations of this platform.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/discordant-plus.git
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
```

### 4. Setup the Database

```bash
npx prisma db push
```

### 5. Run the Development Server

```bash
npm run dev
```

### 6. Launch the App

Visit [http://localhost:3000](http://localhost:3000)

---

## 🎥 Demo Video

[![Watch Demo](https://img.shields.io/badge/🎬%20Watch%20Video-blue?style=for-the-badge)](https://github.com/kendevco/discordant/raw/main/public/demo/Discordant_Chat_Overview_480p.mp4)

📅 Or [download the video directly](https://github.com/kendevco/discordant/raw/main/public/demo/Discordant_Chat_Overview_480p.mp4)

---

## 🌐 LiveKit + n8n Integration

Discordant+ integrates directly with your **n8n instance**, enabling:

- Conversational workflow launches
- Slack/Discord-style automations via chat commands
- Visual feedback from flows into chat or modal components
- Works with any n8n trigger, including webhooks, schedulers, or external apps

> 🔐 You retain full control over your infrastructure — host n8n, LiveKit, and the app privately.

---

## 📆 Use Cases

- Client Automation Portals  
- AI-Led Operational Interfaces  
- Internal Tools for Agencies  
- Private Collaboration Environments  
- White-Label Managed Service Platforms

---

## 💼 Consulting & Private Integration

If you're looking to:

- Deploy Discordant+ in your own private environment
- Integrate it with your self-hosted **n8n**
- Customize portals, commands, or workflows
- Expand to include billing, analytics, or enterprise SSO

🧑‍💻 **Connect with me on [LinkedIn](https://www.linkedin.com/in/kendevco/)** — I’m available for full-cycle consulting, white-label deployment, and integration work.

---

## 📚 Related Projects

- [spaces.kendev.co](https://spaces.kendev.co) — Payload CMS-powered version of Discordant+
- [Next LMS Clone](https://github.com/...)
- [Trello Clone (Taskify)](https://github.com/...)
- [Notion Clone](https://github.com/...)
- [n8n.io](https://n8n.io)

---

## 🙏 Acknowledgments

This project was originally inspired by the excellent teaching content from [Code with Antonio](https://www.youtube.com/@codewithantonio), then reimagined for enterprise-grade conversational automation.
