import { NextRequest, NextResponse } from "next/server";
import { DeepSearchEngine, SearchQuery, EnhancedSearchFilters } from "@/lib/system/deep-search";
import { currentProfile } from "@/lib/current-profile";

export async function POST(req: Request) {
  try {
    const profile = await currentProfile();
    
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { filters, limit = 20 } = body;

    // Validate filters
    const searchFilters: EnhancedSearchFilters = {
      query: filters.query,
      channelIds: filters.channelIds,
      fileTypes: filters.fileTypes,
      dateRange: filters.dateRange ? {
        from: new Date(filters.dateRange.from),
        to: new Date(filters.dateRange.to)
      } : undefined,
      memberActivity: filters.memberActivity,
      presence: filters.presence,
    };

    const results = await DeepSearchEngine.searchWithActivity(searchFilters, limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("[SEARCH_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
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