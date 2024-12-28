"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface NavigationItemProps {
  id: string;
  imageUrl: string;
  name: string;
}

export const NavigationItem = ({
  id,
  imageUrl,
  name,
}: NavigationItemProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <button
        onClick={onClick}
        className={cn(
          "group relative flex items-center justify-center rounded-[24px] overflow-hidden w-[48px] h-[48px] mx-3 transition-all hover:rounded-[16px] z-50",
          params?.serverId === id && "rounded-[16px] bg-primary/10"
        )}
      >
        <Image
          fill
          src={imageUrl}
          alt={name}
          sizes="48px"
          onError={(e) => {
            console.error(`[NAVIGATION_ITEM] Image error for ${name}:`, e);
            e.currentTarget.src = "/placeholder.png";
          }}
        />
      </button>
    </ActionTooltip>
  );
};
