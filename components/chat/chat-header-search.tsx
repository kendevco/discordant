"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { ChatSearch } from "@/components/chat/chat-search";
import { Button } from "@/components/ui/button";

interface ChatHeaderSearchProps {
  channelId?: string;
  conversationId?: string;
}

export const ChatHeaderSearch = ({ 
  channelId, 
  conversationId 
}: ChatHeaderSearchProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchResultClick = (messageId: string, clickChannelId?: string, clickConversationId?: string) => {
    // Scroll to message or highlight it
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageElement.classList.add('animate-pulse');
      setTimeout(() => {
        messageElement.classList.remove('animate-pulse');
      }, 2000);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSearchOpen(true)}
        className="text-white hover:text-zinc-300 hidden md:flex"
      >
        <Search className="h-4 w-4 mr-2" />
        Search
        <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border border-zinc-700 bg-zinc-800/50 px-1.5 font-mono text-[10px] font-medium text-zinc-400 sm:flex">
          Ctrl+F
        </kbd>
      </Button>
      <ChatSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        channelId={channelId}
        conversationId={conversationId}
        onResultClick={handleSearchResultClick}
      />
    </>
  );
}; 