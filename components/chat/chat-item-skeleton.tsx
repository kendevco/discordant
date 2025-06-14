import { Skeleton } from "@/components/ui/skeleton";

export const ChatItemSkeleton = () => {
  return (
    <div className="flex items-start gap-x-3 p-4 bg-message hover:bg-message-hover transition-colors duration-200">
      <Skeleton className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7364c0]/30 to-[#02264a]/30 dark:from-[#000C2F]/40 dark:to-[#003666]/40" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-4 w-24 bg-gradient-to-r from-[#7364c0]/25 to-[#02264a]/25 dark:from-[#000C2F]/35 dark:to-[#003666]/35" />
          <Skeleton className="h-3 w-16 bg-gradient-to-r from-[#7364c0]/20 to-[#02264a]/20 dark:from-[#000C2F]/30 dark:to-[#003666]/30" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-4 w-full bg-gradient-to-r from-[#7364c0]/25 to-[#02264a]/25 dark:from-[#000C2F]/35 dark:to-[#003666]/35" />
          <Skeleton className="h-4 w-3/4 bg-gradient-to-r from-[#7364c0]/20 to-[#02264a]/20 dark:from-[#000C2F]/30 dark:to-[#003666]/30" />
          <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-[#7364c0]/15 to-[#02264a]/15 dark:from-[#000C2F]/25 dark:to-[#003666]/25" />
        </div>
      </div>
    </div>
  );
}; 