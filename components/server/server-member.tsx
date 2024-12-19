"use client";

import { Member, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { useMessages } from "@/components/providers/message-provider";
import { UserAvatar } from "@/components/user-avatar";

interface ServerMemberProps {
  member: Member & {
    profile: Profile;
  };
  server: Server;
}

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="w-4 h-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="w-4 h-4 ml-2 text-rose-500" />
}

export const ServerMember = ({
  member,
  server
}: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useMessages();

  const icon = roleIconMap[member.role];

  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        "group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar 
        src={member.profile.imageUrl} 
        className="w-8 h-8 md:h-8 md:w-8"
        status={isConnected ? "online" : "offline"}
      />
      <p
        className={cn(
          "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  )
}