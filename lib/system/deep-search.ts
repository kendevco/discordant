import { db } from "@/lib/db";
import { FileType, ActivityType, OnlineStatus } from "@prisma/client";

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

export interface EnhancedSearchFilters {
  query?: string;
  channelIds?: string[];
  fileTypes?: FileType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  // New member activity filters
  memberActivity?: {
    activityTypes?: ActivityType[];
    onlineStatus?: OnlineStatus[];
    activeMembers?: boolean; // Only show results from currently active members
    recentActivity?: number; // Show results from members active in last X hours
  };
  // New presence filters
  presence?: {
    includeOfflineMembers?: boolean;
    onlyActiveChannels?: boolean; // Only channels with recent member activity
    sortByActivity?: boolean; // Sort results by member activity recency
  };
}

export interface SearchResultWithActivity extends SearchResult {
  // Additional properties for enhanced search results
  channelId?: string;
  conversationId?: string;
  channelName?: string;
  author?: {
    name: string;
    imageUrl?: string;
  };
  timestamp: Date;
  fileUrl?: string;
  fileType?: string;
  
  memberActivity?: {
    lastActivity: Date;
    onlineStatus: OnlineStatus;
    isCurrentlyOnline: boolean;
    recentActivities: ActivityType[];
  };
  channelActivity?: {
    recentMessages: number;
    activeMembers: number;
    lastActivity: Date;
  };
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
    
    // Build search conditions for files
    const whereConditions: any = {
      fileUrl: { not: null },
      OR: [
        { content: { contains: query } },
        { fileUrl: { contains: query } }
      ]
    };

    // Apply file type filters - handle both old and new UploadThing URLs
    if (filters?.fileTypes?.length) {
      const fileTypeConditions = [];
      
      // Traditional extension-based search (for old URLs)
      for (const type of filters.fileTypes) {
        fileTypeConditions.push({ fileUrl: { endsWith: `.${type}` } });
      }
      
      // Modern UploadThing URL detection (for new utfs.io URLs)
      if (filters.fileTypes.includes('jpg') || filters.fileTypes.includes('jpeg') || 
          filters.fileTypes.includes('png') || filters.fileTypes.includes('gif') || 
          filters.fileTypes.includes('webp')) {
        // Add UploadThing image detection patterns
        fileTypeConditions.push(
          { fileUrl: { contains: 'utfs.io' } },
          { fileUrl: { contains: 'uploadthing.com' } }
        );
      }
      
      if (filters.fileTypes.includes('pdf')) {
        fileTypeConditions.push({ fileUrl: { contains: '.pdf' } });
      }
      
      whereConditions.AND = [
        { fileUrl: { not: null } },
        { OR: fileTypeConditions }
      ];
    }

    // Apply date filters
    if (filters?.startDate || filters?.endDate) {
      whereConditions.createdAt = {};
      if (filters.startDate) {
        whereConditions.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        whereConditions.createdAt.lte = filters.endDate;
      }
    }

    // Apply channel filters
    if (filters?.channelIds?.length) {
      whereConditions.channelId = { in: filters.channelIds };
    }

    const fileMessages = await db.message.findMany({
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
      take: 50
    });

        return fileMessages.map(msg => ({
      id: msg.id,
      type: 'file' as const,
      content: msg.fileUrl!,
      excerpt: msg.content || 'File attachment',
      metadata: {
        channelId: msg.channelId,
        channelName: msg.channel.name,
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
      'webp': 'image',
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

  /**
   * Detect file type with enhanced logic for modern URLs
   */
  private static detectFileType(fileUrl: string): string {
    // First try traditional extension detection
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const documentTypes = ['pdf', 'doc', 'docx', 'txt'];
    const videoTypes = ['mp4', 'mov', 'avi'];
    const audioTypes = ['mp3', 'wav', 'ogg'];

    if (imageTypes.includes(extension || '')) return 'image';
    if (documentTypes.includes(extension || '')) return 'document';
    if (videoTypes.includes(extension || '')) return 'video';
    if (audioTypes.includes(extension || '')) return 'audio';
    
    // Handle modern UploadThing URLs without extensions
    if (fileUrl.includes('utfs.io') || fileUrl.includes('uploadthing.com')) {
      // For modern URLs, we assume images unless we have other context
      return 'image';
    }
    
    return 'file';
  }

  /**
   * Get file extensions for a given file type
   */
  private static getFileExtensions(fileType: FileType): string[] {
    switch (fileType) {
      case 'IMAGE':
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.tiff'];
      case 'PDF':
        return ['.pdf'];
      case 'VIDEO':
        return ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
      case 'AUDIO':
        return ['.mp3', '.wav', '.flac', '.aac', '.ogg'];
      case 'DOCUMENT':
        return ['.doc', '.docx', '.txt', '.rtf', '.odt'];
      default:
        return [];
    }
  }

  /**
   * Enhanced search with member activity and presence awareness
   */
  static async searchWithActivity(
    filters: EnhancedSearchFilters,
    limit: number = 20
  ): Promise<SearchResultWithActivity[]> {
    try {
      console.log('[DEEP_SEARCH] Enhanced search with activity filters:', filters);

      // Build base query conditions
      const where: any = {
        deleted: false,
      };

      // Add text search
      if (filters.query && filters.query.trim()) {
        where.content = {
          contains: filters.query.trim(),
        };
      }

      // Add channel filtering
      if (filters.channelIds && filters.channelIds.length > 0) {
        where.channelId = {
          in: filters.channelIds,
        };
      }

      // Add date range filtering
      if (filters.dateRange) {
        where.createdAt = {
          gte: filters.dateRange.from,
          lte: filters.dateRange.to,
        };
      }

      // Add file type filtering
      if (filters.fileTypes && filters.fileTypes.length > 0) {
        const fileConditions = [];
        
        for (const fileType of filters.fileTypes) {
          if (fileType === 'IMAGE') {
            fileConditions.push({
              OR: [
                { fileUrl: { contains: '.jpg' } },
                { fileUrl: { contains: '.jpeg' } },
                { fileUrl: { contains: '.png' } },
                { fileUrl: { contains: '.gif' } },
                { fileUrl: { contains: '.webp' } },
                { fileUrl: { contains: '.svg' } },
                { fileUrl: { contains: 'utfs.io' } },
                { fileUrl: { contains: 'uploadthing.com' } },
              ]
            });
          } else {
            // Handle other file types
            const extensions = this.getFileExtensions(fileType);
            if (extensions.length > 0) {
              fileConditions.push({
                OR: extensions.map(ext => ({ fileUrl: { contains: ext } }))
              });
            }
          }
        }

        if (fileConditions.length > 0) {
          where.AND = [
            { fileUrl: { not: null } },
            { OR: fileConditions }
          ];
        }
      }

      // Build member activity conditions
      let memberActivityWhere: any = {};
      if (filters.memberActivity) {
        if (filters.memberActivity.onlineStatus && filters.memberActivity.onlineStatus.length > 0) {
          memberActivityWhere.onlineStatus = {
            in: filters.memberActivity.onlineStatus,
          };
        }

        if (filters.memberActivity.activeMembers) {
          memberActivityWhere.isOnline = true;
        }

        if (filters.memberActivity.recentActivity) {
          const cutoffTime = new Date();
          cutoffTime.setHours(cutoffTime.getHours() - filters.memberActivity.recentActivity);
          memberActivityWhere.lastSeen = {
            gte: cutoffTime,
          };
        }
      }

      // Execute search with activity joins
      const messages = await db.message.findMany({
        where: {
          ...where,
          ...(Object.keys(memberActivityWhere).length > 0 ? {
            member: memberActivityWhere,
          } : {}),
        },
        include: {
          member: {
            include: {
              profile: true,
              activities: {
                where: filters.memberActivity?.activityTypes ? {
                  activityType: {
                    in: filters.memberActivity.activityTypes,
                  },
                } : undefined,
                orderBy: {
                  timestamp: 'desc',
                },
                take: 5,
              },
            },
          },
          channel: {
            include: {
              activities: {
                orderBy: {
                  timestamp: 'desc',
                },
                take: 3,
              },
            },
          },
          fileMetadata: true,
        },
        orderBy: filters.presence?.sortByActivity ? [
          {
            member: {
              lastSeen: 'desc',
            },
          },
          {
            createdAt: 'desc',
          },
        ] : {
          createdAt: 'desc',
        },
        take: limit,
      });

      // Also search direct messages with activity
      const directMessages = await db.directMessage.findMany({
        where: {
          deleted: false,
          ...(filters.query ? {
            content: {
              contains: filters.query.trim(),
            },
          } : {}),
          ...(filters.dateRange ? {
            createdAt: {
              gte: filters.dateRange.from,
              lte: filters.dateRange.to,
            },
          } : {}),
          ...(Object.keys(memberActivityWhere).length > 0 ? {
            member: memberActivityWhere,
          } : {}),
        },
        include: {
          member: {
            include: {
              profile: true,
              activities: {
                orderBy: {
                  timestamp: 'desc',
                },
                take: 5,
              },
            },
          },
          conversation: {
            include: {
              memberOne: {
                include: {
                  profile: true,
                },
              },
              memberTwo: {
                include: {
                  profile: true,
                },
              },
            },
          },
          fileMetadata: true,
        },
        orderBy: filters.presence?.sortByActivity ? [
          {
            member: {
              lastSeen: 'desc',
            },
          },
          {
            createdAt: 'desc',
          },
        ] : {
          createdAt: 'desc',
        },
        take: Math.floor(limit / 2),
      });

      // Get channel activity statistics
      const channelStats = new Map();
      for (const msg of messages) {
        if (!channelStats.has(msg.channelId)) {
          const stats = await this.getChannelActivityStats(msg.channelId);
          channelStats.set(msg.channelId, stats);
        }
      }

      // Transform messages to enhanced results
      const messageResults: SearchResultWithActivity[] = messages.map(msg => ({
        id: msg.id,
        content: msg.content,
        excerpt: this.createExcerpt(msg.content, filters.query || ''),
        type: 'message' as const,
        metadata: {
          channelId: msg.channelId,
          channelName: msg.channel.name,
          userId: msg.member.profile.id,
          userName: msg.member.profile.name,
          timestamp: msg.createdAt,
          relevanceScore: this.calculateRelevance(msg.content, filters.query || ''),
          source: 'database',
          fileUrl: msg.fileUrl || undefined,
          fileType: msg.fileMetadata?.fileType || this.detectFileType(msg.fileUrl || ''),
        },
        author: {
          name: msg.member.profile.name,
          imageUrl: msg.member.profile.imageUrl || undefined,
        },
        timestamp: msg.createdAt,
        channelId: msg.channelId,
        channelName: msg.channel.name,
        fileUrl: msg.fileUrl || undefined,
        fileType: msg.fileMetadata?.fileType || this.detectFileType(msg.fileUrl || ''),
        memberActivity: {
          lastActivity: msg.member.lastSeen,
          onlineStatus: msg.member.onlineStatus,
          isCurrentlyOnline: msg.member.isOnline,
          recentActivities: msg.member.activities.map(a => a.activityType),
        },
        channelActivity: channelStats.get(msg.channelId) || {
          recentMessages: 0,
          activeMembers: 0,
          lastActivity: new Date(),
        },
      }));

      // Transform direct messages to enhanced results
      const dmResults: SearchResultWithActivity[] = directMessages.map(dm => ({
        id: dm.id,
        content: dm.content,
        excerpt: this.createExcerpt(dm.content, filters.query || ''),
        type: 'message' as const,
        metadata: {
          conversationId: dm.conversationId,
          userId: dm.member.profile.id,
          userName: dm.member.profile.name,
          timestamp: dm.createdAt,
          relevanceScore: this.calculateRelevance(dm.content, filters.query || ''),
          source: 'database',
          fileUrl: dm.fileUrl || undefined,
          fileType: dm.fileMetadata?.fileType || this.detectFileType(dm.fileUrl || ''),
        },
        author: {
          name: dm.member.profile.name,
          imageUrl: dm.member.profile.imageUrl || undefined,
        },
        timestamp: dm.createdAt,
        conversationId: dm.conversationId,
        channelName: `DM with ${dm.conversation.memberOne.profile.name === dm.member.profile.name 
          ? dm.conversation.memberTwo.profile.name 
          : dm.conversation.memberOne.profile.name}`,
        fileUrl: dm.fileUrl || undefined,
        fileType: dm.fileMetadata?.fileType || this.detectFileType(dm.fileUrl || ''),
        memberActivity: {
          lastActivity: dm.member.lastSeen,
          onlineStatus: dm.member.onlineStatus,
          isCurrentlyOnline: dm.member.isOnline,
          recentActivities: dm.member.activities.map(a => a.activityType),
        },
      }));

      // Combine and sort results
      const allResults = [...messageResults, ...dmResults];
      
      if (filters.presence?.sortByActivity) {
        allResults.sort((a, b) => {
          // Prioritize online members
          if (a.memberActivity?.isCurrentlyOnline && !b.memberActivity?.isCurrentlyOnline) return -1;
          if (!a.memberActivity?.isCurrentlyOnline && b.memberActivity?.isCurrentlyOnline) return 1;
          
          // Then by recent activity
          const aActivity = a.memberActivity?.lastActivity.getTime() || 0;
          const bActivity = b.memberActivity?.lastActivity.getTime() || 0;
          if (aActivity !== bActivity) return bActivity - aActivity;
          
          // Finally by message timestamp
          return b.timestamp.getTime() - a.timestamp.getTime();
        });
      }

      console.log(`[DEEP_SEARCH] Found ${allResults.length} results with activity data`);
      return allResults.slice(0, limit);
    } catch (error) {
      console.error('[DEEP_SEARCH] Enhanced search error:', error);
      throw error;
    }
  }

  /**
   * Get channel activity statistics
   */
  private static async getChannelActivityStats(channelId: string) {
    try {
      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Get recent message count
      const recentMessages = await db.message.count({
        where: {
          channelId,
          createdAt: {
            gte: oneDayAgo,
          },
          deleted: false,
        },
      });

      // Get active members (who have sent messages recently)
      const activeMembers = await db.message.groupBy({
        by: ['memberId'],
        where: {
          channelId,
          createdAt: {
            gte: oneDayAgo,
          },
          deleted: false,
        },
      });

      // Get last activity timestamp
      const lastMessage = await db.message.findFirst({
        where: {
          channelId,
          deleted: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        recentMessages,
        activeMembers: activeMembers.length,
        lastActivity: lastMessage?.createdAt || new Date(0),
      };
    } catch (error) {
      console.error('[DEEP_SEARCH] Error getting channel stats:', error);
      return {
        recentMessages: 0,
        activeMembers: 0,
        lastActivity: new Date(0),
      };
    }
  }

  /**
   * Get member presence and activity summary
   */
  static async getMemberActivitySummary(serverId: string) {
    try {
      const members = await db.member.findMany({
        where: {
          serverId,
        },
        include: {
          profile: true,
          activities: {
            orderBy: {
              timestamp: 'desc',
            },
            take: 5,
          },
        },
        orderBy: [
          {
            isOnline: 'desc',
          },
          {
            lastSeen: 'desc',
          },
        ],
      });

      const summary = {
        online: members.filter(m => m.onlineStatus === 'ONLINE').length,
        away: members.filter(m => m.onlineStatus === 'AWAY').length,
        doNotDisturb: members.filter(m => m.onlineStatus === 'DO_NOT_DISTURB').length,
        offline: members.filter(m => m.onlineStatus === 'OFFLINE').length,
        total: members.length,
        recentlyActive: members.filter(m => {
          const oneHourAgo = new Date();
          oneHourAgo.setHours(oneHourAgo.getHours() - 1);
          return m.lastSeen >= oneHourAgo;
        }).length,
      };

      return {
        summary,
        members: members.map(m => ({
          id: m.id,
          name: m.profile.name,
          imageUrl: m.profile.imageUrl,
          onlineStatus: m.onlineStatus,
          lastSeen: m.lastSeen,
          isOnline: m.isOnline,
          recentActivities: m.activities.map(a => ({
            type: a.activityType,
            description: a.description,
            timestamp: a.timestamp,
          })),
        })),
      };
    } catch (error) {
      console.error('[DEEP_SEARCH] Error getting member activity summary:', error);
      throw error;
    }
  }
} 