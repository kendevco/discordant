// src/components/chat/chat-messages.tsx
"use client";
import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useMessageFilter } from "@/hooks/use-message-filter";
import { SearchBar } from "./search-bar";
import { Loader2, ServerCrash } from "lucide-react";
import { ElementRef, useRef, useState, useEffect } from "react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useUser } from "@clerk/nextjs";

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

interface SearchFilters {
  query: string;
  fileTypes: string[];
  dateRange: string;
  hasFiles: boolean;
  fromCurrentUser: boolean;
}

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
  searchFilters?: SearchFilters;
  onSearchStateChange?: (isSearching: boolean, messageCount: number, filteredCount: number) => void;
  onSearchChange?: (filters: SearchFilters) => void;
  onClearSearch?: () => void;
}

const isMessageUpdated = (updatedAt: Date, createdAt: Date) => {
  // Format to minute precision to ignore milliseconds
  return format(new Date(updatedAt), 'yyyyMMddHHmm') !==
    format(new Date(createdAt), 'yyyyMMddHHmm');
};

export const ChatMessages = ({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
  searchFilters: externalSearchFilters,
  onSearchStateChange,
  onSearchChange,
  onClearSearch,
}: ChatMessagesProps) => {
  const { user } = useUser();
  const [internalSearchFilters, setInternalSearchFilters] = useState<SearchFilters>({
    query: "",
    fileTypes: [],
    dateRange: "all",
    hasFiles: false,
    fromCurrentUser: false,
  });

  // Use external search filters if provided, otherwise use internal
  const searchFilters = externalSearchFilters || internalSearchFilters;

  const queryKey = `chat:${chatId}`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  // Flatten all messages from all pages
  const allMessages = data?.pages?.flatMap((page) => page.items) ?? [];

  // Filter messages using our custom hook
  const { filteredMessages, totalCount, filteredCount, isFiltering } = useMessageFilter(
    allMessages,
    {
      query: searchFilters.query,
      fileTypes: searchFilters.fileTypes as any[], // Type conversion needed
      dateRange: searchFilters.dateRange,
      hasFiles: searchFilters.hasFiles,
      fromCurrentUser: searchFilters.fromCurrentUser,
    },
    user?.id
  );

  // Notify parent component about search state
  useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(isFiltering, totalCount, filteredCount);
    }
  }, [isFiltering, totalCount, filteredCount, onSearchStateChange]);

  useChatSocket({ queryKey, addKey, updateKey });
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage && !isFiltering, // Don't load more when filtering
    count: isFiltering ? filteredCount : totalCount,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-400">Loading messages...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-400">Something went wrong!</p>
      </div>
    );
  }

  // Determine which messages to display
  const messagesToDisplay = isFiltering ? filteredMessages : allMessages;

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
      {/* Search Bar positioned over the messages */}
      {onSearchChange && onClearSearch && (
        <div className="absolute top-4 left-4 right-4 z-10 flex justify-end">
          <SearchBar
            onSearchChange={onSearchChange}
            onClearSearch={onClearSearch}
            messageCount={totalCount}
            filteredCount={filteredCount}
          />
        </div>
      )}
      <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
        {!hasNextPage && !isFiltering && <div className="flex-1" />}
        {!hasNextPage && !isFiltering && <ChatWelcome type={type} name={name} />}
        
        {/* Show filtering info */}
        {isFiltering && (
          <div className="flex justify-center mb-4">
            <div className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full">
              Showing {filteredCount} of {totalCount} messages
              {searchFilters.query && (
                <span className="ml-1 text-white/90">for "{searchFilters.query}"</span>
              )}
            </div>
          </div>
        )}
        
        {hasNextPage && !isFiltering && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 my-4">
                <Loader2 className="h-4 w-4 text-zinc-500 animate-spin" />
                <span className="text-xs text-zinc-500">Loading messages...</span>
              </div>
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition hover:bg-white/10 px-3 py-1 rounded"
              >
                Load previous messages
              </button>
            )}
          </div>
        )}
        
        <div className="flex flex-col-reverse mt-auto">
          {messagesToDisplay.map((message: MessageWithMemberWithProfile, index: number) => (
            <ChatItem
              key={message.id}
              id={message.id}
              currentMember={member}
              member={message.member}
              content={message.content}
              fileUrl={message.fileUrl}
              deleted={message.deleted}
              timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
              isUpdated={isMessageUpdated(message.updatedAt, message.createdAt)}
              socketUrl={socketUrl}
              socketQuery={socketQuery}
              isLast={index === messagesToDisplay.length - 1}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

// Export the search handlers interface for use in parent components
export interface ChatMessagesRef {
  handleSearchChange: (filters: SearchFilters) => void;
  handleClearSearch: () => void;
  searchState: {
    isFiltering: boolean;
    totalCount: number;
    filteredCount: number;
  };
}
