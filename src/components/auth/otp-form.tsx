"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useVerifyPinMutation, useResendPinMutation } from "@/hooks/use-verify-pin"
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

    const [pin, setPin] = useState("")

    // TanStack Query mutations
    const verifyPinMutation = useVerifyPinMutation()
    const resendPinMutation = useResendPinMutation()

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

        if (!email) {
            toast.error("Email invalid")
            return
        }

        if (mode === 'activation') {
            // CASE 1: Kích hoạt tài khoản & Tự động đăng nhập
            verifyPinMutation.mutate({ email, pin })
        } else if (mode === 'reset_password') {
            // CASE 2: Quên mật khẩu -> Chuyển sang trang đặt pass mới
            router.push(`/auth/change-password?email=${encodeURIComponent(email)}&pin=${pin}`)
        }
    }

    const handleResend = () => {
        if (!email) return
        resendPinMutation.mutate(email)
    }

    const isLoading = verifyPinMutation.isPending

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