"use client"

import * as React from "react"
import { Moon, Settings, Sun, Search } from "lucide-react"
import { useTheme } from "next-themes"

import { Separator } from "@/components/admin/ui/separator"
import { SidebarTrigger } from "@/components/admin/ui/sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/admin/ui/breadcrumb"
import { Button } from "@/components/admin/ui/button"
import { UserNav } from "@/components/admin/shared/user-nav"
import { Input } from "@/components/admin/ui/input"

export function AdminHeader() {
    const { setTheme, theme } = useTheme()

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 z-50 bg-white/80 dark:bg-[#191919]/80 backdrop-blur-md">

            {/* 1. Bên trái: Sidebar Trigger & Breadcrumb */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/admin">Quản trị</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Dashboard</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* 2. Bên phải: Search & Actions */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Search Bar */}
                <div className="hidden md:flex relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="w-64 rounded-lg bg-background pl-9 md:w-[200px] lg:w-[300px]"
                    />
                    <kbd className="pointer-events-none absolute right-2.5 top-2.5 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>J
                    </kbd>
                </div>

                {/* Nút Settings */}
                <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700">
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                </Button>

                {/* Nút Dark Mode Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>

                {/* User Dropdown */}
                <UserNav />
            </div>
        </header>
    )
}