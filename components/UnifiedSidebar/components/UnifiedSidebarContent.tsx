'use client';

import { cn } from "@/lib/utils";
import { Menu, Hash, Volume2, ChevronDown, ChevronRight, User, Home, Settings, Sun, Moon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ServerList } from "./server-list";
import { ChannelList } from "./ChannelList";
import { UserSection } from "./UserSection";
import styles from './UnifiedSidebar.module.css';

interface UnifiedSidebarContentProps {
    selectedServer: string;
    setSelectedServer: (id: string) => void;
    isServerNavCollapsed: boolean;
    setIsServerNavCollapsed: (collapsed: boolean) => void;
    collapsedCategories: string[];
}

export function UnifiedSidebarContent({
    selectedServer,
    setSelectedServer,
    isServerNavCollapsed,
    setIsServerNavCollapsed,
    collapsedCategories,
}: UnifiedSidebarContentProps) {
    return (
        <div className="flex h-screen text-gray-100 bg-gradient-to-b from-gray-900 to-gray-800">
            {/* Server Navigation */}
            <div
                className={cn(
                    'flex flex-col items-center py-4 transition-all duration-300 ease-in-out border-r border-gray-700',
                    isServerNavCollapsed ? 'w-[72px]' : 'w-[72px] md:w-20'
                )}
            >
                <ServerList />
            </div>

            {/* Channel List */}
            <div className="flex flex-col bg-gray-800 w-60">
                <ChannelList serverId={selectedServer} />
                <UserSection />
            </div>
        </div>
    );
} 