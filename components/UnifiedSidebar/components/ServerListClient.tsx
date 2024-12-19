'use client';

import React from 'react';
import { Server } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";

const DEFAULT_SERVER_IMAGE = "/images/placeholder.jpg";

interface ServerListClientProps {
  servers: Server[];
}

export function ServerListClient({ servers }: ServerListClientProps) {
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full bg-background py-3">
      <NavigationAction />
      <Separator
        className="h-[2px] bg-muted rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center space-y-4">
          {servers.map((server) => (
            <NavigationItem
              key={server.id}
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl || DEFAULT_SERVER_IMAGE}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="flex flex-col items-center pb-3 mt-auto gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[48px] w-[48px] rounded-[24px] hover:rounded-[16px] transition-all"
            }
          }}
        />
      </div>
    </div>
  );
} 