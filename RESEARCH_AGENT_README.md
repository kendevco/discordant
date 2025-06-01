# 🔍 Research Agent & Enhanced Formatting

This document describes the new research agent functionality and enhanced message formatting that has been added to your Discord clone application.

## 🚀 Features Added

### 1. Automatic URL Research Agent
- **Intelligent URL Detection**: Automatically detects when messages contain company or business website URLs
- **Website Analysis**: Fetches and analyzes webpage content to extract metadata
- **Company Information Extraction**: Identifies companies and extracts business details
- **Smart Filtering**: Ignores social media links, file downloads, and non-business URLs
- **Real-time Results**: Displays research results in chat as system messages

### 2. Enhanced Message Formatting
- **Markdown Support**: Bold (`**text**`), italic (`*text*`), and code (`\`text\``) formatting
- **Rich URL Rendering**: Clickable links with hover effects
- **System Message Styling**: Special formatting for research results and calendar responses
- **Line Break Handling**: Proper rendering of multi-line messages
- **Improved Readability**: Better typography and spacing

### 3. Enhanced Chat Input
- **Multi-line Support**: Shift+Enter for new lines, Enter to send
- **Research Indicators**: Shows "🔍 Researching URLs..." when processing
- **Better Placeholder Text**: Contextual hints for functionality
- **Improved UX**: Send button, emoji picker, and file attachment

## 🛠️ Technical Implementation

### Core Components

#### `lib/system/research-agent.ts`
- **URL Detection Logic**: Identifies business-relevant URLs
- **Web Scraping**: Fetches and parses HTML content
- **Metadata Extraction**: Extracts titles, descriptions, and structured data
- **Company Analysis**: Determines if a site represents a company
- **Result Formatting**: Formats research results for chat display

#### `components/chat/rich-content-renderer.tsx`
- **System Message Rendering**: Special formatting for research and calendar results
- **Markdown Processing**: Handles bold, italic, and code formatting
- **URL Enhancement**: Creates clickable links with proper styling
- **Content Structure**: Organized display of complex system messages

#### `components/chat/chat-item.tsx`
- **System Message Detection**: Identifies and styles system messages
- **Rich Content Integration**: Uses RichContentRenderer for enhanced display
- **Message Type Styling**: Different styling for system vs user messages

#### `components/chat/chat-input.tsx`
- **Multi-line Input**: Textarea with keyboard shortcuts
- **Research Detection**: Shows loading state during URL research
- **Enhanced UX**: Better placeholder text and visual feedback

### System Integration

#### Research Handler in `lib/system/system-messages.ts`
```typescript
class ResearchHandler implements SystemMessageHandler {
  canHandle(message: MessageWithMember) {
    return ResearchAgent.shouldResearch(message.content);
  }

  async handle(message: MessageWithMember, { channelId, socketIo, context }: HandlerContext) {
    // Extract URLs and research them
    // Format results and send as system message
  }
}
```

The research handler is integrated into the system message pipeline with priority order:
1. Onboarding Handler (asIs messages)
2. Calendar Handler (calendar commands)
3. **Research Handler (URL detection)** ← New
4. Image Analysis Handler (image uploads)
5. AI Handler (fallback)

## 📋 Usage Examples

### URL Research Triggers
The research agent activates when URLs are detected that match these patterns:

**✅ Will Research:**
- `https://openai.com` - Company website
- `https://vercel.com/company` - Company page
- `https://stripe.com/about` - About page
- `https://mycompany.io` - Business domain

**❌ Won't Research:**
- `https://twitter.com/user` - Social media
- `https://example.com/file.pdf` - File downloads
- `https://blog.example.com` - Blog subdomain
- `https://docs.github.com` - Documentation

### Message Formatting Examples

**Input:**
```
Check out **OpenAI** at https://openai.com - they're doing amazing work with *AI research* and `machine learning`!

Here's what I found:
- Founded in 2015
- Based in San Francisco
```

**Rendered Output:**
- **OpenAI** appears in bold
- *AI research* appears in italics  
- `machine learning` appears as code
- https://openai.com becomes a clickable link
- Line breaks and bullets are preserved
- If URL research triggers, system message appears with company details

### System Message Examples

**Research Results:**
```
🔍 **Research Results:**

**OpenAI**
🌐 https://openai.com
📄 OpenAI is an AI research and deployment company...
📊 company (85% confidence)
```

**Calendar Responses:**
```
📋 **DUTY OFFICER - SCHEDULE REPORT:**

Tomorrow's Schedule:
• 9:00 AM - Team Meeting
• 2:00 PM - Client Call
```

## 🧪 Testing

### Test Page
Access `/test-research` to test the research functionality:
- Enter URLs to test detection logic
- See raw research data and formatted results
- Test various URL types and patterns

### Manual Testing in Chat
1. Go to any chat channel
2. Paste a company URL (e.g., `https://stripe.com`)
3. Send the message
4. Observe automatic research results appearing as system message

### Test URLs for Development
- `https://openai.com` - AI company
- `https://anthropic.com` - AI research
- `https://vercel.com` - Developer platform
- `https://stripe.com` - Payment platform
- `https://github.com/microsoft` - Tech company

## 🔧 Configuration

### Environment Variables
No additional environment variables required. The research agent uses:
- Standard HTTP requests for web scraping
- Built-in URL parsing and HTML processing
- No external APIs or keys needed

### Customization Options

#### Research Agent Settings
In `lib/system/research-agent.ts`:
- `COMPANY_INDICATORS`: Keywords that identify company pages
- `SOCIAL_DOMAINS`: Social media domains to exclude
- Timeout settings for web requests
- Confidence scoring parameters

#### Formatting Settings
In `components/chat/rich-content-renderer.tsx`:
- Color schemes for different message types
- Emoji patterns for system message headers
- Typography and spacing settings

## 🚨 Error Handling

### Research Failures
- **Network Errors**: Shows error message, doesn't crash chat
- **Invalid URLs**: Skipped silently, no error shown
- **Timeout**: 10-second timeout, graceful fallback
- **CORS Issues**: Handled at server level, not client-facing

### Formatting Edge Cases
- **Malformed Markdown**: Renders as plain text
- **Nested Formatting**: Handles complex nested patterns
- **Long URLs**: Proper word breaking and wrapping
- **Special Characters**: Escaped and rendered safely

## 🔄 Integration with Existing Features

### Calendar Integration
- Research and calendar responses use same system message styling
- Both show as "🤖 System" messages with special formatting
- Integrated into same message handler pipeline

### Image Analysis
- Research results can include images from websites
- Compatible with existing image upload and display
- Metadata extraction works alongside image analysis

### Real-time Updates
- Research results appear instantly via Socket.io
- No page refresh needed
- Maintains scroll position and chat state

## 🎯 Future Enhancements

### Potential Improvements
1. **AI-Enhanced Analysis**: Use LLM to analyze website content
2. **Cached Results**: Store research results to avoid re-fetching
3. **User Preferences**: Allow users to disable auto-research
4. **Advanced Filters**: More sophisticated URL filtering
5. **Integration with CRM**: Connect research results to business tools

### Security Considerations
- **Rate Limiting**: Prevent abuse of research functionality
- **Content Filtering**: Ensure safe content extraction
- **Privacy**: No storage of sensitive website data
- **Validation**: Sanitize all extracted content

## 📚 Code Structure

```
lib/system/
├── research-agent.ts          # Core research logic
├── system-messages.ts         # Message handler integration
└── types/                     # Type definitions

components/chat/
├── rich-content-renderer.tsx  # Enhanced formatting
├── chat-item.tsx             # Message display
├── chat-input.tsx            # Input enhancements
└── chat-messages.tsx         # Message list

app/(main)/
└── test-research/            # Testing interface
    └── page.tsx
```

This implementation provides a robust, extensible foundation for intelligent chat assistance and enhanced user experience in your Discord clone application. 