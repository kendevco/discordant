'use client';

import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { ServerWithMembersWithProfiles } from "@/types";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle"; // Added import
import { UserButton } from "@clerk/nextjs"; // Added import

interface ServerListProps {
  servers: ServerWithMembersWithProfiles[];
}

export const ServerList = ({
  servers
}: ServerListProps) => {
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModal();

  const onClick = (serverId: string) => {
    router.push(`/servers/${serverId}`);
  };

  return (
    <div className="flex flex-col items-center h-full py-3 space-y-2 bg-gradient-to-b from-gray-900 via-indigo-950 to-gray-900">
      <ActionTooltip
        label="Add a Server"
        side="right"
        align="center"
      >
        <button
          onClick={() => onOpen("createServer")}
          className="group"
        >
          <div className={cn(
            "flex items-center justify-center w-12 h-12 rounded-[24px]",
            "bg-[#313338] group-hover:bg-emerald-500",
            "group-hover:rounded-[16px] transition-all duration-300"
          )}>
            <Plus
              className={cn(
                "group-hover:text-white transition text-emerald-500",
                "w-6 h-6"
              )}
            />
          </div>
        </button>
      </ActionTooltip>

      <Separator className="h-[2px] bg-[#313338] rounded-md w-8 mx-auto" />

      <div className="flex-1 space-y-2 overflow-y-auto">
        {servers.map((server) => {
          const isActive = params?.serverId === server.id;

          return (
            <div key={server.id} className="relative group">
              <div
                className={cn(
                  "absolute left-0 w-1 bg-white rounded-r-full transition-all duration-200",
                  isActive ? "h-12" : "h-7 opacity-0 group-hover:opacity-100",
                  "group-hover:h-7 -ml-[3px]"
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
                    "w-12 h-12 rounded-[24px] transition-all duration-300",
                    "bg-[#313338] hover:bg-emerald-500 hover:rounded-[16px]",
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

      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]"
            }
          }}
        />
      </div>
    </div>
  );
}; 