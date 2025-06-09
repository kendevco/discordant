"use client";

import { InlineSearch } from "./inline-search";

interface SearchFilters {
  query: string;
  fileTypes: string[];
  dateRange: string;
  hasFiles: boolean;
  fromCurrentUser: boolean;
}

interface SearchBarProps {
  onSearchChange: (filters: SearchFilters) => void;
  onClearSearch: () => void;
  messageCount: number;
  filteredCount: number;
}

export const SearchBar = ({
  onSearchChange,
  onClearSearch,
  messageCount,
  filteredCount,
}: SearchBarProps) => {
  const handleSearchChange = (query: string, filters: any) => {
    // Convert the filters to the expected format
    const searchFilters: SearchFilters = {
      query,
      fileTypes: filters.fileTypes || [],
      dateRange: filters.dateRange || "all",
      hasFiles: filters.hasFiles || false,
      fromCurrentUser: filters.fromCurrentUser || false,
    };

    onSearchChange(searchFilters);
  };

  return (
    <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
      <InlineSearch
        onSearchChange={handleSearchChange}
        onClearSearch={onClearSearch}
        messageCount={messageCount}
        filteredCount={filteredCount}
      />
    </div>
  );
}; 