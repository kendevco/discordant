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
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const savedScrollHeightRef = useRef<number>(0);

  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      if (!topDiv) return;

      const scrollTop = topDiv.scrollTop;
      const scrollHeight = topDiv.scrollHeight;
      const clientHeight = topDiv.clientHeight;

      // Load more messages when scrolling to top (with small threshold)
      if (scrollTop <= 50 && shouldLoadMore && !isLoadingMore) {
        setIsLoadingMore(true);
        // Save current scroll height before loading more
        savedScrollHeightRef.current = scrollHeight;
        loadMore();
      }

      // Track if user has scrolled away from bottom
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      
      // Consider user scrolled if they're more than 100px from bottom
      if (distanceFromBottom > 100) {
        setUserScrolled(true);
      } else {
        setUserScrolled(false);
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);
    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef, isLoadingMore]);

  // Handle initial scroll to bottom on first load
  useEffect(() => {
    if (!hasInitialized && bottomRef.current && count > 0) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "instant" });
        setHasInitialized(true);
      }, 100);
    }
  }, [hasInitialized, bottomRef, count]);

  // Handle new messages (scroll to bottom) vs loading more messages (maintain position)
  useEffect(() => {
    const topDiv = chatRef?.current;
    if (!topDiv) return;

    const isNewMessagesLoaded = count > lastMessageCount;
    const messagesAdded = count - lastMessageCount;

    if (isNewMessagesLoaded) {
      if (isLoadingMore) {
        // Loading older messages - maintain scroll position
        const newScrollHeight = topDiv.scrollHeight;
        const heightDifference = newScrollHeight - savedScrollHeightRef.current;
        
        // Adjust scroll position to maintain view
        if (heightDifference > 0) {
          topDiv.scrollTop += heightDifference;
        }
        
        setIsLoadingMore(false);
      } else {
        // New messages arriving - scroll to bottom if user is close to bottom
        const shouldAutoScroll = () => {
          if (!hasInitialized) return true;
          
          const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
          
          // Auto-scroll if user is close to bottom (within 150px) or hasn't scrolled away
          return !userScrolled || distanceFromBottom <= 150;
        };

        if (shouldAutoScroll()) {
          // Use requestAnimationFrame for smooth scrolling
          requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end"
            });
          });
        }
      }
    }

    setLastMessageCount(count);
  }, [count, lastMessageCount, isLoadingMore, hasInitialized, userScrolled, chatRef, bottomRef]);

  // Reset user scrolled state when they scroll back to bottom
  useEffect(() => {
    const topDiv = chatRef?.current;
    if (!topDiv || !userScrolled) return;

    const checkIfAtBottom = () => {
      const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;
      if (distanceFromBottom <= 10) {
        setUserScrolled(false);
      }
    };

    const timer = setInterval(checkIfAtBottom, 500);
    return () => clearInterval(timer);
  }, [userScrolled, chatRef]);
};
