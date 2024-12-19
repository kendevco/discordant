'use client';

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";

interface NavigationItemProps {
    id: string;
    imageUrl?: string | null;
    name: string;
};

export const NavigationItem = ({
    id,
    imageUrl,
    name,
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();
    const { onClose: closeMobileSidebar } = useMobileSidebar();

    const onClick = () => {
        router.push(`/servers/${id}`);
        closeMobileSidebar();
    }

    return (
        <ActionTooltip 
            side="right"
            align="center"
            label={name}
        >
            <button
                onClick={onClick}
                className={cn(
                    "group relative flex items-center",
                    "w-12 h-12",
                    "rounded-[24px]",
                    "bg-[#2B2D31] dark:bg-[#2B2D31]",
                    "hover:rounded-[16px] hover:bg-emerald-500",
                    "transition-all",
                    params?.serverId === id && "rounded-[16px] bg-emerald-500"
                )}
            >
                {imageUrl && (
                    <Image
                        fill
                        src={imageUrl}
                        alt="Channel"
                        className={cn(
                            "object-cover transition",
                            "rounded-[24px] group-hover:rounded-[16px]",
                            params?.serverId === id && "rounded-[16px]"
                        )}
                    />
                )}
            </button>
        </ActionTooltip>
    )
}