"use client"

import { useEffect, useState } from "react"
import { ShieldAlert, LogOut, Clock } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/admin/ui/dialog"
import { Button } from "@/components/admin/ui/button"
import { handleLogout } from "@/services/http-client"

interface PermissionDeniedDialogProps {
    open: boolean
    onOpenChange?: (open: boolean) => void
}

export function PermissionDeniedDialog({ open, onOpenChange }: PermissionDeniedDialogProps) {
    const [countdown, setCountdown] = useState(60) // 60 giây = 1 phút

    useEffect(() => {
        if (!open) return

        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleLogout()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [open])

    const handleLogoutNow = () => {
        handleLogout()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] border-red-200 dark:border-red-900/50">
                <DialogHeader>
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            {/* Outer glow */}
                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>

                            {/* Icon */}
                            <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-full">
                                <ShieldAlert className="h-12 w-12 text-white" strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    <DialogTitle className="text-center text-2xl text-red-600 dark:text-red-500">
                        Truy Cập Bị Từ Chối
                    </DialogTitle>

                    <DialogDescription className="text-center text-base pt-2">
                        Tài khoản của bạn không có quyền truy cập hệ thống
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Main message */}
                    <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                            Tài khoản của bạn chưa được gán bất kỳ vai trò (role) hoặc quyền (permission) nào.
                            Vui lòng liên hệ quản trị viên để được cấp quyền truy cập.
                        </p>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-center justify-center gap-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Tự động đăng xuất sau: <span className="text-red-600 dark:text-red-500 font-bold text-lg">{countdown}s</span>
                        </p>
                    </div>

                    {/* Contact info */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Cần trợ giúp? Liên hệ{" "}
                            <a
                                href="mailto:admin@erg.edu.vn"
                                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                            >
                                admin@erg.edu.vn
                            </a>
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button
                        onClick={handleLogoutNow}
                        variant="destructive"
                        className="gap-2 w-full sm:w-auto"
                    >
                        <LogOut className="h-4 w-4" />
                        Đăng xuất ngay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
