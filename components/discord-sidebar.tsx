'use client'

import { useState, useEffect } from 'react'
import { Menu, Hash, Volume2, ChevronDown, ChevronRight, User, Home, Settings, Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Server {
  id: string
  name: string
  icon: string
}

interface Channel {
  id: string
  name: string
  type: 'text' | 'voice'
  members?: Member[]
}

interface Member {
  id: string
  name: string
  status: 'online' | 'idle' | 'dnd' | 'offline'
}

const servers: Server[] = [
  { id: '1', name: 'Cyber Lounge', icon: '🌆' },
  { id: '2', name: 'Neon Nexus', icon: '💡' },
  { id: '3', name: 'Retro Waves', icon: '🌊' },
]

const channels: { category: string; channels: Channel[] }[] = [
  {
    category: 'TEXT CHANNELS',
    channels: [
      { id: '1', name: 'general-chat', type: 'text' },
      { id: '2', name: 'art-showcase', type: 'text' },
    ],
  },
  {
    category: 'VOICE CHANNELS',
    channels: [
      {
        id: '3',
        name: 'Neon Lounge',
        type: 'voice',
        members: [
          { id: '1', name: 'CyberPunk2077', status: 'online' },
          { id: '2', name: 'NeonRider', status: 'idle' },
        ]
      },
      {
        id: '4',
        name: 'Synthwave Studio',
        type: 'voice',
        members: [
          { id: '3', name: 'RetroWave', status: 'online' },
          { id: '4', name: 'NeonDreamer', status: 'dnd' },
        ]
      },
    ],
  },
]

export function DiscordSidebar() {
  const [selectedServer, setSelectedServer] = useState(servers[0].id)
  const [isServerNavCollapsed, setIsServerNavCollapsed] = useState(false)
  const [collapsedCategories, setCollapsedCategories] = useState<string[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const toggleCategory = (category: string) => {
    setCollapsedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

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
          <DiscordSidebarContent
            selectedServer={selectedServer}
            setSelectedServer={setSelectedServer}
            isServerNavCollapsed={isServerNavCollapsed}
            setIsServerNavCollapsed={setIsServerNavCollapsed}
            collapsedCategories={collapsedCategories}
            toggleCategory={toggleCategory}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex">
        <DiscordSidebarContent
          selectedServer={selectedServer}
          setSelectedServer={setSelectedServer}
          isServerNavCollapsed={isServerNavCollapsed}
          setIsServerNavCollapsed={setIsServerNavCollapsed}
          collapsedCategories={collapsedCategories}
          toggleCategory={toggleCategory}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>
    </>
  )
}

function DiscordSidebarContent({
  selectedServer,
  setSelectedServer,
  isServerNavCollapsed,
  setIsServerNavCollapsed,
  collapsedCategories,
  toggleCategory,
  isDarkMode,
  setIsDarkMode,
}: {
  selectedServer: string
  setSelectedServer: (id: string) => void
  isServerNavCollapsed: boolean
  setIsServerNavCollapsed: (collapsed: boolean) => void
  collapsedCategories: string[]
  toggleCategory: (category: string) => void
  isDarkMode: boolean
  setIsDarkMode: (isDark: boolean) => void
}) {
  return (
    <div className="flex h-screen text-gray-100 bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Server Navigation */}
      <div
        className={cn(
          'flex flex-col items-center py-4 transition-all duration-300 ease-in-out border-r border-gray-700',
          isServerNavCollapsed ? 'w-[72px]' : 'w-[72px] md:w-20'
        )}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 mb-2 rounded-[24px] bg-indigo-600 hover:bg-indigo-700 hover:rounded-[16px] transition-all duration-300 ease-in-out"
                onClick={() => {/* Navigate to root */ }}
              >
                <Home className="w-6 h-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Home</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {servers.map((server) => (
          <TooltipProvider key={server.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'w-12 h-12 mb-2 rounded-[24px] transition-all duration-300 ease-in-out',
                    selectedServer === server.id
                      ? 'bg-indigo-500 text-white'
                      : 'hover:bg-indigo-400 hover:rounded-[16px]'
                  )}
                  onClick={() => setSelectedServer(server.id)}
                >
                  {server.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{server.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <div className="mt-auto space-y-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-[24px] hover:bg-indigo-400 hover:rounded-[16px] transition-all duration-300 ease-in-out"
                  onClick={() => {/* Open settings */ }}
                >
                  <Settings className="w-6 h-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-12 h-12 rounded-[24px] hover:bg-indigo-400 hover:rounded-[16px] transition-all duration-300 ease-in-out"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                >
                  {isDarkMode ? (
                    <Sun className="w-6 h-6" />
                  ) : (
                    <Moon className="w-6 h-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Channel List */}
      <div className="flex flex-col bg-gray-800 w-60">
        <div className="p-4 font-semibold text-indigo-300 bg-gray-900 border-b border-gray-700">
          {servers.find((s) => s.id === selectedServer)?.name}
        </div>
        <ScrollArea className="flex-1">
          {channels.map((category) => (
            <div key={category.category} className="mb-4">
              <Button
                variant="ghost"
                className="justify-start w-full px-2 py-1 text-xs font-semibold text-gray-400 hover:text-gray-200"
                onClick={() => toggleCategory(category.category)}
              >
                {collapsedCategories.includes(category.category) ? (
                  <ChevronRight className="w-4 h-4 mr-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 mr-1" />
                )}
                {category.category}
              </Button>
              {!collapsedCategories.includes(category.category) && (
                <div className="space-y-1">
                  {category.channels.map((channel) => (
                    <div key={channel.id}>
                      <Button
                        variant="ghost"
                        className="justify-start w-full px-2 py-1 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                      >
                        {channel.type === 'text' ? (
                          <Hash className="w-4 h-4 mr-2" />
                        ) : (
                          <Volume2 className="w-4 h-4 mr-2" />
                        )}
                        {channel.name}
                      </Button>
                      {channel.type === 'voice' && channel.members && (
                        <div className="ml-6 space-y-1">
                          {channel.members.map((member) => (
                            <div key={member.id} className="flex items-center text-sm text-gray-400">
                              <div className={`w-2 h-2 rounded-full mr-2 ${member.status === 'online' ? 'bg-green-500' :
                                  member.status === 'idle' ? 'bg-yellow-500' :
                                    member.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500'
                                }`} />
                              {member.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </ScrollArea>
        <div className="flex items-center p-4 bg-gray-900 border-t border-gray-700">
          <User className="w-8 h-8 p-1 mr-2 bg-indigo-500 rounded-full" />
          <div>
            <div className="font-semibold text-indigo-300">CyberUser</div>
            <div className="text-xs text-gray-400">Online</div>
          </div>
        </div>
      </div>
    </div>
  )
}

