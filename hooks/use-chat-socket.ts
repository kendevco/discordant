// /hooks/use-chat-socket.ts

import { useSocket } from "@/components/providers/socket-provider";
import { socketHelper } from "@/lib/system/socket";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
  channelId?: string;
  conversationId?: string;
};

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
  _forceUpdate?: boolean; // Add support for force update flag
  _systemMetadata?: any; // Add optional system metadata support
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
  channelId,
  conversationId,
}: ChatSocketProps) => {
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log(`[USE_CHAT_SOCKET] Socket not available for queryKey: ${queryKey}`);
      return;
    }

    console.log(`[USE_CHAT_SOCKET] Setting up socket listeners for:`, {
      queryKey,
      addKey,
      updateKey,
      channelId,
      conversationId,
      socketConnected: socket.connected,
      socketId: socket.id
    });

    // Join appropriate room
    if (channelId) {
      socketHelper.joinChannel(channelId);
      console.log(`[USE_CHAT_SOCKET] Joined channel: ${channelId}`);
    } else if (conversationId) {
      socketHelper.joinConversation(conversationId);
      console.log(`[USE_CHAT_SOCKET] Joined conversation: ${conversationId}`);
    }

    // Handle message updates
    const handleUpdate = (message: MessageWithMemberWithProfile) => {
      console.log(`[USE_CHAT_SOCKET] Received UPDATE on key: ${updateKey}`);
      console.log(`[USE_CHAT_SOCKET] Update message ID: ${message.id}`);
      
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          console.log(`[USE_CHAT_SOCKET] No existing data for update, skipping`);
          return oldData;
        }
        
        const newData = oldData.pages.map((page: any) => {
          return {
            ...page,
            items: page.items.map((item: MessageWithMemberWithProfile) => {
              if (item.id === message.id) {
                console.log(`[USE_CHAT_SOCKET] Updated message ${message.id}`);
                return message;
              }
              return item;
            }),
          };
        });
        
        return {
          ...oldData,
          pages: newData,
        };
      });
    };

    // Handle new message additions
    const handleAdd = (message: MessageWithMemberWithProfile) => {
      console.log(`[USE_CHAT_SOCKET] Received message on key: ${addKey}`);
      console.log(`[USE_CHAT_SOCKET] Message ID: ${message.id}`);
      console.log(`[USE_CHAT_SOCKET] Message role: ${message.role}`);
      console.log(`[USE_CHAT_SOCKET] Message content preview: ${message.content?.substring(0, 100)}...`);
      console.log(`[USE_CHAT_SOCKET] Message member: ${message.member?.profile?.name}`);
      console.log(`[USE_CHAT_SOCKET] Force update flag: ${message._forceUpdate}`);
      console.log(`[USE_CHAT_SOCKET] System metadata: ${message._systemMetadata ? 'present' : 'not present'}`);

      queryClient.setQueryData([queryKey], (oldData: any) => {
        console.log(`[USE_CHAT_SOCKET] Old data exists: ${!!oldData}`);
        console.log(`[USE_CHAT_SOCKET] Old data pages: ${oldData?.pages?.length || 0}`);

        // If no data exists, create initial structure that matches the API response
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          console.log(`[USE_CHAT_SOCKET] Creating initial data structure`);
          return {
            pages: [
              {
                items: [message],
                nextCursor: null,
              },
            ],
            pageParams: [undefined],
          };
        }

        // Clone the existing data structure
        const newData = [...oldData.pages];
        
        // Ensure the first page exists and has proper structure
        if (newData[0]) {
          // Check if message already exists to prevent duplicates
          const messageExists = newData[0].items.some((item: MessageWithMemberWithProfile) => item.id === message.id);
          
          if (!messageExists) {
            // Add new message to the beginning of the first page
            newData[0] = {
              ...newData[0],
              items: [message, ...newData[0].items],
            };
            console.log(`[USE_CHAT_SOCKET] Added new message to first page. Total items: ${newData[0].items.length}`);
          } else {
            console.log(`[USE_CHAT_SOCKET] Message already exists, skipping duplicate`);
          }
        } else {
          // Create first page if it doesn't exist
          newData[0] = {
            items: [message],
            nextCursor: null,
          };
          console.log(`[USE_CHAT_SOCKET] Created first page with new message`);
        }

        const updatedData = {
          ...oldData,
          pages: newData,
        };
        
        console.log(`[USE_CHAT_SOCKET] Updated data structure ready. Total pages: ${updatedData.pages.length}`);
        return updatedData;
      });

      // If force update flag is set, immediately invalidate queries
      if (message._forceUpdate) {
        console.log(`[USE_CHAT_SOCKET] Force update flag detected, invalidating queries immediately`);
        queryClient.invalidateQueries({ 
          queryKey: [queryKey],
          exact: true,
          refetchType: 'none' // Don't refetch, just trigger re-render
        });
      } else {
        // For system messages, add a small delay to ensure smooth transitions
        console.log(`[USE_CHAT_SOCKET] System message, invalidating queries with delay`);
        setTimeout(() => {
          queryClient.invalidateQueries({ 
            queryKey: [queryKey],
            exact: true,
            refetchType: 'none'
          });
        }, 100);
      }
    };

    // Attach event listeners
    socket.on(updateKey, handleUpdate);
    socket.on(addKey, handleAdd);

    // Cleanup function
    return () => {
      console.log(`[USE_CHAT_SOCKET] Cleaning up listeners for: ${queryKey}`);
      
      // Remove event listeners
      socket.off(updateKey, handleUpdate);
      socket.off(addKey, handleAdd);
      
      // Leave rooms
      if (channelId) {
        socketHelper.leaveChannel(channelId);
        console.log(`[USE_CHAT_SOCKET] Left channel: ${channelId}`);
      } else if (conversationId) {
        socketHelper.leaveConversation(conversationId);
        console.log(`[USE_CHAT_SOCKET] Left conversation: ${conversationId}`);
      }
    };
  }, [queryClient, addKey, queryKey, socket, updateKey, isConnected, channelId, conversationId]);
};
