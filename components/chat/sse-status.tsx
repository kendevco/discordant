"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wifi, WifiOff, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SSEStatusProps {
  isConnected: boolean;
  connectionState: 'disconnected' | 'connecting' | 'connected' | 'error';
  error?: string | null;
  messageCount?: number;
  lastMessageTime?: Date | null;
  onReconnect?: () => void;
  className?: string;
}

export function SSEStatus({
  isConnected,
  connectionState,
  error,
  messageCount = 0,
  lastMessageTime,
  onReconnect,
  className
}: SSEStatusProps) {
  const getStatusColor = () => {
    switch (connectionState) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (connectionState) {
      case 'connected':
        return <Wifi className="h-3 w-3" />;
      case 'connecting':
        return <Loader2 className="h-3 w-3 animate-spin" />;
      case 'error':
        return <WifiOff className="h-3 w-3" />;
      default:
        return <WifiOff className="h-3 w-3" />;
    }
  };

  const getStatusText = () => {
    switch (connectionState) {
      case 'connected':
        return 'Live';
      case 'connecting':
        return 'Connecting...';
      case 'error':
        return 'Disconnected';
      default:
        return 'Offline';
    }
  };

  const formatLastMessageTime = (time: Date) => {
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {/* Status Badge */}
      <Badge
        variant="outline"
        className={cn(
          "flex items-center gap-1 text-xs border-0",
          connectionState === 'connected' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
          connectionState === 'connecting' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
          connectionState === 'error' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          connectionState === 'disconnected' && "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        )}
      >
        {getStatusIcon()}
        {getStatusText()}
      </Badge>

      {/* Message Count */}
      {messageCount > 0 && connectionState === 'connected' && (
        <Badge variant="secondary" className="text-xs">
          {messageCount} new
        </Badge>
      )}

      {/* Last Message Time */}
      {lastMessageTime && (
        <span className="text-xs text-muted-foreground">
          {formatLastMessageTime(lastMessageTime)}
        </span>
      )}

      {/* Error Message */}
      {error && connectionState === 'error' && (
        <div className="flex items-center gap-1">
          <AlertCircle className="h-3 w-3 text-red-500" />
          <span className="text-xs text-red-600 dark:text-red-400 max-w-[200px] truncate">
            {error}
          </span>
        </div>
      )}

      {/* Reconnect Button */}
      {(connectionState === 'error' || connectionState === 'disconnected') && onReconnect && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReconnect}
          className="h-6 px-2 text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reconnect
        </Button>
      )}

      {/* Connection Indicator Dot */}
      <div className="relative">
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            getStatusColor()
          )}
        />
        {connectionState === 'connected' && (
          <div
            className={cn(
              "absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-75",
              getStatusColor()
            )}
          />
        )}
      </div>
    </div>
  );
} 