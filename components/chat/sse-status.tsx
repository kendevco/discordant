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
  compact?: boolean; // For mobile/header usage
}

export function SSEStatus({
  isConnected,
  connectionState,
  error,
  messageCount = 0,
  lastMessageTime,
  onReconnect,
  className,
  compact = false
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

  // Compact mode for mobile/header usage
  if (compact) {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {/* Compact Status Badge - responsive design */}
        <Badge
          variant="outline"
          className={cn(
            "flex items-center gap-1 text-xs border-0 transition-all duration-200",
            // Desktop: expanded with text and better padding
            "md:gap-2 md:px-3 md:py-1.5",
            connectionState === 'connected' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
            connectionState === 'connecting' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
            connectionState === 'error' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
            connectionState === 'disconnected' && "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
          )}
        >
          {getStatusIcon()}
          {/* Show text on small mobile and always on desktop */}
          <span className="xs:inline md:inline">{getStatusText()}</span>
        </Badge>

        {/* Message Count - show on tablet and desktop */}
        {messageCount > 0 && connectionState === 'connected' && (
          <Badge variant="secondary" className="text-xs hidden md:inline-flex lg:inline-flex">
            {messageCount}
          </Badge>
        )}

        {/* Connection quality indicator on desktop */}
        {connectionState === 'connected' && (
          <div className="hidden md:flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground hidden lg:inline">Real-time</span>
          </div>
        )}

        {/* Error indicator - show alert icon on mobile, text on desktop */}
        {error && connectionState === 'error' && (
          <>
            <AlertCircle className="h-3 w-3 text-red-500 md:hidden" />
            <span className="hidden md:inline text-xs text-red-600 dark:text-red-400 max-w-[150px] truncate">
              {error}
            </span>
          </>
        )}

        {/* Reconnect Button - improved responsive design */}
        {(connectionState === 'error' || connectionState === 'disconnected') && onReconnect && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReconnect}
            className="h-6 px-2 text-xs hidden md:flex hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            <span className="hidden lg:inline">Reconnect</span>
          </Button>
        )}
      </div>
    );
  }

  // Full mode for detailed status displays - enhanced for desktop
  return (
    <div className={cn("flex items-center gap-2 md:gap-3", className)}>
      {/* Status Badge - larger on desktop */}
      <Badge
        variant="outline"
        className={cn(
          "flex items-center gap-1 text-xs border-0 md:gap-2 md:px-3 md:py-1.5 md:text-sm",
          connectionState === 'connected' && "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
          connectionState === 'connecting' && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
          connectionState === 'error' && "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
          connectionState === 'disconnected' && "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
        )}
      >
        {getStatusIcon()}
        {getStatusText()}
      </Badge>

      {/* Message Count - enhanced for desktop */}
      {messageCount > 0 && connectionState === 'connected' && (
        <Badge variant="secondary" className="text-xs md:text-sm md:px-2 md:py-1">
          {messageCount} new
        </Badge>
      )}

      {/* Last Message Time - show on tablet+ */}
      {lastMessageTime && (
        <span className="text-xs text-muted-foreground hidden md:inline lg:text-sm">
          {formatLastMessageTime(lastMessageTime)}
        </span>
      )}

      {/* Error Message - responsive layout */}
      {error && connectionState === 'error' && (
        <div className="flex items-center gap-1 md:gap-2">
          <AlertCircle className="h-3 w-3 text-red-500 md:h-4 md:w-4" />
          <span className="text-xs text-red-600 dark:text-red-400 max-w-[150px] md:max-w-[250px] truncate md:text-sm">
            {error}
          </span>
        </div>
      )}

      {/* Reconnect Button - enhanced for desktop */}
      {(connectionState === 'error' || connectionState === 'disconnected') && onReconnect && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReconnect}
          className="h-6 px-2 text-xs md:h-8 md:px-3 md:text-sm hover:bg-red-100 dark:hover:bg-red-900/20"
        >
          <RefreshCw className="h-3 w-3 mr-1 md:h-4 md:w-4" />
          Reconnect
        </Button>
      )}

      {/* Connection Indicator Dot - enhanced for desktop */}
      <div className="relative">
        <div
          className={cn(
            "w-2 h-2 rounded-full md:w-3 md:h-3",
            getStatusColor()
          )}
        />
        {connectionState === 'connected' && (
          <div
            className={cn(
              "absolute inset-0 w-2 h-2 rounded-full animate-ping opacity-75 md:w-3 md:h-3",
              getStatusColor()
            )}
          />
        )}
      </div>
    </div>
  );
} 