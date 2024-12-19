"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="bg-transparent border-0 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50" 
          variant="outline" 
          size="icon"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-zinc-700 dark:text-zinc-400 dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all text-zinc-700 dark:text-zinc-400 dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-[#1E1F22] border-zinc-300 dark:border-zinc-700">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="text-zinc-700 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700/50"
        >
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
