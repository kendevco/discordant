import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarWithStatusProps {
  src?: string;
  className?: string;
  isOnline?: boolean;
  showStatus?: boolean;
}

export const UserAvatarWithStatus = ({ 
  src, 
  className, 
  isOnline = false, 
  showStatus = true 
}: UserAvatarWithStatusProps) => {
  return (
    <div className="relative">
      <Avatar className={cn("h-7 w-7 md:h-10 md:w-10", className)}>
        <AvatarImage src={src} />
      </Avatar>
      {showStatus && (
        <div 
          className={cn(
            "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800",
            isOnline ? "bg-green-500" : "bg-gray-400"
          )}
        />
      )}
    </div>
  );
}; 