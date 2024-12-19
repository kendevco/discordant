'use client';

import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { ServerWithMembersWithProfiles } from "@/types";

interface ServerListProps {
  servers: ServerWithMembersWithProfiles[];
}

export const ServerList = ({
  servers
}: ServerListProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = (serverId: string) => {
    router.push(`/servers/${serverId}`);
  };

  return (
    <div className="flex flex-col items-center w-full py-3 space-y-4">
      {servers.map((server) => {
        const isActive = params?.serverId === server.id;

        return (
          <div key={server.id} className="relative group flex items-center">
            <div
              className={cn(
                "absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200",
                isActive ? "h-10" : "h-5 opacity-0 group-hover:opacity-100",
                "group-hover:h-5 -ml-[3px]"
              )}
            />
            <ActionTooltip
              label={server.name}
              side="right"
              align="center"
            >
              <button
                onClick={() => onClick(server.id)}
                className={cn(
                  "group relative flex items-center justify-center",
                  "w-12 h-12 rounded-[24px] transition-all duration-200",
                  "bg-zinc-700 hover:bg-emerald-500 hover:rounded-[16px]",
                  isActive && "bg-emerald-500 rounded-[16px]"
                )}
              >
                {server.imageUrl ? (
                  <img
                    src={server.imageUrl}
                    alt={server.name}
                    className="w-full h-full object-cover rounded-[inherit]"
                  />
                ) : (
                  <span className="text-2xl font-semibold text-white">
                    {server.name[0].toUpperCase()}
                  </span>
                )}
              </button>
            </ActionTooltip>
          </div>
        );
      })}
    </div>
  );
}; 