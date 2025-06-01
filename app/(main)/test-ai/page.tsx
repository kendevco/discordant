"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Calendar, Clock, Search, Brain, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'system';
  timestamp: Date;
  loading?: boolean;
  metadata?: any;
}

export default function TestAIPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "🤖 **Enhanced Business Intelligence Assistant**\n\nI can help you with:\n📅 **Calendar Management** - View, create, update, delete events\n🔍 **Message Search** - Find conversations, files, client discussions\n🌐 **Web Research** - Current market data, company intelligence\n💼 **Business Analysis** - Contextualize and summarize information\n\nTry asking:\n- \"What meetings do I have today?\"\n- \"Find messages about Tesla and research their latest stock price\"\n- \"Schedule a meeting with the Johnson client team tomorrow\"\n- \"What did we discuss about Microsoft last month?\"\n\nHow can I assist with your business intelligence needs?",
      sender: 'system',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const testSystemMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: content,
      sender: 'user',
      timestamp: new Date()
    };

    const loadingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: "Processing your request...",
      sender: 'system',
      timestamp: new Date(),
      loading: true
    };

    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Route through system-messages.ts via workflow proxy
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                     (typeof window !== 'undefined' && window.location.origin) || 
                     "http://localhost:3001";
      
      const proxyUrl = `${baseUrl}/api/workflow`;
      
      const payload = {
        message: content,
        userId: 'test-user',
        channelId: 'test-channel',
        timestamp: new Date().toISOString(),
        platform: 'test-interface',
        metadata: {
          sessionId: `test-${Date.now()}`,
          testMode: true,
          userAgent: 'Discordant-Test-Interface/1.0'
        }
      };

      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Workflow-Id": "enhanced-business-intelligence",
          "X-Webhook-Path": "discordant-ai-services",
          "User-Agent": "Discordant-Test-Interface/1.0",
        },
        body: JSON.stringify(payload),
      });

      let result = null;
      let botMessage = "I processed your request but didn't receive a response.";

      if (response.ok) {
        result = await response.json();
        
        // Handle various response formats from n8n
        if (result?.content) {
          botMessage = result.content;
        } else if (result?.output) {
          botMessage = result.output;
        } else if (result?.message) {
          botMessage = result.message;
        } else if (Array.isArray(result) && result.length > 0) {
          botMessage = result[0]?.content || result[0]?.output || result[0]?.message || "Response received";
        } else if (typeof result === 'string') {
          botMessage = result;
        } else {
          botMessage = `🔍 **Debug Response:**\n\`\`\`json\n${JSON.stringify(result, null, 2)}\n\`\`\``;
        }
      } else {
        botMessage = `❌ Error: ${response.status} ${response.statusText}`;
      }

      // Remove loading message and add actual response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.loading);
        
        const botResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: botMessage,
          sender: 'system',
          timestamp: new Date(),
          metadata: result
        };
        
        return [...withoutLoading, botResponse];
      });

    } catch (error) {
      // Remove loading message and add error response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => !msg.loading);
        const errorResponse: ChatMessage = {
          id: (Date.now() + 2).toString(),
          content: `❌ Connection error: ${error instanceof Error ? error.message : "Unknown error"}`,
          sender: 'system',
          timestamp: new Date()
        };
        return [...withoutLoading, errorResponse];
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const sendMessage = async () => {
    await testSystemMessage(inputMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickCommands = {
    calendar: [
      "What meetings do I have today?",
      "Show me next week's events", 
      "Am I free this afternoon?",
      "Schedule a team meeting tomorrow at 2 PM"
    ],
    search: [
      "Find recent messages about Tesla",
      "Show me conversations from last week",
      "Search for documents about Microsoft"
    ],
    research: [
      "Research Tesla's latest earnings",
      "What's happening with Microsoft Teams?",
      "Find business intelligence about National Registration Group"
    ],
    mixed: [
      "Find messages about Tesla and research their stock price",
      "Search for calendar conflicts and suggest alternatives",
      "Research our competitors and schedule a strategy meeting"
    ]
  };

  const addQuickCommand = (command: string) => {
    setInputMessage(command);
    inputRef.current?.focus();
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      content: "🤖 Chat cleared! Ready for your next request.",
      sender: 'system',
      timestamp: new Date()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] p-4">
      <div className="max-w-6xl mx-auto h-[calc(100vh-2rem)] flex gap-4">
        
        {/* Quick Commands Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 overflow-y-auto">
          <h2 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Quick Commands</h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {quickCommands.calendar.map((cmd, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-auto py-1 px-2"
                    onClick={() => addQuickCommand(cmd)}
                  >
                    {cmd}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-green-500" />
                  Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {quickCommands.search.map((cmd, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-auto py-1 px-2"
                    onClick={() => addQuickCommand(cmd)}
                  >
                    {cmd}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-500" />
                  Research
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {quickCommands.research.map((cmd, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-auto py-1 px-2"
                    onClick={() => addQuickCommand(cmd)}
                  >
                    {cmd}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  Combined
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {quickCommands.mixed.map((cmd, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs h-auto py-1 px-2"
                    onClick={() => addQuickCommand(cmd)}
                  >
                    {cmd}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Chat Interface */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    AI Assistant Test
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Testing system-messages.ts integration with n8n workflows
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="text-xs"
              >
                Clear Chat
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : message.loading
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    <span className="text-xs opacity-75">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap text-sm">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about calendar, search, or research..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 