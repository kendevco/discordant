'use client';

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCyberTheme } from "@/hooks/use-cyber-theme";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { isDark, getNeonGlow } = useCyberTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "h-8 w-8 rounded-full",
        "transition-all duration-300",
        isDark && "hover:shadow-[0_0_10px_rgba(0,245,255,0.3)]"
      )}
    >
      <Sun className={cn(
        "h-4 w-4 rotate-0 scale-100 transition-all",
        "dark:-rotate-90 dark:scale-0",
        isDark ? "text-zinc-200" : "text-zinc-600"
      )} />
      <Moon className={cn(
        "absolute h-4 w-4 rotate-90 scale-0 transition-all",
        "dark:rotate-0 dark:scale-100",
        isDark ? "text-zinc-200" : "text-zinc-600"
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}; 