'use client';

import { Settings, LogOut } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCyberTheme } from "@/hooks/use-cyber-theme";

interface User {
  id: string;
  name: string;
  imageUrl?: string;
  email?: string;
  status?: 'online' | 'idle' | 'offline';
}

interface UserSectionProps {
  currentUser?: User;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
}

export const UserSection = ({
  currentUser,
  onSettingsClick,
  onLogoutClick
}: UserSectionProps) => {
  const { isDark, colors, getNeonGlow } = useCyberTheme();

  if (!currentUser) return null;

  return (
    <div className={cn(
      "flex items-center gap-2 p-4",
      "border-t border-[#2D2E35]",
      "bg-background/50 backdrop-blur-sm"
    )}>
      <UserAvatar
        src={currentUser.imageUrl}
        status={currentUser.status}
        className={cn(
          "h-8 w-8",
          "transition-all duration-300",
          isDark && "hover:shadow-[0_0_10px_rgba(0,245,255,0.3)]"
        )}
      />
      
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-medium truncate",
          isDark ? "text-zinc-200" : "text-zinc-700"
        )}>
          {currentUser.name}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
          {currentUser.email}
        </p>
      </div>

      <div className="flex items-center gap-x-2">
        <Button
          onClick={onSettingsClick}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8",
            "transition-all duration-300",
            isDark && "hover:shadow-[0_0_10px_rgba(0,245,255,0.2)]"
          )}
        >
          <Settings className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </Button>
        <Button
          onClick={onLogoutClick}
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8",
            "transition-all duration-300",
            isDark && "hover:shadow-[0_0_10px_rgba(0,245,255,0.2)]"
          )}
        >
          <LogOut className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </Button>
      </div>
    </div>
  );
}; 