# Discordant Message Format Standards

## Overview

Discordant implements a sophisticated message format system that supports both plain text and structured JSON content with rich metadata, file attachments, and external document integration.

## Core Message Structure

### 1. Plain Text Messages
```typescript
interface PlainMessage {
  id: string;                    // UUID
  content: string;               // Plain text content
  role: "user" | "system";       // Message role
  memberId: string;              // Author ID
  channelId: string;             // Channel ID
  fileUrl?: string;              // Optional attachment
  deleted: boolean;              // Soft delete flag
  createdAt: DateTime;           // Timestamp
  updatedAt: DateTime;           // Last modified
}
```

### 2. JSON-Structured Messages
When messages contain JSON, the `content` field contains structured data:

```typescript
interface JSONMessage extends PlainMessage {
  content: string; // JSON string containing structured data
}

// Parsed JSON structure:
interface MessageContentJSON {
  message: string;               // Primary message text
  metadata?: MessageMetadata;    // Rich metadata
  analysis?: AIAnalysis;         // AI processing results
  workflow?: WorkflowData;       // n8n workflow context
  files?: FileReference[];       // File attachments
  externalDocs?: ExternalDoc[];  // Google Docs, SharePoint, etc.
}
```

## File Attachment Standards

### File Size Limits
```typescript
const FILE_LIMITS = {
  serverImage: {
    maxFileSize: "4MB",
    maxFileCount: 1,
    types: ["image"]
  },
  messageFile: {
    maxFileSize: "16MB",        // Default UploadThing limit
    maxFileCount: 1,
    types: ["image", "pdf"]
  }
};
```

### Supported File Types
- **Images**: JPG, PNG, GIF, JPEG, WebP
- **Documents**: PDF
- **Video**: MP4, MOV, AVI (via URL)
- **Audio**: MP3, WAV (via URL)

### File Metadata Schema
```typescript
interface FileMetadata {
  id: string;
  messageId?: string;
  directMessageId?: string;
  
  // Basic file information
  originalUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  fileType: FileType;
  
  // Enhanced metadata
  extractedText?: string;        // OCR results
  description?: string;          // AI description
  tags?: string;                 // JSON array of tags
  location?: string;             // JSON location data
  businessContext?: string;      // Business relevance
  
  // External document links
  externalLinks?: string;        // JSON array of external docs
  googleDocsUrl?: string;        // Google Docs URL
  sharePointUrl?: string;        // SharePoint URL
  confluenceUrl?: string;        // Confluence URL
  
  // Processing status
  processingStatus: ProcessingStatus;
  ocrCompleted: boolean;
  aiAnalyzed: boolean;
  lastProcessed?: DateTime;
  
  // AI Analysis results
  aiSummary?: string;
  aiCategories?: string;         // JSON array
  businessEntities?: string;     // JSON array
  actionItems?: string;          // JSON array
  
  // Workflow integration
  workflowTriggered: boolean;
  workflowResults?: string;      // JSON workflow outputs
}
```

## Workflow Integration Format

### n8n Workflow Payload
```typescript
interface WorkflowPayload {
  message: string;               // Primary message content
  userId: string;
  userName: string;
  channelId: string;
  serverId?: string;
  timestamp: string;             // ISO 8601
  metadata: {
    platform: "discordant-chat";
    messageType: "text" | "file";
    hasAttachment: boolean;
    attachmentUrl?: string;
    priority: "low" | "normal" | "high";
    sessionId: string;
    routedBy: "workflow-router";
    workflowId: string;
    intent?: string;
  };
}
```

### Workflow Response Format
```typescript
interface WorkflowResponse {
  content: string;               // Formatted response text
  metadata: {
    userId: string;
    channelId: string;
    sessionId: string;
    platform: "discordant";
    messageCount: number;
    timestamp: string;           // ISO 8601
    responseSource: "n8n-workflow";
    processingTime: number;      // milliseconds
    hadFallback: boolean;
    debugInfo?: {
      aiResponseKeys: string[];
      contextKeys: string[];
      responseFound: boolean;
    };
  };
}
```

## External Document Integration

### Google Docs Integration
Messages can create and link to Google Docs through the FileMetadata system:

```typescript
interface GoogleDocsIntegration {
  // Stored in FileMetadata.googleDocsUrl
  documentId: string;            // Google Doc ID
  documentUrl: string;           // Full Google Docs URL
  permissions: "view" | "edit" | "comment";
  
  // Auto-generated from message content
  documentTitle: string;         // Based on message/AI analysis
  initialContent: string;        // Seeded from message content
  
  // Workflow triggers
  autoCreate: boolean;           // Create doc on file upload
  syncUpdates: boolean;          // Sync changes back to Discord
}
```

### SharePoint Integration
```typescript
interface SharePointIntegration {
  siteUrl: string;
  documentLibrary: string;
  documentPath: string;
  permissions: SharePointPermissions;
}
```

## Message Processing Flow

### 1. Plain Text Message
```
User Input → Content Validation → Database Storage → Socket Broadcast
```

### 2. File Message with Analysis
```
File Upload → UploadThing Processing → Message Creation → FileMetadata Creation → 
AI Analysis → OCR Processing → External Doc Creation → Workflow Triggers → 
Socket Broadcast with Rich Content
```

### 3. System Message (AI Response)
```
n8n Workflow → Response Formatting → System Message Creation → 
Rich Content Rendering → Socket Broadcast
```

## Rich Content Rendering

### Supported Markdown Extensions
- **Headers**: `#`, `##`, `###`
- **Lists**: Numbered and bullet points
- **Links**: `[text](url)` with clickable rendering
- **Code**: Inline and block code formatting
- **Bold/Italic**: Standard markdown formatting
- **Emojis**: Unicode emoji support

### Content Expansion
```typescript
interface ExpandableMessage {
  truncateAt: number;            // Character limit (default: 500)
  showMoreText: string;          // "Show More" button text
  showLessText: string;          // "Show Less" button text
  safeTruncatePoint: number;     // HTML-safe truncation
}
```

## Size and Performance Limits

### Content Limits
```typescript
const CONTENT_LIMITS = {
  message: {
    maxLength: 4000,             // Database TEXT limit
    truncateDisplay: 500,        // UI truncation
    expandThreshold: 200,        // When to show "Show More"
  },
  metadata: {
    extractedText: "16MB",       // LONGTEXT field
    description: "64KB",         // TEXT field
    businessContext: "64KB",     // TEXT field
    aiSummary: "64KB",          // TEXT field
  },
  files: {
    totalAttachments: 10,        // Per message
    maxFileSize: "16MB",         // Per file
    processingTimeout: 300000,   // 5 minutes
  }
};
```

### Performance Optimizations
- **Lazy Loading**: File metadata loaded on demand
- **Chunked Processing**: Large files processed in chunks
- **Background Tasks**: AI analysis runs asynchronously
- **Caching**: Processed results cached for reuse

## External Document Standards

### Auto-Generated Google Docs
When a message contains business content or file attachments, the system can automatically:

1. **Create Google Doc**: Based on message content and AI analysis
2. **Set Permissions**: Match Discord channel permissions
3. **Generate Title**: AI-generated based on content analysis
4. **Seed Content**: Include original message and extracted file text
5. **Link Back**: Store bidirectional references

### Document Naming Convention
```
{YYYY-MM-DD} - {Channel Name} - {AI Generated Title}
Example: "2025-06-08 - General - Contract Analysis for ABC Corp"
```

### Automatic Document Creation Triggers
- PDF uploads with business content
- Messages containing contract keywords
- Research requests with company names
- Meeting notes and action items
- File analysis results

## API Response Standards

### Standard Success Response
```json
{
  "message": "Response content here",
  "timestamp": "2025-06-08T20:30:17.302Z",
  "userId": "system-assistant",
  "type": "workflow_response",
  "metadata": {
    "sessionId": "user-channel-session",
    "platform": "discordant",
    "responseSource": "n8n-workflow",
    "processingTime": 1500,
    "hadFallback": false,
    "fileMetadata": {
      "googleDocsUrl": "https://docs.google.com/document/d/...",
      "extractedText": "OCR results...",
      "aiSummary": "Document summary..."
    }
  }
}
```

### Error Response
```json
{
  "message": "Error description",
  "timestamp": "2025-06-08T20:30:17.302Z",
  "type": "error_response",
  "metadata": {
    "errorCode": "PROCESSING_FAILED",
    "originalMessage": "User's original message",
    "retryable": true,
    "supportContact": "system-admin"
  }
}
```

## Security and Validation

### Content Sanitization
- **XSS Protection**: HTML content sanitized
- **Input Validation**: Message length and format checks
- **File Type Validation**: Strict MIME type checking
- **Permission Checks**: Channel access validation

### External Document Security
- **OAuth Integration**: Secure Google/Microsoft authentication
- **Permission Inheritance**: Match Discord channel permissions
- **Audit Logging**: Track document access and modifications
- **Data Encryption**: Sensitive content encrypted at rest

## Implementation Notes

### Message Storage Strategy
- **Content Field**: Always contains the primary message text
- **JSON Detection**: Automatic detection of JSON vs plain text
- **Backward Compatibility**: Plain text messages remain simple
- **Rich Metadata**: Optional enhancement via FileMetadata relation

### Performance Considerations
- **Async Processing**: File analysis runs in background
- **Queue Management**: Large files queued for processing
- **Resource Limits**: Processing timeouts and memory limits
- **Graceful Degradation**: Core messaging works even if analysis fails

This format standard ensures consistent, scalable message handling while supporting advanced features like AI analysis, external document integration, and rich metadata management. 