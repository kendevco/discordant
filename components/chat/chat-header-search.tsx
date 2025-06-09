"use client";

import { useState, useEffect } from "react";
import { Search, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatSearch } from "@/components/chat/chat-search";
import { MobileSearch } from "@/components/chat/mobile-search";
import { WorkflowConfiguration } from "@/components/admin/workflow-configuration";

interface ChatHeaderSearchProps {
  channelId?: string;
  conversationId?: string;
  serverId?: string;
  serverMembers?: Array<{
    id: string;
    name: string;
    imageUrl?: string;
    role: string;
  }>;
  serverChannels?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export const ChatHeaderSearch = ({ 
  channelId, 
  conversationId,
  serverId,
  serverMembers = [],
  serverChannels = []
}: ChatHeaderSearchProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState(false);

  // Keyboard shortcut handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F for desktop search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        if (window.innerWidth >= 768) {
          setIsSearchOpen(true);
        } else {
          setIsMobileSearchOpen(true);
        }
      }
      
      // Ctrl+Shift+F for mobile search (force mobile view)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        setIsMobileSearchOpen(true);
      }

      // Ctrl+W for workflow configuration
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        setIsWorkflowOpen(true);
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
      {/* Desktop Search Button */}
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

      {/* Mobile Search Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileSearchOpen(true)}
        className="text-white hover:text-zinc-300 md:hidden"
      >
        <Search className="h-4 w-4" />
      </Button>

      {/* Workflow Configuration Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsWorkflowOpen(true)}
        className="text-white hover:text-zinc-300 hidden lg:flex"
        title="Configure Workflows (Ctrl+W)"
      >
        <Workflow className="h-4 w-4" />
      </Button>

      {/* Desktop Search Modal */}
      <ChatSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        channelId={channelId}
        conversationId={conversationId}
        onResultClick={handleSearchResultClick}
      />

      {/* Mobile Search Modal */}
      <MobileSearch
        isOpen={isMobileSearchOpen}
        onClose={() => setIsMobileSearchOpen(false)}
        channelId={channelId}
        conversationId={conversationId}
        serverId={serverId}
        serverMembers={serverMembers}
        serverChannels={serverChannels}
        onResultClick={handleSearchResultClick}
      />

      {/* Workflow Configuration Modal */}
      <WorkflowConfiguration
        isOpen={isWorkflowOpen}
        onClose={() => setIsWorkflowOpen(false)}
        serverId={serverId}
        channelId={channelId}
      />
    </>
  );
}; 