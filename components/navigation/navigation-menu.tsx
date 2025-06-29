// src/components/navigation/navigation-menu.tsx
"use client";

import {
  Moon,
  Sun,
  Settings,
  LogOut,
  User,
  RefreshCw,
  Shield,
  Crown,
  Server,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useUserRole } from "@/hooks/use-user-role";

export function NavigationMenu() {
  const { setTheme, theme } = useTheme();
  const [isSyncing, setIsSyncing] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { isHost, isAdmin, isModerator, isLoading, role } = useUserRole();

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await fetch("/api/messages/analyze/sync", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Sync failed");
      }

      router.refresh();
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" alignOffset={4}>
        <DropdownMenuLabel>Settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            Light Mode
            {theme === "light" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
            {theme === "dark" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <SignOutButton>
              <div className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </div>
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {!isLoading && (
          <DropdownMenuGroup>
            {/* Host-only features */}
            {isHost && (
              <>
                <DropdownMenuItem onClick={() => router.push("/host/settings")}>
                  <Crown className="mr-2 h-4 w-4" />
                  Host Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/host/environment")}>
                  <Server className="mr-2 h-4 w-4" />
                  Environment Config
                </DropdownMenuItem>
              </>
            )}
            
            {/* Admin+ features */}
            {isAdmin && (
              <DropdownMenuItem onClick={() => router.push("/admin/external-integrations")}>
                <Shield className="mr-2 h-4 w-4" />
                Admin Panel
              </DropdownMenuItem>
            )}
            
            {/* Moderator+ features */}
            {isModerator && (
              <DropdownMenuItem onClick={handleSync} disabled={isSyncing}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {isSyncing ? "Syncing..." : "Run Sync"}
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 