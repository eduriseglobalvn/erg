"use client"

import { useState, useEffect } from "react"
import {
    CreditCard,
    LogOut,
    Settings,
    User as UserIcon,
    Bell,
    CheckCircle,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/cms/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/cms/ui/dropdown-menu"
import { Button } from "@/components/cms/ui/button"
import { User } from "@/types/user"
import { handleLogout } from "@/services/http-client"

import { userApi } from "@/services/users.api"

export function UserNav() {
    const [user, setUser] = useState<User | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)

        // Chỉ lấy từ cache localStorage để hiển thị, không gọi API dư thừa ở đây
        // vì logic status đã được check ở tầng layout/login rồi.
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) { }
        }
    }, [])

    const getInitials = (name: string) => {
        if (!name) return "U"
        return name
            .split(" ")
            .filter(Boolean)
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    const onLogout = () => {
        handleLogout()
    }

    // Hydration fix
    const displayName = user?.fullName || "CMS"
    const displayRole = user?.role || "CMS Manager"
    const initials = mounted ? getInitials(displayName) : "AK"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
                        <AvatarImage src={user?.avatarUrl} alt={displayName} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            {/* THÊM bg-white dark:bg-card ĐỂ TRÁNH TRONG SUỐT QUÁ MỨC */}
            <DropdownMenuContent
                className="w-80 bg-white dark:bg-[#1a1a1a] opacity-100 shadow-2xl border-gray-200 dark:border-gray-800 z-[100]"
                align="end"
                forceMount
            >
                {/* Phần Header của Dropdown */}
                <div className="flex flex-col space-y-4 p-2">
                    {/* User chính - Đổi bg-muted/50 thành bg-muted hoặc gray-50 để rõ hơn */}
                    <div className="flex items-center gap-4 rounded-md bg-gray-50 dark:bg-muted p-3">
                        <Avatar className="h-10 w-10 border border-white dark:border-gray-700 shadow-sm">
                            <AvatarImage src={user?.avatarUrl} alt={displayName} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-bold leading-none">{displayName}</p>
                            <p className="text-[11px] font-medium leading-none text-muted-foreground capitalize">
                                {displayRole}
                            </p>
                        </div>
                    </div>

                    {user?.email && (
                        <div className="px-2 text-xs text-muted-foreground truncate italic">
                            {user.email}
                        </div>
                    )}
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer py-3 hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">
                        <CheckCircle className="mr-3 h-4 w-4 text-blue-500" />
                        <span className="font-medium">Hồ sơ cá nhân</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3 hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">
                        <Settings className="mr-3 h-4 w-4 text-gray-500" />
                        <span className="font-medium">Cài đặt</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer py-3 hover:bg-gray-50 dark:hover:bg-muted/50 transition-colors">
                        <Bell className="mr-3 h-4 w-4 text-gray-500" />
                        <span className="font-medium">Thông báo</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 py-3 transition-colors"
                    onClick={onLogout}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-semibold">Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
