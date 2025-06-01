# Migration Steps: Google Services Agent → Discordant General Assistant

## Overview
Instead of creating a new workflow from scratch, we'll update your existing, proven Google Services Agent to become the Discordant General Assistant.

## Steps in n8n:

### 1. Update Webhook Configuration
- Open your Google Services Agent workflow
- Click on "Discordant Chat Webhook" node
- Change the path from `google-ai-services` to `assistant`
- Keep all CORS settings as they are

### 2. Rename the Workflow
- Go to workflow settings
- Change name from "Google Services Agent" to "Discordant General Assistant"

### 3. Update AI Agent System Message
Remove military-style "duty officer" references and make it more general:

```
You are a helpful AI assistant integrated with Discordant chat. You have access to:
- Calendar management (view, create, update, delete events)
- Database queries for message history
- Research and analysis capabilities

Current context:
- User: {{ $json.userName }}
- Time: {{ $json.timestamp }}
- Platform: Discordant

Respond naturally and professionally. Use the appropriate tools based on the user's request.
```

### 4. Keep All Existing Nodes
- ✅ Parse Chat Message (with all debug logging)
- ✅ Persistent Chat Memory
- ✅ All Calendar Tools
- ✅ DB_View_Latest_Messages
- ✅ Execution Data
- ✅ Format Chat Response
- ✅ All connections

## Code Updates:

### 1. Update workflow-router.ts
Already done - using simplified "assistant" webhook path

### 2. Test the Migration
```bash
# Run the test script
node test-workflow-response.js
```

## Benefits of This Approach:

1. **Proven Code**: Keep your battle-tested parsing and error handling
2. **No Data Loss**: All your execution history remains
3. **Gradual Migration**: Can run both webhooks during transition
4. **All Features**: Keep calendar, database, and future tools
5. **Easy Rollback**: Can revert webhook path if needed

## Legacy Support:

If needed, you can temporarily support both webhook paths:
1. Duplicate the webhook node
2. Set one to "google-ai-services" (legacy)
3. Set one to "assistant" (new)
4. Connect both to "Parse Chat Message"

This allows old integrations to continue working during migration. 