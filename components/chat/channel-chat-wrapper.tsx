"use client";

import { useState, useCallback } from "react";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { Member } from "@prisma/client";

interface SearchFilters {
  query: string;
  fileTypes: string[];
  dateRange: string;
  hasFiles: boolean;
  fromCurrentUser: boolean;
}

interface ChannelChatWrapperProps {
  member: Member;
  channel: {
    id: string;
    name: string;
    serverId: string;
  };
}

export const ChannelChatWrapper = ({
  member,
  channel,
}: ChannelChatWrapperProps) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: "",
    fileTypes: [],
    dateRange: "all",
    hasFiles: false,
    fromCurrentUser: false,
  });
  const [searchState, setSearchState] = useState({
    isSearching: false,
    messageCount: 0,
    filteredCount: 0,
  });

  const handleSearchChange = useCallback((filters: SearchFilters) => {
    setSearchFilters(filters);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchFilters({
      query: "",
      fileTypes: [],
      dateRange: "all",
      hasFiles: false,
      fromCurrentUser: false,
    });
  }, []);

  const handleSearchStateChange = useCallback((isSearching: boolean, messageCount: number, filteredCount: number) => {
    setSearchState({ isSearching, messageCount, filteredCount });
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Scrollable Messages Area */}
      <div className="flex-1 min-h-0">
        <ChatMessages
          member={member}
          name={channel.name}
          chatId={channel.id}
          type="channel"
          apiUrl="/api/messages"
          socketUrl="/api/socket/messages"
          socketQuery={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
          paramKey="channelId"
          paramValue={channel.id}
          searchFilters={searchFilters}
          onSearchStateChange={handleSearchStateChange}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      </div>
      
      {/* Fixed Footer */}
      <div className="flex-shrink-0">
        <ChatInput
          apiUrl="/api/socket/messages"
          name={channel.name}
          type="channel"
          query={{ channelId: channel.id, serverId: channel.serverId }}
        />
      </div>
    </div>
  );
}; 