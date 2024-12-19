'use client';

import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { Server } from "@prisma/client";
import { useEffect, useState } from "react";

export const NavigationSidebarClient = () => {
  const [servers, setServers] = useState<Server[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch("/api/servers");
        const data = await response.json();
        setServers(data);
      } catch (error) {
        console.error("Failed to fetch servers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  return (
    <div
      className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
      <NavigationAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-1 w-full">
        {!isLoading && servers?.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px]"
            }
          }}
        />
      </div>
    </div>
  );
}; 