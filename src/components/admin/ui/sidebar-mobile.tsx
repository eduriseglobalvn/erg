"use client"

import * as React from "react"
import { useSidebar } from "@/components/admin/ui/sidebar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/admin/ui/sheet"

const SIDEBAR_WIDTH_MOBILE = "18rem"

interface SidebarMobileProps {
    side?: "left" | "right"
    className?: string
    children: React.ReactNode
    [key: string]: any
}

export function SidebarMobile({ side = "left", className, children, ...props }: SidebarMobileProps) {
    const { isMobile, openMobile, setOpenMobile } = useSidebar()

    if (!isMobile) return null

    return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
            <SheetContent
                data-sidebar="sidebar"
                data-slot="sidebar"
                data-mobile="true"
                className="bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden"
                style={
                    {
                        "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
                    } as React.CSSProperties
                }
                side={side}
            >
                <SheetHeader className="sr-only">
                    <SheetTitle>Sidebar</SheetTitle>
                    <SheetDescription>Displays the mobile sidebar.</SheetDescription>
                </SheetHeader>
                <div className="flex h-full w-full flex-col">{children}</div>
            </SheetContent>
        </Sheet>
    )
}
