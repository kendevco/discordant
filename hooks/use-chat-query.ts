// /hooks/use-chat-query.ts

"use client";
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  paramKey,
  apiUrl,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    try {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

    if (!res.ok) {
        // Provide specific error messages for different status codes
        switch (res.status) {
          case 404:
            throw new Error('Messages not found. The channel may have been deleted.');
          case 403:
            throw new Error('Access denied. You may not have permission to view these messages.');
          case 429:
            throw new Error('Too many requests. Please wait a moment and try again.');
          case 500:
            throw new Error('Server error. Please try refreshing the page.');
          default:
            throw new Error(`Failed to fetch messages (${res.status}). Please try again.`);
    }
      }

    const data = await res.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format received from server.');
      }

    return data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please check your connection and try again.');
        }
        // Re-throw known errors
        throw error;
      }
      // Handle unknown errors
      throw new Error('An unexpected error occurred while loading messages.');
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status, error } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: undefined,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      
      // Enhanced error handling and network resilience
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
      
      // Only refetch if socket is disconnected
      refetchInterval: isConnected ? false : 30000, // 30 seconds when disconnected
      refetchOnWindowFocus: false,
      refetchOnReconnect: isConnected,
      
      // Improved retry strategy
      retry: (failureCount, error: any) => {
        // Don't retry on client errors (4xx) 
        if (error?.message?.includes('403') || error?.message?.includes('404')) {
          return false;
        }
        // Don't retry timeout errors immediately
        if (error?.message?.includes('timed out')) {
          return failureCount < 1;
        }
        // Retry server errors up to 2 times
        return failureCount < 2;
      },
      
      // Progressive retry delay with jitter
      retryDelay: (attemptIndex) => {
        const baseDelay = Math.min(1000 * 2 ** attemptIndex, 30000);
        const jitter = Math.random() * 1000; // Add randomness to prevent thundering herd
        return baseDelay + jitter;
      },
      
      // Network mode handling
      networkMode: 'online',
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  };
};
