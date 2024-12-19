import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useMessages } from "@/components/providers/message-provider";
import { MessageWithMemberWithProfile } from "@/types";

interface ChatSocketProps {
  addKey: string;
  updateKey: string;
  queryKey: string;
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
}: ChatSocketProps) => {
  const { subscribe } = useMessages();
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = subscribe((event) => {
      if (event.type === addKey) {
        const message = event.data as MessageWithMemberWithProfile;
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return {
              pages: [{
                items: [message],
              }]
            }
          }

          const newData = {...oldData};
          newData.pages[0].items.unshift(message);
          return newData;
        });
      }

      if (event.type === updateKey) {
        const message = event.data as MessageWithMemberWithProfile;
        queryClient.setQueryData([queryKey], (oldData: any) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData;
          }

          const newData = {...oldData};
          for (let i = 0; i < newData.pages.length; i++) {
            const page = newData.pages[i];
            const messageIndex = page.items.findIndex((item: MessageWithMemberWithProfile) => item.id === message.id);
            if (messageIndex !== -1) {
              page.items[messageIndex] = message;
              break;
            }
          }
          return newData;
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [queryKey, addKey, updateKey, subscribe, queryClient]);

  return {};
}
