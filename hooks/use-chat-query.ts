import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useMessages } from "@/components/providers/message-provider";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useChatQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useMessages();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl({
      url: apiUrl,
      query: {
        cursor: pageParam,
        [paramKey]: paramValue,
      }
    }, { skipNull: true });

    const res = await fetch(url);
    return res.json();
  };

  return useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    refetchInterval: !isConnected ? 1000 : false,
    initialPageParam: undefined,
    staleTime: 0,
    gcTime: 0,
  });
}