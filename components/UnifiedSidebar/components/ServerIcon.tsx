'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useCyberTheme } from "@/hooks/use-cyber-theme";

interface ServerIconProps {
  server: {
    id: string;
    name: string;
    imageUrl?: string;
  };
  isActive?: boolean;
}

export function ServerIcon({ server, isActive }: ServerIconProps) {
  const router = useRouter();
  const { isDark } = useCyberTheme();

  const onClick = () => {
    router.push(`/servers/${server.id}`);
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex h-12 w-12 items-center justify-center rounded-[24px]",
        "transition-all duration-300 hover:rounded-[16px]",
        isDark && "hover:shadow-[0_0_10px_rgba(0,245,255,0.3)]",
        isActive && "rounded-[16px]",
        isDark ? "bg-zinc-700 hover:bg-emerald-500" : "bg-zinc-200 hover:bg-zinc-700"
      )}
    >
      {server.imageUrl ? (
        <Image
          src={server.imageUrl}
          alt={server.name}
          width={48}
          height={48}
          className={cn(
            "h-full w-full rounded-[24px] object-cover transition-all duration-300",
            "group-hover:rounded-[16px]",
            isActive && "rounded-[16px]"
          )}
        />
      ) : (
        <span className={cn(
          "text-sm font-semibold transition-colors",
          isDark ? "text-zinc-200 group-hover:text-white" : "text-zinc-600 group-hover:text-white"
        )}>
          {server.name[0].toUpperCase()}
        </span>
      )}
    </button>
  );
} 