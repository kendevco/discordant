"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic refetching to prevent conflicts with socket updates
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
        
        // Improved retry logic
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Only retry up to 2 times for server errors
          return failureCount < 2;
        },
        
        // Progressive retry delay
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        
        // Network error handling
        networkMode: 'online',
      },
      mutations: {
        retry: 1,
        networkMode: 'online',
      },
    },
  }));

  // Clear cache when user authentication changes
  useEffect(() => {
    const userId = user?.id;
    
    // Store the previous user ID to detect changes
    const previousUserId = queryClient.getQueryData(['current-user-id']);
    
    if (previousUserId && previousUserId !== userId) {
      // User changed (logout/login) - clear all cache
      console.log('[QUERY_PROVIDER] User authentication changed, clearing all cache');
      queryClient.clear();
    }
    
    // Update stored user ID
    queryClient.setQueryData(['current-user-id'], userId);
  }, [user?.id, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
