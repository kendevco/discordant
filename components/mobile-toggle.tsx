"use client";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UnifiedSidebarClient } from "@/components/UnifiedSidebar/components/unified-sidebar-client";

interface MobileToggleProps {
  serverId: string;
}

export const MobileToggle = ({
  serverId
}: MobileToggleProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[312px]">
        <UnifiedSidebarClient />
      </SheetContent>
    </Sheet>
  );
};
