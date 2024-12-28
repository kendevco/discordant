"use client";
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps {
  queryKey: string;
  paramKey: "channelId" | "conversationId";
  apiUrl: string;
  paramValue: string;
}

export const useChatQuery = ({
  queryKey,
  paramKey,
  apiUrl,
  paramValue,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async () => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        [paramKey]: paramValue,
      },
    });

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      initialPageParam: null,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
