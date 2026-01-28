"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { authApi, httpClient, handleLogout } from "@/services"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import {
    InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator
} from "@/components/admin/ui/input-otp"

export function OTPForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const email = searchParams.get("email")
    const mode = searchParams.get("mode") // 'activation' | 'reset_password'

    const [isLoading, setIsLoading] = useState(false)
    const [pin, setPin] = useState("")

    useEffect(() => {
        if (!email) {
            toast.error("Thiếu thông tin email")
            router.push("/auth/login")
        }
    }, [email, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (pin.length < 6) {
            toast.warning("Vui lòng nhập đủ 6 số")
            return
        }

        setIsLoading(true)

        try {
            if (!email) throw new Error("Email invalid")

            if (mode === 'activation') {
                // CASE 1: Kích hoạt tài khoản & Tự động đăng nhập
                // Gọi API verifyPin (Backend đã sửa để trả về Token ngay sau khi verify)
                const res: any = await authApi.verifyPin({ email, pin })

                // 1. Lưu Token vào LocalStorage để Auto Login
                if (res?.accessToken) {
                    localStorage.setItem("accessToken", res.accessToken)
                    localStorage.setItem("refreshToken", res.refreshToken)
                    if (res.user) {
                        localStorage.setItem("user", JSON.stringify(res.user))
                        if (res.user.id) localStorage.setItem("userId", res.user.id)
                    }
                }

                toast.success("Kích hoạt thành công!")

                // 2. Gọi /sessions/current để lấy permissions và kiểm tra trạng thái
                try {
                    const sessionRes: any = await httpClient('/sessions/current', {
                        method: 'GET',
                        requireAuth: true,
                    });
                    const sessionData = sessionRes.data || sessionRes;

                    if (sessionData.user) {
                        // Lưu user info đầy đủ
                        localStorage.setItem("user", JSON.stringify(sessionData.user));

                        // Lưu permissions và roles
                        if (sessionData.accessControl) {
                            const permissions = sessionData.accessControl.permissions || [];
                            const roles = sessionData.accessControl.roles || [];

                            localStorage.setItem('permissions', JSON.stringify(permissions));
                            localStorage.setItem('roles', JSON.stringify(roles));
                        }

                        // Redirect về trang chủ
                        window.location.href = "/";
                    } else {
                        window.location.href = "/";
                    }
                } catch (e) {
                    console.error("Failed to fetch session:", e);
                    window.location.href = "/";
                }

            } else if (mode === 'reset_password') {
                // CASE 2: Quên mật khẩu -> Chuyển sang trang đặt pass mới
                // Ta truyền PIN qua URL để trang sau dùng gọi API resetPassword
                router.push(`/auth/change-password?email=${encodeURIComponent(email)}&pin=${pin}`)
            }
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Mã xác thực không chính xác")
        } finally {
            setIsLoading(false)
        }
    }

    const handleResend = async () => {
        if (!email) return
        try {
            await authApi.resendPin(email)
            toast.success("Đã gửi lại mã PIN mới")
        } catch (error: any) {
            toast.error(error.message || "Không thể gửi lại mã")
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Nhập mã xác thực</CardTitle>
                    <CardDescription>
                        Chúng tôi đã gửi mã 6 số đến <strong>{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 place-items-center">
                            <InputOTP maxLength={6} value={pin} onChange={(val) => setPin(val)} disabled={isLoading}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                </InputOTPGroup>
                                <InputOTPSeparator />
                                <InputOTPGroup>
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                            <Button type="submit" className="w-full" disabled={isLoading || pin.length < 6}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Đang xác thực..." : "Xác nhận"}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Không nhận được mã?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="underline underline-offset-4 hover:text-primary"
                        >
                            Gửi lại
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}