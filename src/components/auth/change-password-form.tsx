"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useResetPasswordMutation } from "@/hooks/use-verify-pin"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { toast } from "sonner"

export function ChangePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const resetPasswordMutation = useResetPasswordMutation()

    const email = searchParams.get("email")
    const pin = searchParams.get("pin")

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        if (!email || !pin) {
            toast.error("Thiếu thông tin xác thực, vui lòng làm lại")
            router.push("/auth/forgot-password")
        }
    }, [email, pin, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.warning("Mật khẩu xác nhận không khớp")
            return
        }

        if (!email || !pin) {
            toast.error("Thông tin không hợp lệ")
            return
        }

        resetPasswordMutation.mutate(
            { email, pin, newPassword: password },
            {
                onSuccess: () => {
                    router.push("/auth/login")
                }
            }
        )
    }


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Đặt lại mật khẩu</CardTitle>
                    <CardDescription>
                        Vui lòng nhập mật khẩu mới cho tài khoản {email}.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={resetPasswordMutation.isPending}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={resetPasswordMutation.isPending}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                                {resetPasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {resetPasswordMutation.isPending ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}