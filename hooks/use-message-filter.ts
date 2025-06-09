import { useMemo } from "react";
import { MessageWithMemberWithProfile } from "@/lib/system/types/message";
import { FileType } from "@prisma/client";

interface SearchFilters {
  query: string;
  fileTypes: FileType[];
  dateRange: string;
  hasFiles: boolean;
  fromCurrentUser: boolean;
}

export function useMessageFilter(
  messages: MessageWithMemberWithProfile[], 
  filters: SearchFilters,
  currentUserId?: string
) {
  const filteredMessages = useMemo(() => {
    if (!filters.query && !hasActiveFilters(filters)) {
      return messages;
    }

    return messages.filter((message) => {
      // Text search
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const content = message.content?.toLowerCase() || "";
        const memberName = message.member.profile.name.toLowerCase();
        const memberEmail = message.member.profile.email.toLowerCase();
        
        if (!content.includes(query) && 
            !memberName.includes(query) && 
            !memberEmail.includes(query)) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange !== "all") {
        const messageDate = new Date(message.createdAt);
        const now = new Date();
        
        switch (filters.dateRange) {
          case "today":
            if (!isSameDay(messageDate, now)) return false;
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (messageDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (messageDate < monthAgo) return false;
            break;
        }
      }

      // File type filter
      if (filters.fileTypes.length > 0) {
        if (!message.fileUrl) return false;
        // Extract file type from URL if not directly available
        const fileType = message.fileUrl.split('.').pop()?.toLowerCase();
        if (!fileType || !filters.fileTypes.includes(fileType as FileType)) return false;
      }

      // Has files filter
      if (filters.hasFiles) {
        if (!message.fileUrl) return false;
      }

      // Current user filter
      if (filters.fromCurrentUser) {
        if (message.member.profile.userId !== currentUserId) return false;
      }

      return true;
    });
  }, [messages, filters, currentUserId]);

  return {
    filteredMessages,
    totalCount: messages.length,
    filteredCount: filteredMessages.length,
    isFiltering: filters.query.trim() !== "" || hasActiveFilters(filters)
  };
}

function hasActiveFilters(filters: SearchFilters): boolean {
  return filters.fileTypes.length > 0 || 
         filters.dateRange !== "all" || 
         filters.hasFiles || 
         filters.fromCurrentUser;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
} 