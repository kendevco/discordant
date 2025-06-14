"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Minimize2, X } from "lucide-react";
// Socket.IO removed - using polling for real-time updates

interface Message {
  id: string;
  content: string;
  sender: {
    name: string;
    type: 'visitor' | 'agent' | 'system';
    avatar?: string;
  };
  timestamp: Date;
  isExternal?: boolean;
}

interface VisitorData {
  sessionId: string;
  email?: string;
  name?: string;
  page?: string;
}

function EmbeddedChatWidget() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  // Socket.IO removed - using polling for real-time updates
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Widget configuration from URL params
  const channelId = searchParams?.get("channelId");
  const theme = searchParams?.get("theme") || "light";
  const apiToken = searchParams?.get("token");
  const sessionId = searchParams?.get("sessionId");
  const visitorEmail = searchParams?.get("email");
  const visitorName = searchParams?.get("name");
  const currentPage = searchParams?.get("page");

  useEffect(() => {
    if (!channelId || !apiToken) {
      console.error("Missing required parameters: channelId and token");
      return;
    }

    // Initialize visitor data
    const visitor: VisitorData = {
      sessionId: sessionId || generateSessionId(),
      email: visitorEmail || undefined,
      name: visitorName || undefined,
      page: currentPage || window.location.href
    };
    setVisitorData(visitor);

    // Initialize connection status
    setIsConnected(true);
    console.log('[WIDGET] Connected to Discordant (polling mode)');
    
    // Send visitor session data
    postVisitorActivity('widget-opened', {
      page: visitor.page,
      timestamp: new Date().toISOString()
    });

    // Add welcome message
    addMessage({
      id: 'welcome',
      content: "👋 Hi! How can I help you today?",
      sender: {
        name: 'Assistant',
        type: 'system'
      },
      timestamp: new Date()
    });

    // Note: Real-time updates now handled by SSE or polling
    // The widget will rely on message responses from the API
  }, [channelId, apiToken, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const generateSessionId = () => {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  const showNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }
  };

  const postVisitorActivity = async (type: string, data: any) => {
    if (!visitorData) return;

    try {
      await fetch(`${window.location.origin}/api/external/visitor-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          sessionId: visitorData.sessionId,
          type,
          data,
          channelId,
          visitorData
        })
      });
    } catch (error) {
      console.error('[WIDGET] Failed to post visitor activity:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !visitorData || isLoading) return;

    setIsLoading(true);

    // Add message to local state immediately
    const userMessage: Message = {
      id: `temp_${Date.now()}`,
      content: newMessage,
      sender: {
        name: visitorData.name || 'You',
        type: 'visitor'
      },
      timestamp: new Date()
    };
    addMessage(userMessage);

    try {
      // Send to Discordant
      const response = await fetch(`${window.location.origin}/api/external/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiToken}`
        },
        body: JSON.stringify({
          channelId,
          content: newMessage,
          sourceType: 'chat-widget',
          visitorData: {
            sessionId: visitorData.sessionId,
            email: visitorData.email,
            name: visitorData.name,
            metadata: {
              page: visitorData.page,
              widget: true,
              timestamp: new Date().toISOString()
            }
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      
      // Update message with actual ID
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id 
          ? { ...msg, id: result.messageId || msg.id }
          : msg
      ));

      // Post visitor activity
      postVisitorActivity('message-sent', {
        messageId: result.messageId,
        content: newMessage.slice(0, 100),
        length: newMessage.length
      });

    } catch (error) {
      console.error('[WIDGET] Failed to send message:', error);
      
      // Show error message
      addMessage({
        id: `error_${Date.now()}`,
        content: "❌ Failed to send message. Please try again.",
        sender: {
          name: 'System',
          type: 'system'
        },
        timestamp: new Date()
      });
    } finally {
      setIsLoading(false);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
    postVisitorActivity('widget-minimized', { minimized: !isMinimized });
  };

  const getMessageBubbleClass = (senderType: string) => {
    switch (senderType) {
      case 'visitor':
        return theme === 'dark' 
          ? 'bg-blue-600 text-white ml-auto' 
          : 'bg-blue-500 text-white ml-auto';
      case 'agent':
        return theme === 'dark'
          ? 'bg-gray-700 text-white'
          : 'bg-gray-100 text-gray-900';
      case 'system':
        return theme === 'dark'
          ? 'bg-purple-700 text-white'
          : 'bg-purple-100 text-purple-900';
      default:
        return theme === 'dark'
          ? 'bg-gray-600 text-white'
          : 'bg-gray-50 text-gray-800';
    }
  };

  const themeClasses = theme === 'dark'
    ? 'bg-gray-900 text-white border-gray-700'
    : 'bg-white text-gray-900 border-gray-200';

  if (!channelId || !apiToken) {
    return (
      <div className={`flex items-center justify-center h-full ${themeClasses}`}>
        <div className="text-center">
          <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Invalid widget configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${themeClasses} rounded-lg shadow-lg`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <h3 className="font-semibold">Chat Support</h3>
          {isConnected && (
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            className="h-6 w-6 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      {!isMinimized && (
        <>
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender.type === 'visitor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${getMessageBubbleClass(message.sender.type)}`}>
                    {message.sender.type !== 'visitor' && (
                      <div className="text-xs opacity-75 mb-1">
                        {message.sender.name}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || !isConnected}
                className={theme === 'dark' ? 'bg-gray-800 border-gray-600' : ''}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !isConnected || !newMessage.trim()}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!isConnected && (
              <p className="text-xs text-red-500 mt-2">
                Connecting to chat...
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666]">
      <div className="text-center">
        <MessageCircle className="mx-auto h-12 w-12 text-white/70 mb-4 animate-pulse" />
        <p className="text-white/90 font-medium">Loading chat widget...</p>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <EmbeddedChatWidget />
    </Suspense>
  );
}