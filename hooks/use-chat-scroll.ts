// /hooks/use-chat-scroll.ts

import { useEffect, useState, useRef } from "react";

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
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const lastCountRef = useRef(0);
  const savedScrollPositionRef = useRef(0);

  // Simple scroll to bottom function
  const scrollToBottom = (behavior: "instant" | "smooth" = "instant") => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ 
        behavior,
        block: "end",
        inline: "nearest"
      });
    }
  };

  // Handle scroll events for load more and user interaction tracking
  useEffect(() => {
    const topDiv = chatRef.current;
    if (!topDiv) return;

    const handleScroll = () => {
      const scrollTop = topDiv.scrollTop;
      const scrollHeight = topDiv.scrollHeight;
      const clientHeight = topDiv.clientHeight;

      // Load more messages when scrolling to top
      if (scrollTop <= 100 && shouldLoadMore && !isLoadingMore) {
        setIsLoadingMore(true);
        savedScrollPositionRef.current = scrollHeight;
        loadMore();
      }

      // Track if user has scrolled away from bottom
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      setUserScrolled(distanceFromBottom > 150);
    };

    topDiv.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      topDiv.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, isLoadingMore, chatRef]);

  // Handle initial load - scroll to bottom immediately when messages first appear
  useEffect(() => {
    if (count > 0 && !hasInitialized) {
      // Force immediate scroll on first load
      setTimeout(() => {
        scrollToBottom("instant");
        setHasInitialized(true);
      }, 100);
    }
  }, [count, hasInitialized]);

  // Handle new messages vs loading more messages
  useEffect(() => {
    const topDiv = chatRef.current;
    if (!topDiv || !hasInitialized) return;

    const currentCount = count;
    const previousCount = lastCountRef.current;

    if (currentCount > previousCount) {
      if (isLoadingMore) {
        // Loading older messages - maintain scroll position
        const newScrollHeight = topDiv.scrollHeight;
        const heightDifference = newScrollHeight - savedScrollPositionRef.current;
        
        if (heightDifference > 0) {
          topDiv.scrollTop += heightDifference;
        }
        
        setIsLoadingMore(false);
      } else if (!userScrolled) {
        // New messages and user is at bottom - scroll down smoothly
        setTimeout(() => scrollToBottom("smooth"), 50);
      }
    }

    lastCountRef.current = currentCount;
  }, [count, hasInitialized, isLoadingMore, userScrolled]);
};
