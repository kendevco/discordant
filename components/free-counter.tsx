"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { useProModal } from "@/hooks/use-pro-modal";

export const FreeCounter = ({
  isPro = false,
  apiLimitCount = 0,
}: {
  isPro: boolean,
  apiLimitCount: number
}) => {
  const [mounted, setMounted] = useState(false);
  const proModal = useProModal();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isPro) {
    // return null;
  }

  return (
      <div
        onClick={proModal.onOpen}
        className="text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition"
      >
        <div className="flex flex-col gap-y-2 items-center flex-1">
          {apiLimitCount}
        </div>
        <div className="flex flex-col gap-y-2 items-center flex-1">
          Queries
        </div>
      </div>
  )
}