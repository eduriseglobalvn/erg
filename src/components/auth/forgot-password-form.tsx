"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { authApi } from "@/services"
import { RateLimitError } from "@/services/http-client"
import { Button } from "@/components/cms/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/cms/ui/card"
import { Input } from "@/components/cms/ui/input"
import { Label } from "@/components/cms/ui/label"

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await authApi.forgotPassword(email)
            toast.success("Mã xác thực đã được gửi tới email của bạn")
            // Chuyển sang OTP, đánh dấu là mode reset password
            router.push(`/auth/otp?email=${encodeURIComponent(email)}&mode=reset_password`)
        } catch (error: any) {
            // Handle 429 Rate Limit
            if (error instanceof RateLimitError || error.status === 429) {
                const retrySec = error.retryAfterSec ?? error.data?.retryAfter ?? 60;
                toast.error(`Quá nhiều yêu cầu. Vui lòng thử lại sau ${retrySec} giây.`, { duration: Infinity });
                return;
            }
            toast.error(error.message || "Gửi yêu cầu thất bại");
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Quên mật khẩu?</CardTitle>
                    <CardDescription>
                        Nhập email của bạn và chúng tôi sẽ gửi mã PIN khôi phục.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Địa chỉ Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Đang gửi..." : "Gửi mã xác thực"}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Nhớ lại mật khẩu?{" "}
                        <Link href="/auth/login" className="underline underline-offset-4">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}