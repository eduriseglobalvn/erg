"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLoginMutation } from "@/hooks/use-login"

// Import UI Components
import { Button } from "@/components/admin/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Checkbox } from "@/components/admin/ui/checkbox"

// SVG Icons
const AppleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.24.72-.62 1.73-1.53 2.79zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.06 2.27-1.69 4.2-3.74 4.25z" /></svg>)
const GoogleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.16-7.27 1.95 0 3.73.71 5.05 1.88l1.94-2.1C17.69 3.26 15.34 2 12.16 2 6.61 2 2 6.61 2 12s4.61 10 10.16 10c6.83 0 10.64-5.78 10.19-10.9z" /></svg>)

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const loginMutation = useLoginMutation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    // Tự động điền Email nếu đã "Ghi nhớ" từ trước
    React.useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail")
        if (savedEmail) {
            setEmail(savedEmail)
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            return
        }

        // Check lỗi activation và redirect nếu cần
        loginMutation.mutate(
            { email, password, rememberMe },
            {
                onError: (error: any) => {
                    const errorMessage = error.message || '';
                    const lowered = errorMessage.toLowerCase();

                    if (
                        lowered.includes("not activated") ||
                        lowered.includes("account is not activated") ||
                        lowered.includes("actived") ||
                        lowered.includes("403")
                    ) {
                        router.push(`/auth/otp?email=${encodeURIComponent(email)}&mode=activation`);
                    }
                }
            }
        )
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
                    <CardDescription>
                        Đăng nhập để quản lý hệ thống
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} method="POST" action="">
                        <div className="grid gap-6">
                            {/* Social Login */}
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" type="button" className="w-full flex items-center gap-2" disabled={loginMutation.isPending}>
                                    <AppleIcon /> Đăng nhập với Apple
                                </Button>
                                <Button variant="outline" type="button" className="w-full flex items-center gap-2" disabled={loginMutation.isPending}>
                                    <GoogleIcon /> Đăng nhập với Google
                                </Button>
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Hoặc tiếp tục với
                                </span>
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loginMutation.isPending}
                                />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2 relative">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Link
                                    href="/auth/forgot-password"
                                    className="absolute right-0 top-0 text-sm underline-offset-4 hover:underline"
                                    tabIndex={-1}
                                >
                                    Quên mật khẩu?
                                </Link>

                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loginMutation.isPending}
                                        className="pr-10" // Padding right cho icon
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">
                                            {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked: any) => setRememberMe(checked as boolean)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    Ghi nhớ đăng nhập
                                </label>
                            </div>

                            <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
                                {loginMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loginMutation.isPending ? "Đang xử lý..." : "Đăng nhập"}
                            </Button>
                        </div>
                    </form>

                    {/* [MỚI] Phần nút đăng ký thêm vào đây */}
                    <div className="mt-4 text-center text-sm">
                        Chưa có tài khoản?{" "}
                        <Link href="/auth/signup" className="underline underline-offset-4 hover:text-primary font-medium">
                            Đăng ký ngay
                        </Link>
                    </div>

                </CardContent>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                Bằng việc tiếp tục, bạn đồng ý với <Link href="#">Điều khoản dịch vụ</Link> và <Link href="#">Chính sách quyền riêng tư</Link> của chúng tôi.
            </div>
        </div>
    )
}