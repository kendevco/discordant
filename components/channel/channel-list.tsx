'use client';

import { Hash, Volume2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCyberTheme } from "@/hooks/use-cyber-theme";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Channel {
  id: string;
  name: string;
  type: "TEXT" | "AUDIO" | "VIDEO";
  isPrivate?: boolean;
}

interface ChannelListProps {
  channels: Channel[];
  currentChannelId?: string;
  onChannelSelect?: (channelId: string) => void;
}

export const ChannelList = ({
  channels,
  currentChannelId,
  onChannelSelect
}: ChannelListProps) => {
  const { isDark, colors, getNeonGlow } = useCyberTheme();

  const getChannelIcon = (type: Channel["type"]) => {
    switch (type) {
      case "TEXT":
        return <Hash className="h-4 w-4 mr-2" />;
      case "AUDIO":
      case "VIDEO":
        return <Volume2 className="h-4 w-4 mr-2" />;
      default:
        return <Hash className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <ScrollArea className="flex-1">
      <div className="mt-2">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => onChannelSelect?.(channel.id)}
            className={cn(
              "group relative w-full flex items-center gap-x-2 px-2 py-2 mb-1 rounded-md",
              "transition-all duration-300",
              "hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
              currentChannelId === channel.id && [
                "bg-zinc-700/20 dark:bg-zinc-700/50",
                isDark && "shadow-[0_0_10px_rgba(0,245,255,0.15)]"
              ]
            )}
          >
            <div className="flex items-center gap-x-2">
              {getChannelIcon(channel.type)}
              <span className={cn(
                "text-sm font-medium transition-colors",
                currentChannelId === channel.id
                  ? "text-primary dark:text-zinc-200"
                  : "text-zinc-500 dark:text-zinc-400",
                "group-hover:text-primary dark:group-hover:text-zinc-300"
              )}>
                {channel.name}
              </span>
              {channel.isPrivate && (
                <Lock className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              )}
            </div>
            {currentChannelId === channel.id && (
              <div
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full",
                  "bg-primary dark:bg-cyan-500",
                  isDark && "shadow-[0_0_8px_rgba(0,245,255,0.4)]"
                )}
              />
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}; 