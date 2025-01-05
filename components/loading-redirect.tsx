"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Loader2 } from "lucide-react";

interface LoadingRedirectProps {
  serverId: string;
  initialChannelId: string | undefined;
  shouldRedirect: boolean;
}

const LoadingRedirect = ({
  serverId,
  initialChannelId,
  shouldRedirect,
}: LoadingRedirectProps) => {
  const router = useRouter();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (shouldRedirect && initialChannelId) {
      router.push(`/servers/${serverId}/channels/${initialChannelId}`);
    } else {
      setIsLoading(false);
    }
  }, [shouldRedirect, initialChannelId, router, serverId]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-gradient-to-br from-[#7364c0] to-[#02264a] dark:from-[#000C2F] dark:to-[#003666] rounded-xl shadow-lg p-6 w-full max-w-sm mx-4 transform transition-all">
            <div className="flex items-center justify-center space-x-4">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-200" />
              <p className="text-lg font-semibold text-zinc-200">
                Redirecting...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingRedirect;
