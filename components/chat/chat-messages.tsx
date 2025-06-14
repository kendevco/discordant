// src/components/chat/chat-messages.tsx
"use client";
import { Member, Message, Profile } from "@prisma/client";
import { ChatWelcome } from "./chat-welcome";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useMessageFilter } from "@/hooks/use-message-filter";
import { SearchBar } from "./search-bar";
import { Loader2, ServerCrash, RefreshCw, AlertTriangle } from "lucide-react";
import React, { ElementRef, useRef, useState, useEffect } from "react";
import { ChatItem } from "./chat-item";
import { format } from "date-fns";
import { useChatScroll } from "@/hooks/use-chat-scroll";
import { useUser } from "@clerk/nextjs";
import { useErrorHandler } from "@/components/error-boundary";
import { ChatItemSkeleton } from "./chat-item-skeleton";
import { useSSEChannel } from "@/hooks/use-sse-channel";
import { useSSEConversation } from "@/hooks/use-sse-conversation";
import { useQueryClient } from "@tanstack/react-query";

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
  const { captureError } = useErrorHandler();
  const queryClient = useQueryClient();
  
  const [internalSearchFilters, setInternalSearchFilters] = useState<SearchFilters>({
    query: "",
    fileTypes: [],
    dateRange: "all",
    hasFiles: false,
    fromCurrentUser: false,
  });

  const [paginationError, setPaginationError] = useState<string | null>(null);

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
    error,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  // Handle query errors - distinguish between serious errors and pagination issues
  useEffect(() => {
    if (error) {
      console.error("Chat query error:", error);
      
      const isPaginationError = error.message.includes('400') || 
                                error.message.includes('cursor') ||
                                error.message.includes('pagination');
      
      if (isPaginationError) {
        // Handle pagination errors locally
        setPaginationError("Unable to load older messages. Please refresh the page.");
      } else {
        // Only serious errors go to error boundary
        captureError(error as Error);
      }
    } else {
      // Clear pagination error when query succeeds
      setPaginationError(null);
    }
  }, [error, captureError]);

  // Flatten all messages from all pages and deduplicate by ID
  const allMessages = React.useMemo(() => {
    try {
    const messages = data?.pages?.flatMap((page) => page.items) ?? [];
    // Deduplicate messages by ID to prevent duplicate keys
    const uniqueMessages = messages.reduce((acc, message) => {
      if (!acc.find((m: typeof message) => m.id === message.id)) {
        acc.push(message);
      }
      return acc;
    }, [] as typeof messages);
    return uniqueMessages;
    } catch (error) {
      console.error("Error processing messages:", error);
      captureError(error as Error);
      return [];
    }
  }, [data?.pages, captureError]);

  // Filter messages using our custom hook
  const { filteredMessages, totalCount, filteredCount, isFiltering } = useMessageFilter(
    allMessages,
    {
      query: searchFilters.query,
      fileTypes: searchFilters.fileTypes, // Now properly typed as string[]
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

  // Set up SSE for real-time updates based on type
  const channelSSE = useSSEChannel(
    type === "channel" ? paramValue : null,
    {
      autoRefresh: false, // NEVER auto-refresh, we handle updates manually
      onNewMessages: () => {
        // Invalidate and refetch the query when new messages arrive
        try {
          console.log(`[CHAT_MESSAGES] SSE detected new messages, refreshing query`);
          // More aggressive invalidation and refetch
          queryClient.invalidateQueries({ queryKey: [queryKey] });
          queryClient.refetchQueries({ queryKey: [queryKey] });
          
          // Also try to reset the query to force a fresh fetch
          setTimeout(() => {
            queryClient.resetQueries({ queryKey: [queryKey] });
          }, 100);
        } catch (error) {
          console.error("Error invalidating messages query:", error);
          // Fallback: force page refresh if query invalidation fails
          console.log("[CHAT_MESSAGES] Falling back to page refresh");
          window.location.reload();
        }
      }
    }
  );

  const conversationSSE = useSSEConversation(
    type === "conversation" ? paramValue : null,
    {
      autoRefresh: false, // NEVER auto-refresh, we handle updates manually
      onNewMessages: () => {
        // Invalidate and refetch the query when new messages arrive
        try {
          console.log(`[CHAT_MESSAGES] SSE detected new conversation messages, refreshing query`);
          // More aggressive invalidation and refetch
          queryClient.invalidateQueries({ queryKey: [queryKey] });
          queryClient.refetchQueries({ queryKey: [queryKey] });
          
          // Also try to reset the query to force a fresh fetch
          setTimeout(() => {
            queryClient.resetQueries({ queryKey: [queryKey] });
          }, 100);
        } catch (error) {
          console.error("Error invalidating messages query:", error);
          // Fallback: force page refresh if query invalidation fails
          console.log("[CHAT_MESSAGES] Falling back to page refresh");
          window.location.reload();
        }
      }
    }
  );

  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage && !isFiltering && !paginationError, // Don't load more when filtering or pagination error
    count: data?.pages?.[0]?.items?.length ?? 0,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <div className="w-full">
          <ChatItemSkeleton />
          <ChatItemSkeleton />
          <ChatItemSkeleton />
          <ChatItemSkeleton />
          <ChatItemSkeleton />
        </div>
      </div>
    );
  }

  if (status === "error" && !paginationError) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-6">
        <ServerCrash className="h-8 w-8 text-red-400 my-4" />
        <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Messages</h3>
        <p className="text-sm text-zinc-300 mb-4 text-center max-w-md">
          {error?.message || "There was a problem loading the conversation. This might be due to a network issue or server error."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </button>
          <button 
            onClick={() => window.history.back()} 
            className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white text-sm rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mt-4 p-3 bg-black/20 rounded text-xs text-zinc-400 font-mono max-w-md break-all">
            Error: {error.message}
          </div>
        )}
      </div>
    );
  }

  // Determine which messages to display
  const messagesToDisplay = isFiltering ? filteredMessages : allMessages;

  return (
    <div className="relative h-full flex flex-col bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
      {/* Search Bar positioned over the messages - mobile friendly */}
      {onSearchChange && onClearSearch && (
        <div className="absolute top-2 left-2 right-2 sm:top-4 sm:left-4 sm:right-4 z-10 flex justify-end">
          <SearchBar
            onSearchChange={onSearchChange}
            onClearSearch={onClearSearch}
            messageCount={totalCount}
            filteredCount={filteredCount}
          />
        </div>
      )}
      
      {/* SSE Connection Status and Manual Refresh */}
      <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
        {/* SSE Status Indicator */}
        <div className={`w-2 h-2 rounded-full ${
          (type === "channel" ? channelSSE.isConnected : conversationSSE.isConnected) 
            ? 'bg-green-400' 
            : 'bg-red-400'
        }`} title={`SSE ${(type === "channel" ? channelSSE.isConnected : conversationSSE.isConnected) ? 'Connected' : 'Disconnected'}`} />
        
        {/* Manual Refresh Button */}
        <button
          onClick={() => {
            console.log("[CHAT_MESSAGES] Manual refresh triggered");
            queryClient.invalidateQueries({ queryKey: [queryKey] });
            queryClient.refetchQueries({ queryKey: [queryKey] });
          }}
          className="p-1 text-white/60 hover:text-white/90 transition-colors"
          title="Refresh messages"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
      <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
        {!hasNextPage && !isFiltering && <div className="flex-1" />}
        {!hasNextPage && !isFiltering && <ChatWelcome type={type} name={name} />}
        
        {/* Show pagination error */}
        {paginationError && (
          <div className="flex justify-center mb-4">
            <div className="text-xs text-red-300 bg-red-500/20 px-3 py-2 rounded-md flex items-center gap-2">
              <AlertTriangle className="h-3 w-3" />
              {paginationError}
              <button 
                onClick={() => {
                  setPaginationError(null);
                  window.location.reload();
                }}
                className="ml-2 text-red-200 hover:text-white underline"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
        
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
        
        {hasNextPage && !isFiltering && !paginationError && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <div className="flex items-center gap-2 my-4">
                <Loader2 className="h-4 w-4 text-zinc-300 animate-spin" />
                <span className="text-xs text-zinc-300">Loading messages...</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  try {
                    fetchNextPage();
                  } catch (error) {
                    console.error("Error fetching next page:", error);
                    setPaginationError("Failed to load more messages. Please try again.");
                  }
                }}
                className="text-zinc-300 hover:text-zinc-200 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition hover:bg-white/10 px-3 py-1 rounded"
              >
                Load previous messages
              </button>
            )}
          </div>
        )}
        
        <div className="flex flex-col-reverse mt-auto">
          {messagesToDisplay.map((message: MessageWithMemberWithProfile, index: number) => (
            <ChatItem
              key={`${message.id}-${index}`}
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
