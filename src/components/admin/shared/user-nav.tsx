"use client"

import {
    CreditCard,
    LogOut,
    Settings,
    User,
    Bell,
    CheckCircle,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/admin/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu"
import { Button } from "@/components/admin/ui/button"

export function UserNav() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-800">
                        {/* Thay ảnh của bạn vào src */}
                        <AvatarImage src="/avatars/01.png" alt="@shadcn" />
                        <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
                {/* Phần Header của Dropdown: Hiển thị 2 user như trong ảnh */}
                <div className="flex flex-col space-y-4 p-2">
                    {/* User chính */}
                    <div className="flex items-center gap-4 rounded-md bg-muted/50 p-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="/avatars/01.png" alt="Arham" />
                            <AvatarFallback className="bg-blue-100 text-blue-600">AK</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Arham Khan</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                Administrator
                            </p>
                        </div>
                    </div>

                    {/* User phụ (Switch account) */}
                    <div className="flex items-center gap-4 p-2">
                        <Avatar className="h-10 w-10 bg-gray-100">
                            <AvatarFallback className="text-gray-600">AK</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">Ammar Khan</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                Admin
                            </p>
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer">
                        <CheckCircle className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Billing</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>Notifications</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}