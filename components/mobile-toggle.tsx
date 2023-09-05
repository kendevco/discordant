import { Menu } from "lucide-react"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NavigationSideBar } from "@/components/navigation/navigation-sidebar"
import { ServerSidebar } from "@/components/server/server-sidebar"



export const MobileToggle = ({
    serverId 
}: {
    serverId: string;
}) => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu size={24} />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w=[72]px">
                    <NavigationSideBar />
                </div>
                <ServerSidebar serverId={serverId}/> 
            </SheetContent>
        </Sheet>

    )
}