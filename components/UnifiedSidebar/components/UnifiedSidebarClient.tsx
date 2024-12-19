'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChannelList } from "./ChannelList";
import { UserSection } from "./UserSection";

interface UnifiedSidebarClientProps {
    children: React.ReactNode;
}

export function UnifiedSidebarClient({ children }: UnifiedSidebarClientProps) {
    const [selectedServer, setSelectedServer] = useState('1');
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            {/* Mobile Trigger */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-80">
                    <div className="flex h-screen text-gray-100 bg-gradient-to-b from-gray-900 to-gray-800">
                        <div className="flex flex-col items-center py-4 border-r border-gray-700 w-[72px]">
                            {children}
                        </div>
                        <div className="flex flex-col bg-gray-800 w-60">
                            <ChannelList serverId={selectedServer} />
                            <UserSection />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex h-screen text-gray-100 bg-gradient-to-b from-gray-900 to-gray-800">
                <div className="flex flex-col items-center py-4 border-r border-gray-700 w-[72px]">
                    {children}
                </div>
                <div className="flex flex-col bg-gray-800 w-60">
                    <ChannelList serverId={selectedServer} />
                    <UserSection />
                </div>
            </div>
        </>
    );
} 