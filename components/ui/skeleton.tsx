import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md", 
        // Match the main app gradient background
        "bg-gradient-to-br from-[#7364c0]/20 to-[#02264a]/20", 
        "dark:from-[#000C2F]/30 dark:to-[#003666]/30",
        // Add subtle shimmer effect
        "bg-[length:400%_400%] animate-gradient-x",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton } 