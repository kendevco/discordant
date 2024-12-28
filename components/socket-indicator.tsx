"use client";
import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const checkScreenWidth = () => {
    setIsLargeScreen(window.innerWidth >= 768);
  };

  useEffect(() => {
    checkScreenWidth();
    window.addEventListener("resize", checkScreenWidth);
    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  if (!isConnected) {
    return (
      <>
        {isLargeScreen ? (
          <Badge
            variant="outline"
            className="bg-yellow-600 text-white border-none"
          >
            Loading...
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-yellow-600 w-6 h-6 rounded-full"
          ></Badge>
        )}
      </>
    );
  }

  return (
    <>
      {isLargeScreen ? (
        <Badge
          variant="outline"
          className="bg-emerald-600 text-white border-none"
        >
          Live: Real-time updates
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="bg-emerald-600 w-6 h-6 rounded-full"
        ></Badge>
      )}
    </>
  );
};
