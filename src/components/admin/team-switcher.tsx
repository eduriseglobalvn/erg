"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/admin/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className={cn(
          "flex items-center gap-3 px-2 py-2 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "justify-start"
        )}>
          {/* Logo Box */}
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/5 p-1.5 shrink-0 shadow-sm border border-primary/10">
            <img src="https://media.erg.edu.vn/logo/erg.png" alt="Logo" className="size-full object-contain" />
          </div>

          {/* Text Content - Hidden when collapsed */}
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-sm font-bold text-primary truncate leading-tight">
                {activeTeam.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate uppercase font-bold tracking-tight opacity-80">
                {activeTeam.plan}
              </span>
            </div>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
