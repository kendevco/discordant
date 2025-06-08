# Socket Message Flow Analysis & Debugging

## Issue Analysis

When n8n workflow completes and sends its response back, the system message is not appearing on the client. Based on my analysis of the codebase, here are the potential issues and the debugging improvements I've implemented:

## Potential Issues Identified

### 1. **Socket Instance Mismatch**
- The client uses the socket provider from `components/providers/socket-provider.tsx`
- The server-side message handler uses `res?.socket?.server?.io` 
- These might be different socket instances or contexts

### 2. **Message Structure Inconsistency**
- Regular messages: `{ ...message, _forceUpdate: true }`
- System messages: `{ ...systemMessage, messageType, workflowId, intent, metadata, usedFallback }`
- The extra fields in system messages might cause processing issues

### 3. **n8n Response Parsing**
- n8n returns: `{ content: "...", metadata: {...} }`
- Handler looks for: `message`, `formattedMessage`, `text`, `content`, `output`, etc.
- Mismatch between expected and actual response structure

### 4. **Channel Key Consistency**
- Both client and server use `chat:${channelId}:messages` ✅ (this is correct)
- But emission timing and structure might differ

## Debugging Improvements Added

### 1. **Server-Side System Message Handler** (`lib/system/system-messages.ts`)

Added comprehensive logging to the `WorkflowHandler`:

```typescript
// Socket emission debugging
console.log(`[SYSTEM_MESSAGE] Emitting to channel key: ${channelKey}`);
console.log(`[SYSTEM_MESSAGE] Socket IO available:`, !!socketIo);
console.log(`[SYSTEM_MESSAGE] Message content length:`, systemContent.length);

// Normalized message structure
const messageToEmit = {
  ...systemMessage,
  _systemMetadata: { /* debugging info */ }
};
```

### 2. **Response Formatting Debugging** (`formatWorkflowResponse`)

Added detailed logging for n8n response processing:

```typescript
console.log(`[FORMAT_WORKFLOW_RESPONSE] Starting format for workflow: ${route.workflowId}`);
console.log(`[FORMAT_WORKFLOW_RESPONSE] Raw response:`, JSON.stringify(response, null, 2));
console.log(`[FORMAT_WORKFLOW_RESPONSE] Extracted message:`, message);
```

### 3. **Client-Side Socket Handler** (`hooks/use-chat-socket.ts`)

Added comprehensive message reception logging:

```typescript
console.log(`[USE_CHAT_SOCKET] Received message on key: ${addKey}`);
console.log(`[USE_CHAT_SOCKET] Message ID: ${message.id}`);
console.log(`[USE_CHAT_SOCKET] Message role: ${message.role}`);
console.log(`[USE_CHAT_SOCKET] Message content preview: ${message.content?.substring(0, 100)}...`);
```

### 4. **Message API Endpoint** (`pages/api/socket/messages/index.ts`)

Added socket availability and emission verification:

```typescript
console.log(`[MESSAGES_API] Socket IO available: ${!!res?.socket?.server?.io}`);
console.log(`[MESSAGES_API] ✅ User message emitted successfully`);
console.log(`[MESSAGES_API] Starting system message creation`);
```

## Expected Debug Output Flow

When a message is sent and processed, you should see this sequence in the console:

1. **Message API** - User message creation and emission
2. **System Message Handler** - n8n workflow processing
3. **Format Response** - n8n response parsing
4. **Socket Emission** - System message emission attempt
5. **Client Socket** - Message reception (if successful)

## Testing Steps

1. **Send a message** that triggers n8n workflow
2. **Check browser console** for client-side logs
3. **Check server logs** for backend processing
4. **Look for gaps** in the log sequence to identify where the flow breaks

## Common Failure Points

### If you see logs up to "Socket emission completed" but no client reception:
- Socket instance mismatch between server and client
- Channel key mismatch
- Client not properly listening to the channel

### If you see "No response received from n8n workflow":
- n8n webhook timeout
- n8n workflow configuration issues
- Network connectivity problems

### If you see response parsing errors:
- n8n returning unexpected response structure
- Missing fields in workflow response
- Array vs object response format issues

## Next Steps

1. **Run the application** with these debugging improvements
2. **Send a test message** to trigger the workflow
3. **Analyze the console output** to identify where the flow breaks
4. **Based on the logs**, we can pinpoint the exact issue and apply targeted fixes

## Key Files Modified

- `lib/system/system-messages.ts` - Server-side message handling
- `hooks/use-chat-socket.ts` - Client-side socket reception
- `pages/api/socket/messages/index.ts` - Message API endpoint

The debugging logs will help us identify whether the issue is:
- Socket connection/emission
- Message structure/parsing
- Client-side reception/processing
- n8n workflow response format

## Enhanced Message Search Tool Fix

### Issue Identified
The original `DB_View_Latest_Messages` tool was too generic - it only retrieved the latest 20 messages regardless of content type. When users asked for "recent photos" or "image attachments", the AI couldn't specifically filter for images.

### Solution Implemented
Replaced the generic tool with `Search_Messages_And_Files` - an intelligent search tool that:

**🔍 Key Features:**
- **File Type Filtering**: Can specifically search for 'image', 'document', 'video', 'audio', or 'any' file types
- **Content Matching**: Searches both message content and file URLs
- **Smart Detection**: Automatically detects when users are looking for attachments
- **Detailed Results**: Shows file names, URLs, content previews, and timestamps

**📂 SQL Query Logic:**
```sql
-- Example: Finding image attachments
SELECT id, content, fileUrl, memberId, channelId, createdAt,
  CASE 
    WHEN fileUrl LIKE '%.jpg' OR fileUrl LIKE '%.jpeg' OR fileUrl LIKE '%.png' 
         OR fileUrl LIKE '%.gif' OR fileUrl LIKE '%.webp' THEN 'image'
    WHEN fileUrl LIKE '%.pdf' OR fileUrl LIKE '%.doc' THEN 'document'
    WHEN fileUrl IS NOT NULL THEN 'file'
    ELSE 'text'
  END as content_type
FROM message 
WHERE (fileUrl LIKE "%.jpg" OR fileUrl LIKE "%.jpeg" OR fileUrl LIKE "%.png" 
       OR fileUrl LIKE "%.gif" OR fileUrl LIKE "%.webp")
ORDER BY createdAt DESC 
LIMIT 20
```

**🎯 Usage Examples:**
- "Find recent photos" → `file_type: 'image'`
- "Show image attachments" → `file_type: 'image'`
- "Last five image uploads" → `file_type: 'image', limit: 5`
- "Search for PDF files" → `file_type: 'document'`

### Test Results Expected
With the enhanced tool, the AI should now be able to:
1. ✅ Find actual image attachments from the database
2. ✅ Display file names and upload dates
3. ✅ Show clickable URLs to the images
4. ✅ Provide relevant search results for file queries

This fix addresses the core issue where the workflow was working but couldn't find specific content types. 