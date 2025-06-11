// src/components/navigation/navigation-item.tsx
"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
  hasUnreadMessages?: boolean;
}

export const NavigationItem = ({
  id,
  imageUrl,
  name,
  hasUnreadMessages = false,
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  const isActive = params?.serverId === id;

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <div className="group relative flex items-center">
        {/* Discord-style indicator */}
        <div className="absolute left-0 flex items-center justify-start w-2">
          <div
            className={cn(
              "bg-white rounded-r-full transition-all duration-200",
              isActive 
                ? "h-9 w-1" 
                : hasUnreadMessages 
                  ? "h-2 w-1 opacity-100 group-hover:h-5" 
                  : "h-2 w-1 opacity-0 group-hover:opacity-100 group-hover:h-5"
            )}
          />
        </div>
        
        <button
          onClick={onClick}
          className={cn(
            "group relative flex items-center justify-center rounded-[24px] overflow-hidden w-[48px] h-[48px] mx-3 transition-all hover:rounded-[16px] z-50",
            isActive && "rounded-[16px] bg-primary/10"
          )}
        >
          <Image
            fill
            src={imageUrl || "/placeholder.png"}
            alt={name}
            sizes="48px"
            onError={(e) => {
              console.warn(`[NAVIGATION_ITEM] Failed to load image for ${name}, using placeholder`);
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        </button>
      </div>
    </ActionTooltip>
  );
};