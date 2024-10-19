import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
    src?: string | null;
    className?: string;
};

export const UserAvatar = ({
    src,
    className
}: UserAvatarProps) => {

    if (!src) {
        return null;
    }
    // Check if NEXT_PUBLIC_SITE_URL or Vercel URL is available
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || '';

    // Check if the src is a system user image
    if (src === process.env.SYSTEM_USER_IMAGE) {
        const fullSrc = src.startsWith('http') ? src : `${baseUrl}${src}`;
        return (
            <Avatar className={cn(
                "h-7 w-7 md:h-10 md:w-10",
                className
            )}>
                <AvatarImage src={fullSrc} />
            </Avatar>
        );
    }
    return (
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10",
            className
        )}>
            <AvatarImage src={src} />
        </Avatar>
    );
}
