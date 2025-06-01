import { db } from "@/lib/db";

export interface SearchQuery {
  query: string;
  filters?: {
    startDate?: Date;
    endDate?: Date;
    channelIds?: string[];
    userIds?: string[];
    fileTypes?: string[];
    messageTypes?: string[];
  };
  options?: {
    maxResults?: number;
    includeContext?: boolean;
    searchDepth?: 'shallow' | 'medium' | 'deep';
  };
}

export interface SearchResult {
  id: string;
  type: 'message' | 'file' | 'calendar' | 'document' | 'external';
  content: string;
  excerpt?: string;
  metadata: {
    channelId?: string;
    userId?: string;
    userName?: string;
    timestamp: Date;
    relevanceScore: number;
    source: string;
    [key: string]: any;
  };
  context?: {
    before?: string;
    after?: string;
  };
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalCount: number;
  searchTime: number;
  sources: string[];
}

export class DeepSearchEngine {
  /**
   * Perform a deep search across all available data sources
   */
  static async search(searchQuery: SearchQuery): Promise<SearchResponse> {
    const startTime = Date.now();
    const results: SearchResult[] = [];
    const sources: string[] = [];

    // Determine search depth
    const depth = searchQuery.options?.searchDepth || 'medium';
    
    // Always search messages
    const messageResults = await this.searchMessages(searchQuery);
    results.push(...messageResults);
    if (messageResults.length > 0) sources.push('messages');

    // Search files if depth is medium or deep
    if (depth !== 'shallow') {
      const fileResults = await this.searchFiles(searchQuery);
      results.push(...fileResults);
      if (fileResults.length > 0) sources.push('files');
    }

    // Search calendar events if depth is deep
    if (depth === 'deep') {
      const calendarResults = await this.searchCalendarEvents(searchQuery);
      results.push(...calendarResults);
      if (calendarResults.length > 0) sources.push('calendar');
    }

    // Sort by relevance score
    results.sort((a, b) => b.metadata.relevanceScore - a.metadata.relevanceScore);

    // Limit results if specified
    const maxResults = searchQuery.options?.maxResults || 50;
    const limitedResults = results.slice(0, maxResults);

    return {
      query: searchQuery.query,
      results: limitedResults,
      totalCount: results.length,
      searchTime: Date.now() - startTime,
      sources
    };
  }

  /**
   * Search through messages in the database
   */
  private static async searchMessages(searchQuery: SearchQuery): Promise<SearchResult[]> {
    const { query, filters } = searchQuery;
    
    // Build the where clause
    const whereConditions: any = {
      OR: [
        { content: { contains: query } }
      ]
    };

    // Apply filters
    if (filters?.channelIds?.length) {
      whereConditions.channelId = { in: filters.channelIds };
    }
    if (filters?.startDate) {
      whereConditions.createdAt = { ...whereConditions.createdAt, gte: filters.startDate };
    }
    if (filters?.endDate) {
      whereConditions.createdAt = { ...whereConditions.createdAt, lte: filters.endDate };
    }

    // Execute search
    const messages = await db.message.findMany({
      where: whereConditions,
      include: {
        member: {
          include: {
            profile: true
          }
        },
        channel: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    // Convert to search results
    return messages.map(msg => ({
      id: msg.id,
      type: 'message' as const,
      content: msg.content,
      excerpt: this.createExcerpt(msg.content, query),
      metadata: {
        channelId: msg.channelId,
        channelName: msg.channel.name,
        userId: msg.member.profile.id,
        userName: msg.member.profile.name,
        timestamp: msg.createdAt,
        relevanceScore: this.calculateRelevance(msg.content, query),
        source: 'database',
        messageRole: msg.role
      }
    }));
  }

  /**
   * Search through uploaded files
   */
  private static async searchFiles(searchQuery: SearchQuery): Promise<SearchResult[]> {
    const { query, filters } = searchQuery;
    
    // Search messages with file attachments
    const whereConditions: any = {
      fileUrl: { not: null },
      OR: [
        { content: { contains: query } },
        { fileUrl: { contains: query } }
      ]
    };

    // Apply filters
    if (filters?.fileTypes?.length) {
      whereConditions.fileUrl = {
        ...whereConditions.fileUrl,
        OR: filters.fileTypes.map(type => ({ endsWith: `.${type}` }))
      };
    }

    const fileMessages = await db.message.findMany({
      where: whereConditions,
      include: {
        member: {
          include: {
            profile: true
          }
        }
      },
      take: 50
    });

    return fileMessages.map(msg => ({
      id: msg.id,
      type: 'file' as const,
      content: msg.fileUrl!,
      excerpt: msg.content || 'File attachment',
      metadata: {
        channelId: msg.channelId,
        userId: msg.member.profile.id,
        userName: msg.member.profile.name,
        timestamp: msg.createdAt,
        relevanceScore: this.calculateRelevance(msg.content || msg.fileUrl!, query),
        source: 'files',
        fileUrl: msg.fileUrl!,
        fileType: this.getFileType(msg.fileUrl!)
      }
    }));
  }

  /**
   * Search calendar events (placeholder for n8n integration)
   */
  private static async searchCalendarEvents(searchQuery: SearchQuery): Promise<SearchResult[]> {
    // This would integrate with your n8n calendar workflow
    // For now, returning empty array
    console.log('[DEEP_SEARCH] Calendar search not yet implemented');
    return [];
  }

  /**
   * Calculate relevance score for a result
   */
  private static calculateRelevance(content: string, query: string): number {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/);
    
    let score = 0;
    
    // Exact match bonus
    if (lowerContent.includes(lowerQuery)) {
      score += 50;
    }
    
    // Individual word matches
    words.forEach(word => {
      if (lowerContent.includes(word)) {
        score += 10;
      }
    });
    
    // Position bonus (earlier matches score higher)
    const position = lowerContent.indexOf(lowerQuery);
    if (position !== -1) {
      score += Math.max(0, 20 - (position / 10));
    }
    
    return Math.min(100, score);
  }

  /**
   * Create an excerpt with query highlighting
   */
  private static createExcerpt(content: string, query: string, maxLength: number = 150): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const position = lowerContent.indexOf(lowerQuery);
    
    if (position === -1) {
      // Query not found, return beginning of content
      return content.length > maxLength 
        ? content.substring(0, maxLength) + '...'
        : content;
    }
    
    // Extract context around the match
    const start = Math.max(0, position - 50);
    const end = Math.min(content.length, position + query.length + 50);
    let excerpt = content.substring(start, end);
    
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt += '...';
    
    return excerpt;
  }

  /**
   * Get file type from URL
   */
  private static getFileType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase() || 'unknown';
    const typeMap: Record<string, string> = {
      'jpg': 'image',
      'jpeg': 'image',
      'png': 'image',
      'gif': 'image',
      'pdf': 'document',
      'doc': 'document',
      'docx': 'document',
      'txt': 'text',
      'mp3': 'audio',
      'mp4': 'video',
      'zip': 'archive'
    };
    
    return typeMap[extension] || extension;
  }
} 