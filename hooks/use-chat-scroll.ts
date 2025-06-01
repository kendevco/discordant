// /hooks/use-chat-scroll.ts

import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);

  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      // Load more messages when scrolling to top
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }

      // Enhanced scroll tracking - be more permissive for auto-scrolling
      if (topDiv) {
        const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
        
        // More aggressive auto-scroll for recent activity
        // If user is within 100px of bottom, consider them "at bottom"
        if (distanceFromBottom > 100) {
          setUserScrolled(true);
        } else {
          setUserScrolled(false);
        }
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      // Always scroll on first load
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      // Enhanced logic for new messages
      const messageCountChanged = count !== lastMessageCount;
      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      
      // Auto-scroll if:
      // 1. User hasn't scrolled significantly up (within 100px of bottom)
      // 2. OR this is a new message and user is within 200px of bottom (more permissive)
      // 3. OR user is exactly at bottom (distance <= 10px)
      
      if (distanceFromBottom <= 10) {
        // User is essentially at the bottom
        return true;
      }
      
      if (!userScrolled && distanceFromBottom <= 100) {
        // User is close to bottom and hasn't actively scrolled away
        return true;
      }
      
      if (messageCountChanged && distanceFromBottom <= 200) {
        // New message arrived and user is reasonably close to bottom
        return true;
      }

      return false;
    };

    if (shouldAutoScroll()) {
      // Enhanced scrolling with multiple attempts for better reliability
      const scrollToBottom = () => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      };

      // Immediate scroll attempt
      scrollToBottom();

      // Use requestAnimationFrame for better timing with DOM updates
      requestAnimationFrame(() => {
        scrollToBottom();
        
        // Additional scroll attempts for complex renders (system messages, etc.)
        setTimeout(() => {
          scrollToBottom();
        }, 50);
        
        // Final fallback scroll for slow renders
        setTimeout(() => {
          scrollToBottom();
        }, 150);
      });
    }

    // Update last message count
    setLastMessageCount(count);
  }, [bottomRef, chatRef, count, hasInitialized, userScrolled, lastMessageCount]);

  // Reset scroll tracking when count changes (new messages)
  useEffect(() => {
    if (count !== lastMessageCount) {
      // Briefly reset scroll tracking for new messages to ensure they're visible
      const timer = setTimeout(() => {
        const topDiv = chatRef?.current;
        if (topDiv) {
          const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
          // Only reset if user is close to bottom
          if (distanceFromBottom <= 150) {
            setUserScrolled(false);
          }
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [count, lastMessageCount, chatRef]);
};
