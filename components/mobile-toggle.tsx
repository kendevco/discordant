import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ServerSidebar } from "@/components/server/server-sidebar";
import VisuallyHidden from "@/components/visually-hidden";

export const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <VisuallyHidden>
          <SheetTitle>Server Menu</SheetTitle>
        </VisuallyHidden>
        <ServerSidebar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};
