// src/components/server/server-member.tsx
"use client";

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "@/components/user-avatar";

interface ServerMemberProps {
  member: Member & { profile: Profile };
  server: Server;
}
const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.ADMIN]: <ShieldCheck className="ml-2 h-4 w-4 text-green-500" />,
  [MemberRole.MODERATOR]: <ShieldCheck className="ml-2 h-4 w-4 text-black" />,
};
export const ServerMember = ({ member }: ServerMemberProps) => {
  const params = useParams();
  const router = useRouter();
  const icon = roleIconMap[member.role];
  const onClick = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-2 py-2 rounded-md gap-x-2 flex w-full group items-center hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl || ""}
        className="h-5 w-5 md:h-5 md:w-5"
      />
      <p
        className={cn(
          "font-semibold text-xs text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>
      {icon}
    </button>
  );
};
