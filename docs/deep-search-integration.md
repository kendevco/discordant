# Deep Search Integration Guide

## Overview
The deep search capability allows your assistant to search through:
- Chat messages
- File attachments
- Calendar events (when implemented)
- External data sources (extensible)

## Features

### Search Depths
- **Shallow**: Quick message search only
- **Medium**: Messages + file attachments
- **Deep**: All sources including calendar and external APIs

### Relevance Scoring
- Exact phrase matches score highest
- Individual word matches accumulate points
- Position in content affects score
- Results sorted by relevance

## Integration with n8n

### 1. Add the Search Tool to Your Workflow

Copy the node configuration from `docs/n8n-search-tool.json` and add it to your workflow:

1. In n8n, click "Add Node"
2. Choose "HTTP Request" 
3. Configure with these settings:
   - URL: `{{ $env.NEXT_PUBLIC_APP_URL }}/api/search`
   - Method: POST
   - Add as AI Tool for your agent

### 2. Connect to AI Agent

Add this tool connection to your workflow:
```json
"Deep_Search": {
  "ai_tool": [
    [
      {
        "node": "AI Agent",
        "type": "ai_tool",
        "index": 0
      }
    ]
  ]
}
```

### 3. Update AI Agent System Message

Add search capabilities to your system prompt:

```
You have access to a deep search tool that can find information across:
- All chat messages
- Uploaded files and documents
- Historical conversations

When users ask to find, search, or locate information, use the Deep_Search tool with:
- Search_Query: What to search for
- Search_Depth: shallow/medium/deep based on need
- Max_Results: Usually 10, but can be more for comprehensive searches

Format search results clearly with:
- Source type (message/file)
- Author and timestamp
- Relevant excerpt
- Channel/context
```

## Usage Examples

### Basic Search
User: "Search for messages about the budget meeting"

AI uses tool with:
- query: "budget meeting"
- searchDepth: "medium"
- maxResults: 10

### Date-Filtered Search
User: "Find all files from last week"

AI uses tool with:
- query: "*"
- searchDepth: "medium"
- startDate: (calculated date)
- endDate: (today)

### Deep Research
User: "Find everything related to Project Alpha"

AI uses tool with:
- query: "Project Alpha"
- searchDepth: "deep"
- maxResults: 50

## Response Formatting

The search API returns:
```json
{
  "query": "search terms",
  "results": [
    {
      "id": "message-id",
      "type": "message",
      "content": "Full content",
      "excerpt": "...relevant part...",
      "metadata": {
        "channelName": "general",
        "userName": "John Doe",
        "timestamp": "2025-05-31T...",
        "relevanceScore": 85
      }
    }
  ],
  "totalCount": 25,
  "searchTime": 234,
  "sources": ["messages", "files"]
}
```

## Extending Search Capabilities

### Add Calendar Search
Update `searchCalendarEvents` in `deep-search.ts` to call your n8n calendar workflow

### Add External APIs
1. Create new search method in `DeepSearchEngine`
2. Add to search depth logic
3. Format results to match `SearchResult` interface

### Add Semantic Search
1. Integrate vector database (Pinecone, Weaviate, etc.)
2. Generate embeddings for messages
3. Add similarity search option

## Security Considerations

- Search respects user permissions
- Only returns content user has access to
- Audit trail via console logs
- Rate limiting recommended for production 