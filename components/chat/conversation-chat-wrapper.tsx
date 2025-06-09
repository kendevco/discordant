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

interface ConversationChatWrapperProps {
  member: Member;
  conversation: {
    id: string;
    memberOne: {
      id: string;
      profile: {
        id: string;
        name: string;
        imageUrl: string;
      };
    };
    memberTwo: {
      id: string;
      profile: {
        id: string;
        name: string;
        imageUrl: string;
      };
    };
  };
  otherMember: {
    id: string;
    profile: {
      id: string;
      name: string;
      imageUrl: string;
    };
  };
  serverId: string;
}

export const ConversationChatWrapper = ({
  member,
  conversation,
  otherMember,
  serverId,
}: ConversationChatWrapperProps) => {
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
          name={otherMember.profile.name}
          chatId={conversation.id}
          type="conversation"
          apiUrl="/api/direct-messages"
          socketUrl="/api/socket/direct-messages"
          socketQuery={{
            conversationId: conversation.id,
          }}
          paramKey="conversationId"
          paramValue={conversation.id}
          searchFilters={searchFilters}
          onSearchStateChange={handleSearchStateChange}
          onSearchChange={handleSearchChange}
          onClearSearch={handleClearSearch}
        />
      </div>
      
      {/* Fixed Footer */}
      <div className="flex-shrink-0">
        <ChatInput
          apiUrl="/api/socket/direct-messages"
          name={otherMember.profile.name}
          type="conversation"
          query={{ conversationId: conversation.id }}
        />
      </div>
    </div>
  );
}; 