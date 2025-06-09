"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, X, Filter, Clock, Users, Activity } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/ui/date-picker";
import { useDebounce } from "@/hooks/use-debounce";
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

interface ChatSearchProps {
  isOpen: boolean;
  onClose: () => void;
  channelId?: string;
  conversationId?: string;
  onResultClick: (messageId: string, channelId?: string, conversationId?: string) => void;
}

const FILE_TYPES: { label: string; value: FileType }[] = [
  { label: "Images", value: "IMAGE" },
  { label: "Documents", value: "DOCUMENT" },
  { label: "Videos", value: "VIDEO" },
  { label: "Audio", value: "AUDIO" },
  { label: "PDFs", value: "PDF" },
];

const ACTIVITY_TYPES: { label: string; value: ActivityType }[] = [
  { label: "Messages", value: "MESSAGE_SENT" },
  { label: "Files", value: "FILE_UPLOADED" },
  { label: "Voice", value: "VOICE_JOINED" },
  { label: "Channel Activity", value: "CHANNEL_JOINED" },
  { label: "Typing", value: "TYPING_STARTED" },
];

const ONLINE_STATUS_OPTIONS: { label: string; value: OnlineStatus; color: string }[] = [
  { label: "Online", value: "ONLINE", color: "bg-green-500" },
  { label: "Away", value: "AWAY", color: "bg-yellow-500" },
  { label: "Do Not Disturb", value: "DO_NOT_DISTURB", color: "bg-red-500" },
  { label: "Offline", value: "OFFLINE", color: "bg-gray-500" },
];

export function ChatSearch({ isOpen, onClose, channelId, conversationId, onResultClick }: ChatSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResultWithActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (!isOpen) {
          // This would need to be handled by parent component
          // For now, we'll just focus the search if already open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Enhanced filter state
  const [selectedFileTypes, setSelectedFileTypes] = useState<FileType[]>([]);
  const [selectedActivityTypes, setSelectedActivityTypes] = useState<ActivityType[]>([]);
  const [selectedOnlineStatus, setSelectedOnlineStatus] = useState<OnlineStatus[]>([]);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [onlyActiveMembers, setOnlyActiveMembers] = useState(false);
  const [recentActivityHours, setRecentActivityHours] = useState<number>(24);
  const [sortByActivity, setSortByActivity] = useState(false);
  const [includeOfflineMembers, setIncludeOfflineMembers] = useState(true);

  const debouncedQuery = useDebounce(searchQuery, 300);

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
          activityTypes: selectedActivityTypes.length > 0 ? selectedActivityTypes : undefined,
          onlineStatus: selectedOnlineStatus.length > 0 ? selectedOnlineStatus : undefined,
          activeMembers: onlyActiveMembers || undefined,
          recentActivity: onlyActiveMembers ? recentActivityHours : undefined,
        },
        presence: {
          includeOfflineMembers,
          sortByActivity,
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
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [
    channelId, 
    selectedFileTypes, 
    selectedActivityTypes, 
    selectedOnlineStatus,
    dateFrom, 
    dateTo, 
    onlyActiveMembers, 
    recentActivityHours,
    sortByActivity,
    includeOfflineMembers
  ]);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const handleResultClick = (result: SearchResultWithActivity) => {
    onResultClick(
      result.id,
      result.channelId,
      result.conversationId
    );
    onClose();
  };

  const clearFilters = () => {
    setSelectedFileTypes([]);
    setSelectedActivityTypes([]);
    setSelectedOnlineStatus([]);
    setDateFrom(undefined);
    setDateTo(undefined);
    setOnlyActiveMembers(false);
    setRecentActivityHours(24);
    setSortByActivity(false);
    setIncludeOfflineMembers(true);
  };

  const hasActiveFilters = selectedFileTypes.length > 0 || 
    selectedActivityTypes.length > 0 || 
    selectedOnlineStatus.length > 0 ||
    dateFrom || dateTo || onlyActiveMembers || !includeOfflineMembers || sortByActivity;

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

  const getStatusColor = (status: OnlineStatus) => {
    const statusOption = ONLINE_STATUS_OPTIONS.find(s => s.value === status);
    return statusOption?.color || "bg-gray-500";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Enhanced Search
            {hasActiveFilters && (
              <Badge variant="secondary" className="ml-2">
                {selectedFileTypes.length + selectedActivityTypes.length + selectedOnlineStatus.length + 
                (dateFrom ? 1 : 0) + (dateTo ? 1 : 0) + (onlyActiveMembers ? 1 : 0) + 
                (!includeOfflineMembers ? 1 : 0) + (sortByActivity ? 1 : 0)} filters
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search messages, files, and member activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Enhanced Filters Panel */}
        {showFilters && (
          <div className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
            {/* File Types */}
            <div>
              <h4 className="font-medium mb-2">File Types</h4>
              <div className="flex flex-wrap gap-2">
                {FILE_TYPES.map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedFileTypes.includes(type.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedFileTypes([...selectedFileTypes, type.value]);
                        } else {
                          setSelectedFileTypes(selectedFileTypes.filter(t => t !== type.value));
                        }
                      }}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Member Activity Types */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Activity Types
              </h4>
              <div className="flex flex-wrap gap-2">
                {ACTIVITY_TYPES.map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedActivityTypes.includes(type.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedActivityTypes([...selectedActivityTypes, type.value]);
                        } else {
                          setSelectedActivityTypes(selectedActivityTypes.filter(t => t !== type.value));
                        }
                      }}
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Online Status */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Member Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {ONLINE_STATUS_OPTIONS.map((status) => (
                  <label key={status.value} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedOnlineStatus.includes(status.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedOnlineStatus([...selectedOnlineStatus, status.value]);
                        } else {
                          setSelectedOnlineStatus(selectedOnlineStatus.filter(s => s !== status.value));
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${status.color}`} />
                      <span className="text-sm">{status.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Date Range
              </h4>
              <div className="flex gap-2">
                <DatePicker
                  date={dateFrom}
                  onDateChange={setDateFrom}
                  placeholder="From date"
                  className="flex-1"
                />
                <DatePicker
                  date={dateTo}
                  onDateChange={setDateTo}
                  placeholder="To date"
                  className="flex-1"
                />
              </div>
            </div>

            {/* Advanced Member Options */}
            <div>
              <h4 className="font-medium mb-2">Advanced Options</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={onlyActiveMembers}
                    onCheckedChange={(checked) => setOnlyActiveMembers(checked === true)}
                  />
                  <span className="text-sm">Only active members</span>
                </label>
                
                {onlyActiveMembers && (
                  <div className="ml-6">
                    <label className="text-sm">Active within (hours):</label>
                    <Input
                      type="number"
                      value={recentActivityHours}
                      onChange={(e) => setRecentActivityHours(Number(e.target.value))}
                      className="w-20 ml-2"
                      min="1"
                      max="168"
                    />
                  </div>
                )}

                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={sortByActivity}
                    onCheckedChange={(checked) => setSortByActivity(checked === true)}
                  />
                  <span className="text-sm">Sort by member activity</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={includeOfflineMembers}
                    onCheckedChange={(checked) => setIncludeOfflineMembers(checked === true)}
                  />
                  <span className="text-sm">Include offline members</span>
                </label>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-between pt-2 border-t">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
              <Badge variant="secondary">
                {results.length} results
              </Badge>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
            </div>
          ) : results.length > 0 ? (
            results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">
                        {result.author?.name || 'Unknown User'}
                      </span>
                      {result.memberActivity && (
                        <div className="flex items-center gap-1">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(result.memberActivity.onlineStatus)}`} />
                          <span className="text-xs text-gray-500">
                            {result.memberActivity.onlineStatus.toLowerCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-500">
                        in #{result.channelName}
                      </span>
                      {result.channelActivity && (
                        <Badge variant="outline" className="text-xs">
                          {result.channelActivity.activeMembers} active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                      {result.content}
                    </p>
                    {result.fileUrl && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {result.fileType}
                      </Badge>
                    )}
                    {result.memberActivity && result.memberActivity.recentActivities.length > 0 && (
                      <div className="mt-1 flex gap-1">
                        {result.memberActivity.recentActivities.slice(0, 3).map((activity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {activity.replace('_', ' ').toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(result.timestamp)}
                    </span>
                    {result.memberActivity && (
                      <div className="text-xs text-gray-400 mt-1">
                        Last active: {formatTimestamp(result.memberActivity.lastActivity)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : searchQuery.trim() || hasActiveFilters ? (
            <div className="text-center py-8 text-gray-500">
              No results found
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Start typing to search or use filters to explore
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 