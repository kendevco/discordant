import { NextRequest, NextResponse } from "next/server";
import { DeepSearchEngine, SearchQuery } from "@/lib/system/deep-search";
import { currentProfile } from "@/lib/current-profile";

export async function POST(request: NextRequest) {
  try {
    // Get current user for authorization
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await request.json();
    
    // Build search query
    const searchQuery: SearchQuery = {
      query: body.query || "",
      filters: {
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        channelIds: body.channelIds,
        userIds: body.userIds,
        fileTypes: body.fileTypes,
        messageTypes: body.messageTypes
      },
      options: {
        maxResults: body.maxResults || 10,
        includeContext: body.includeContext || false,
        searchDepth: body.searchDepth || 'medium'
      }
    };

    // Validate query
    if (!searchQuery.query || searchQuery.query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    console.log(`[SEARCH_API] Performing search:`, {
      query: searchQuery.query,
      depth: searchQuery.options?.searchDepth,
      user: profile.name
    });

    // Perform the search
    const results = await DeepSearchEngine.search(searchQuery);

    console.log(`[SEARCH_API] Search completed:`, {
      query: searchQuery.query,
      resultCount: results.totalCount,
      searchTime: results.searchTime,
      sources: results.sources
    });

    // Return the results
    return NextResponse.json(results);

  } catch (error) {
    console.error("[SEARCH_API] Error:", error);
    
    return NextResponse.json({
      error: "Search failed",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "Search API endpoint active",
    endpoint: "/api/search",
    method: "POST",
    requiredFields: ["query"],
    optionalFields: [
      "searchDepth",
      "maxResults", 
      "startDate",
      "endDate",
      "channelIds",
      "userIds",
      "fileTypes"
    ]
  });
} 