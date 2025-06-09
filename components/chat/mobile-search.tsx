"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Filter, ArrowLeft, Workflow } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce";
import { WorkflowConfiguration } from "@/components/admin/workflow-configuration";
import { FileType, ActivityType, OnlineStatus } from "@prisma/client";

// Define the types locally to avoid importing server-side code
interface SearchResultWithActivity {
  id: string;
  type: 'message' | 'file' | 'calendar' | 'document' | 'external';
  content: string;
  excerpt?: string;
  metadata: {
    channelId?: string;
    userId?: string;
    userName?: string;
    timestamp: string | Date;
    relevanceScore: number;
    source: string;
    [key: string]: any;
  };
  context?: {
    before?: string;
    after?: string;
  };
  channelId?: string;
  conversationId?: string;
  channelName?: string;
  author?: {
    name: string;
    imageUrl?: string;
  };
  timestamp: string | Date;
  fileUrl?: string;
  fileType?: string;
  memberActivity?: {
    lastActivity: string | Date;
    onlineStatus: OnlineStatus;
    isCurrentlyOnline: boolean;
    recentActivities: ActivityType[];
  };
  channelActivity?: {
    recentMessages: number;
    activeMembers: number;
    lastActivity: string | Date;
  };
}

interface EnhancedSearchFilters {
  query?: string;
  channelIds?: string[];
  fileTypes?: FileType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  memberActivity?: {
    activityTypes?: ActivityType[];
    onlineStatus?: OnlineStatus[];
    activeMembers?: boolean;
    recentActivity?: number;
  };
  presence?: {
    includeOfflineMembers?: boolean;
    sortByActivity?: boolean;
  };
}

interface MobileSearchProps {
  isOpen: boolean;
  onClose: () => void;
  channelId?: string;
  conversationId?: string;
  serverId?: string;
  onResultClick: (messageId: string, channelId?: string, conversationId?: string) => void;
  // Integration with server search data
  serverMembers?: Array<{
    id: string;
    name: string;
    imageUrl?: string;
    role: string;
  }>;
  serverChannels?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export function MobileSearch({ 
  isOpen, 
  onClose, 
  channelId, 
  conversationId, 
  serverId,
  onResultClick,
  serverMembers = [],
  serverChannels = []
}: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResultWithActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showWorkflows, setShowWorkflows] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'members' | 'channels'>('messages');
  
  // Search filters
  const [selectedFileTypes, setSelectedFileTypes] = useState<FileType[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Enhanced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim() && selectedFileTypes.length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const filters: EnhancedSearchFilters = {
        query: query.trim() || undefined,
        channelIds: channelId ? [channelId] : undefined,
        fileTypes: selectedFileTypes.length > 0 ? selectedFileTypes : undefined,
        dateRange: dateFrom && dateTo ? { from: dateFrom, to: dateTo } : undefined,
        memberActivity: {
          activeMembers: true,
        },
        presence: {
          includeOfflineMembers: true,
          sortByActivity: false,
        },
      };

      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters,
          limit: 20
        }),
      });

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const searchResults = await response.json();
      setResults(searchResults);
    } catch (error) {
      console.error("Mobile search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [channelId, selectedFileTypes, dateFrom, dateTo]);

  useEffect(() => {
    if (activeTab === 'messages') {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch, activeTab]);

  // Filter server members based on search query
  const filteredMembers = serverMembers.filter(member =>
    member.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  // Filter server channels based on search query
  const filteredChannels = serverChannels.filter(channel =>
    channel.name.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  const handleResultClick = (result: SearchResultWithActivity) => {
    onResultClick(
      result.id,
      result.channelId,
      result.conversationId
    );
    onClose();
  };

  const handleMemberClick = (memberId: string) => {
    if (serverId) {
      window.location.href = `/servers/${serverId}/conversations/${memberId}`;
    }
    onClose();
  };

  const handleChannelClick = (channelId: string) => {
    if (serverId) {
      window.location.href = `/servers/${serverId}/channels/${channelId}`;
    }
    onClose();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  const clearFilters = () => {
    setSelectedFileTypes([]);
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const formatTimestamp = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
    if (diffDays < 7) return `${Math.floor(diffDays)}d ago`;
    return dateObj.toLocaleDateString();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="h-full w-full max-w-none m-0 p-0 border-none md:hidden">
          <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Mobile Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:text-zinc-300"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search messages, members, channels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  autoFocus
                />
              </div>
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="text-white hover:text-zinc-300"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWorkflows(true)}
                className="text-white hover:text-zinc-300"
              >
                <Workflow className="h-4 w-4" />
              </Button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b bg-gray-50 dark:bg-gray-800">
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'messages'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Messages
                {results.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {results.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('members')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'members'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Members
                {filteredMembers.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredMembers.length}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('channels')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                  activeTab === 'channels'
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-900'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                Channels
                {filteredChannels.length > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filteredChannels.length}
                  </Badge>
                )}
              </button>
            </div>

            {/* Search Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'messages' && (
                <div className="h-full flex flex-col">
                  {/* Quick Filters */}
                  {searchQuery && (
                    <div className="p-4 border-b">
                      <div className="flex gap-2 overflow-x-auto">
                        <button
                          onClick={() => setShowFilters(!showFilters)}
                          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                            showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <Filter className="w-3 h-3 mr-1 inline" />
                          Filters
                        </button>
                        <button
                          onClick={() => setSelectedFileTypes(prev =>
                            prev.includes(FileType.IMAGE) 
                              ? prev.filter(t => t !== FileType.IMAGE)
                              : [...prev, FileType.IMAGE]
                          )}
                          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                            selectedFileTypes.includes(FileType.IMAGE)
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          Images
                        </button>
                        <button
                          onClick={() => setSelectedFileTypes(prev =>
                            prev.includes(FileType.PDF)
                              ? prev.filter(t => t !== FileType.PDF)
                              : [...prev, FileType.PDF]
                          )}
                          className={`px-3 py-1 rounded-full text-xs whitespace-nowrap ${
                            selectedFileTypes.includes(FileType.PDF)
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          PDFs
                        </button>
                        {(selectedFileTypes.length > 0 || dateFrom || dateTo) && (
                          <button
                            onClick={clearFilters}
                            className="px-3 py-1 rounded-full text-xs whitespace-nowrap bg-red-100 text-red-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                      </div>
                    ) : results.length > 0 ? (
                      <div className="divide-y">
                        {results.map((result) => (
                          <div
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer"
                          >
                            <div className="flex items-start gap-3">
                              {result.author?.imageUrl ? (
                                <img
                                  src={result.author.imageUrl}
                                  alt={result.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-sm">
                                    {result.author?.name || 'Unknown'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(result.timestamp)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-900 dark:text-gray-100 mb-1">
                                  {result.excerpt}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">
                                    {result.channelName}
                                  </span>
                                  {result.fileType && (
                                    <Badge variant="outline" className="text-xs">
                                      {result.fileType}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : searchQuery.trim() ? (
                      <div className="text-center py-8 text-gray-500">
                        No messages found
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        Start typing to search messages
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'members' && (
                <div className="h-full overflow-y-auto">
                  {filteredMembers.length > 0 ? (
                    <div className="divide-y">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          onClick={() => handleMemberClick(member.id)}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            {member.imageUrl ? (
                              <img
                                src={member.imageUrl}
                                alt={member.name}
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                            )}
                            <div className="flex-1">
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-500">{member.role}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="text-center py-8 text-gray-500">
                      No members found
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Start typing to search members
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'channels' && (
                <div className="h-full overflow-y-auto">
                  {filteredChannels.length > 0 ? (
                    <div className="divide-y">
                      {filteredChannels.map((channel) => (
                        <div
                          key={channel.id}
                          onClick={() => handleChannelClick(channel.id)}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                              <span className="text-xs font-medium">#</span>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{channel.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{channel.type} Channel</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="text-center py-8 text-gray-500">
                      No channels found
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Start typing to search channels
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Workflow Configuration Modal */}
      <WorkflowConfiguration
        isOpen={showWorkflows}
        onClose={() => setShowWorkflows(false)}
        serverId={serverId}
        channelId={channelId}
      />
    </>
  );
} 