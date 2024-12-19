"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ChannelList } from "@/components/UnifiedSidebar/components/ChannelList";
import { UserSection } from "@/components/UnifiedSidebar/components/UserSection";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { Server, Profile } from "@prisma/client";

interface HamburgerToggleProps {
  server: Server & {
    channels: any[];
    members: any[];
  };
  initialProfile: Profile;
}

export const HamburgerToggle = ({
  server,
  initialProfile
}: HamburgerToggleProps) => {
  const params = useParams();
  const { theme } = useTheme();
  const serverId = typeof params?.serverId === 'string' ? params.serverId : undefined;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex gap-0 p-0 w-[300px]">
        <div className={cn(
          "w-[72px]",
          theme === 'dark' ? "bg-[#1E1F22]" : "bg-[#E3E5E8]"
        )}>
          {/* Server list will be rendered here */}
        </div>
        {serverId && (
          <div className={cn(
            "flex-1",
            theme === 'dark' ? "bg-[#2B2D31]" : "bg-[#F2F3F5]"
          )}>
            <ChannelList
              serverId={serverId}
              server={server}
              initialProfile={initialProfile}
            />
            <UserSection />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}; 