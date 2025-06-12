"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, Filter, Calendar, File, Users, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/use-debounce";
import { FileType } from "@prisma/client";

interface InlineSearchProps {
  onSearchChange: (query: string, filters: SearchFilters) => void;
  onClearSearch: () => void;
  messageCount: number;
  filteredCount: number;
}

interface SearchFilters {
  query: string;
  fileTypes: string[]; // Changed from FileType[] to string[] for file extensions
  dateRange: string; // 'today', 'week', 'month', 'all'
  hasFiles: boolean;
  fromCurrentUser: boolean;
}

// Map file extensions to user-friendly labels
const FILE_TYPE_OPTIONS = [
  { label: "Images", extensions: ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"] },
  { label: "Documents", extensions: ["pdf", "doc", "docx", "txt", "rtf", "odt"] },
  { label: "Videos", extensions: ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"] },
  { label: "Audio", extensions: ["mp3", "wav", "flac", "aac", "ogg", "wma"] },
];

const DATE_RANGE_OPTIONS = [
  { label: "All time", value: "all" },
  { label: "Today", value: "today" },
  { label: "This week", value: "week" },
  { label: "This month", value: "month" },
];

export function InlineSearch({ onSearchChange, onClearSearch, messageCount, filteredCount }: InlineSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    fileTypes: [],
    dateRange: "all",
    hasFiles: false,
    fromCurrentUser: false,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Update filters when debounced query changes
  useEffect(() => {
    const newFilters = { ...filters, query: debouncedQuery };
    setFilters(newFilters);
    onSearchChange(debouncedQuery, newFilters);
  }, [debouncedQuery]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F or Cmd+F to open search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (!isExpanded) {
          setIsExpanded(true);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        }
      }
      
      // Ctrl+Shift+F to toggle filters
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        if (isExpanded) {
          setShowFilters(!showFilters);
        }
      }
      
      // Escape to close search
      if (e.key === 'Escape' && isExpanded) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, showFilters]);

  const handleOpen = () => {
    setIsExpanded(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setShowFilters(false);
    setSearchQuery("");
    const resetFilters = {
      query: "",
      fileTypes: [],
      dateRange: "all",
      hasFiles: false,
      fromCurrentUser: false,
    };
    setFilters(resetFilters);
    onClearSearch();
  };

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onSearchChange(searchQuery, newFilters);
  };

  const handleFileTypeToggle = (fileTypeGroup: typeof FILE_TYPE_OPTIONS[0], checked: boolean) => {
    let newFileTypes: string[];
    if (checked) {
      // Add all extensions from this group
      newFileTypes = [...new Set([...filters.fileTypes, ...fileTypeGroup.extensions])];
    } else {
      // Remove all extensions from this group
      newFileTypes = filters.fileTypes.filter(ext => !fileTypeGroup.extensions.includes(ext));
    }
    updateFilters({ fileTypes: newFileTypes });
  };

  const clearAllFilters = () => {
    const resetFilters = {
      query: searchQuery,
      fileTypes: [],
      dateRange: "all",
      hasFiles: false,
      fromCurrentUser: false,
    };
    setFilters(resetFilters);
    onSearchChange(searchQuery, resetFilters);
  };

  const hasActiveFilters = filters.fileTypes.length > 0 || 
    filters.dateRange !== "all" || 
    filters.hasFiles || 
    filters.fromCurrentUser;

  const isFiltering = searchQuery.trim() || hasActiveFilters;

  // Collapsed state - just a search icon
  if (!isExpanded) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleOpen}
          className="text-white hover:text-zinc-300 hover:bg-white/10 flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">Search</span>
        </Button>
        {isFiltering && (
          <Badge variant="secondary" className="text-xs">
            {filteredCount} of {messageCount}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-full">
      {/* Search Input Row */}
      <div className="flex items-center gap-2 bg-white/10 rounded-md px-3 py-2 backdrop-blur-sm">
        <Search className="h-4 w-4 text-white/70 flex-shrink-0" />
        <Input
          ref={searchInputRef}
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-none bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        
        {/* Results Count */}
        {isFiltering && (
          <Badge variant="secondary" className="text-xs flex-shrink-0">
            {filteredCount} of {messageCount}
          </Badge>
        )}

        {/* Filter Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex-shrink-0 text-white hover:text-zinc-300 hover:bg-white/10 ${showFilters ? 'bg-white/20' : ''}`}
        >
          <Filter className="h-3 w-3" />
          {hasActiveFilters && (
            <Badge variant="destructive" className="ml-1 text-xs h-4 w-4 p-0 flex items-center justify-center">
              {(filters.fileTypes.length > 0 ? 1 : 0) + (filters.dateRange !== "all" ? 1 : 0) + (filters.hasFiles ? 1 : 0) + (filters.fromCurrentUser ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {/* Minimize Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(false)}
          className="flex-shrink-0 text-white hover:text-zinc-300 hover:bg-white/10"
        >
          <ChevronUp className="h-3 w-3" />
        </Button>

        {/* Close Search */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="flex-shrink-0 text-white hover:text-zinc-300 hover:bg-white/10"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>

      {/* Filters Panel - Collapsible */}
      {showFilters && (
        <div className="mt-2 p-4 bg-white/10 rounded-md backdrop-blur-sm space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-white">Filters</h4>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-white/70 hover:text-white text-xs"
              >
                Clear all
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div>
              <label className="text-xs text-white/70 block mb-2">
                <Calendar className="h-3 w-3 inline mr-1" />
                Time Range
              </label>
              <Select value={filters.dateRange} onValueChange={(value) => updateFilters({ dateRange: value })}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Types */}
            <div>
              <label className="text-xs text-white/70 block mb-2">
                <File className="h-3 w-3 inline mr-1" />
                File Types
              </label>
              <div className="space-y-2">
                {FILE_TYPE_OPTIONS.map((fileTypeGroup) => {
                  const isChecked = fileTypeGroup.extensions.some(ext => filters.fileTypes.includes(ext));
                  return (
                    <div key={fileTypeGroup.label} className="flex items-center space-x-2">
                      <Checkbox
                        id={fileTypeGroup.label}
                        checked={isChecked}
                        onCheckedChange={(checked) => handleFileTypeToggle(fileTypeGroup, checked as boolean)}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
                      />
                      <label htmlFor={fileTypeGroup.label} className="text-xs text-white/90">
                        {fileTypeGroup.label}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="text-xs text-white/70 block mb-2">
                <Users className="h-3 w-3 inline mr-1" />
                Quick Filters
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasFiles"
                    checked={filters.hasFiles}
                    onCheckedChange={(checked) => updateFilters({ hasFiles: checked as boolean })}
                    className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
                  />
                  <label htmlFor="hasFiles" className="text-xs text-white/90">
                    Has attachments
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fromCurrentUser"
                    checked={filters.fromCurrentUser}
                    onCheckedChange={(checked) => updateFilters({ fromCurrentUser: checked as boolean })}
                    className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-purple-600"
                  />
                  <label htmlFor="fromCurrentUser" className="text-xs text-white/90">
                    My messages
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tips */}
          <div className="text-xs text-white/50 mt-2 hidden sm:block">
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs">Ctrl+F</kbd> Search • 
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs ml-1">Ctrl+Shift+F</kbd> Filters • 
            <kbd className="px-1 py-0.5 bg-white/20 rounded text-xs ml-1">Esc</kbd> Close
          </div>
        </div>
      )}
    </div>
  );
} 