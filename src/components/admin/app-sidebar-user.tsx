"use client"

import * as React from "react"
import Image from "next/image"
import { useAuth } from "@/hooks/use-auth"

interface AppSidebarUserProps {
    name?: string
    email?: string
    avatar?: string
}

// Default values (kept for compatibility)
const defaultUser = {
    name: "Admin",
    email: "admin@congty.com",
    avatar: "/avatars/avatar.jpg",
}

export function AppSidebarUser({ name, email, avatar }: AppSidebarUserProps) {
    const { data: auth, isLoading } = useAuth()

    const user = {
        name: name || auth?.user?.fullName || defaultUser.name,
        email: email || auth?.user?.email || defaultUser.email,
        avatar: avatar || auth?.user?.avatarUrl || defaultUser.avatar,
    }

    // Role badge based on user role
    const roleLabel = React.useMemo(() => {
        if (!auth?.user?.role) return "Quản trị viên"
        const roleMap: Record<string, string> = {
            admin: "Quản trị viên",
            editor: "Biên tập viên",
            author: "Tác giả",
            viewer: "Người xem",
        }
        return roleMap[auth.user.role] || auth.user.role
    }, [auth?.user?.role])

    return (
        <div className="flex items-center gap-3 p-3 border-b border-sidebar-border/50">
            <div className="relative">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary/80 to-primary overflow-hidden ring-2 ring-sidebar-border">
                    {user.avatar ? (
                        <div className="relative w-full h-full">
                            <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                        </div>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/20 text-primary text-sm font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                {/* Online indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-sidebar-background" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-sidebar-foreground/60 truncate leading-tight mt-0.5">{roleLabel}</p>
            </div>
        </div>
    )
}
