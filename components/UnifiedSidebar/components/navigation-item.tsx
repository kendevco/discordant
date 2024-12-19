'use client';

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
    name
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${id}`);
    }

    return (
        <ActionTooltip
            side="right"
            align="center"
            label={name}
        >
            <button
                onClick={onClick}
                className="group relative flex items-center w-full"
            >
                <div className={cn(
                    "absolute left-0 bg-white rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px] opacity-75",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )} />
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-secondary/10 rounded-[16px]"
                )}>
                    <Image
                        fill
                        src={imageUrl}
                        alt="Channel"
                        className={cn(
                            "object-cover transition-all",
                            params?.serverId === id && "brightness-125"
                        )}
                    />
                </div>
            </button>
        </ActionTooltip>
    )
} 