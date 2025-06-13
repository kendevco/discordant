"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSSEChannel } from "@/hooks/use-sse-channel";
import { useSSEConversation } from "@/hooks/use-sse-conversation";
import { SSEStatus } from "@/components/chat/sse-status";

export default function TestSSEPage() {
  const [channelId, setChannelId] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [testChannelId, setTestChannelId] = useState<string | null>(null);
  const [testConversationId, setTestConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const channelSSE = useSSEChannel(testChannelId, {
    autoRefresh: false, // Disable auto-refresh for testing
    onNewMessages: (data) => {
      setMessages(prev => [...prev, `Channel: ${JSON.stringify(data)}`]);
    }
  });

  const conversationSSE = useSSEConversation(testConversationId, {
    autoRefresh: false, // Disable auto-refresh for testing
    onNewMessages: (data) => {
      setMessages(prev => [...prev, `Conversation: ${JSON.stringify(data)}`]);
    }
  });

  const handleTestChannel = () => {
    if (channelId.trim()) {
      setTestChannelId(channelId.trim());
      setMessages(prev => [...prev, `🔗 Connecting to channel: ${channelId.trim()}`]);
    }
  };

  const handleTestConversation = () => {
    if (conversationId.trim()) {
      setTestConversationId(conversationId.trim());
      setMessages(prev => [...prev, `🔗 Connecting to conversation: ${conversationId.trim()}`]);
    }
  };

  const handleDisconnect = () => {
    setTestChannelId(null);
    setTestConversationId(null);
    setMessages(prev => [...prev, `❌ Disconnected from all`]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">SSE Test Page</h1>
        <p className="text-muted-foreground">
          Test Server-Sent Events connections for channels and conversations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Channel Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Channel SSE Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter channel ID"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
              />
              <Button onClick={handleTestChannel} disabled={!channelId.trim()}>
                Connect
              </Button>
            </div>
            
            {testChannelId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Connected to: {testChannelId}</Badge>
                </div>
                <SSEStatus
                  isConnected={channelSSE.isConnected}
                  connectionState={channelSSE.connectionState}
                  error={channelSSE.error}
                  messageCount={channelSSE.messageCount}
                  lastMessageTime={channelSSE.lastMessageTime}
                  onReconnect={channelSSE.forceReconnect}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversation Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation SSE Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter conversation ID"
                value={conversationId}
                onChange={(e) => setConversationId(e.target.value)}
              />
              <Button onClick={handleTestConversation} disabled={!conversationId.trim()}>
                Connect
              </Button>
            </div>
            
            {testConversationId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Connected to: {testConversationId}</Badge>
                </div>
                <SSEStatus
                  isConnected={conversationSSE.isConnected}
                  connectionState={conversationSSE.connectionState}
                  error={conversationSSE.error}
                  messageCount={conversationSSE.messageCount}
                  lastMessageTime={conversationSSE.lastMessageTime}
                  onReconnect={conversationSSE.forceReconnect}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2 mt-6">
        <Button onClick={handleDisconnect} variant="destructive">
          Disconnect All
        </Button>
        <Button onClick={clearMessages} variant="outline">
          Clear Messages
        </Button>
      </div>

      {/* Message Log */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Event Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-sm">No events yet...</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className="text-sm font-mono bg-muted p-2 rounded border-l-2 border-blue-500"
                >
                  <span className="text-muted-foreground mr-2">
                    {new Date().toLocaleTimeString()}
                  </span>
                  {message}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <ol className="list-decimal list-inside space-y-1">
            <li>Enter a valid channel ID or conversation ID from your Discord app</li>
            <li>Click "Connect" to establish an SSE connection</li>
            <li>In another browser tab, send a message to that channel/conversation</li>
            <li>Watch the event log for real-time updates</li>
            <li>The SSE status indicator will show connection state and message counts</li>
          </ol>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded">
            <p className="text-yellow-800 dark:text-yellow-200 text-xs">
              <strong>Note:</strong> You need to be a member of the channel/conversation to receive updates.
              The SSE endpoints will validate your access before establishing connections.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 