import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { cyberNoirTheme } from "@/lib/themes/cyber-noir";
import { useTheme } from "next-themes";

interface UserAvatarProps {
    src?: string | null;
    className?: string;
    status?: 'online' | 'idle' | 'offline';
    showStatus?: boolean;
};

export const UserAvatar = ({
    src,
    className,
    status = 'offline',
    showStatus = true
}: UserAvatarProps) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const colors = isDark ? cyberNoirTheme.dark : cyberNoirTheme.light;

    if (!src) {
        return null;
    }

    return (
        <div className="relative">
            <Avatar className={cn(
                "h-7 w-7 md:h-10 md:w-10",
                "transition-all duration-300 hover:shadow-lg",
                isDark && "hover:shadow-[0_0_15px_rgba(0,245,255,0.3)]",
                className
            )}>
                <AvatarImage src={src} />
            </Avatar>
            {showStatus && (
                <div className={cn(
                    "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2",
                    isDark ? "border-[#1A1B1E]" : "border-white",
                    "transition-all duration-300",
                    status === 'online' && "animate-pulse",
                    {
                        'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]': status === 'online',
                        'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.4)]': status === 'idle',
                        'bg-gray-500': status === 'offline'
                    },
                    isDark && {
                        'bg-[#00FF8C] shadow-[0_0_12px_rgba(0,255,140,0.4)]': status === 'online',
                        'bg-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.4)]': status === 'idle',
                        'bg-[#404040]': status === 'offline'
                    }
                )} />
            )}
        </div>
    );
};
