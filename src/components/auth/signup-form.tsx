"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { authApi } from "@/services"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.confirmPassword) {
            toast.warning("Mật khẩu xác nhận không khớp")
            return
        }

        setIsLoading(true)
        try {
            await authApi.register({
                email: formData.email,
                password: formData.password,
                fullName: formData.fullName
            })

            toast.success("Đăng ký thành công! Vui lòng xác thực email.")
            // Chuyển sang trang OTP, đánh dấu là mode kích hoạt
            router.push(`/auth/otp?email=${encodeURIComponent(formData.email)}&mode=activation`)
        } catch (error: any) {
            toast.error(error.message || "Đăng ký thất bại")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }))
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Tạo tài khoản mới</CardTitle>
                    <CardDescription>
                        Nhập thông tin bên dưới để tạo tài khoản của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullname">Họ và tên</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    type="text"
                                    placeholder="Nguyễn Văn A"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        required
                                        disabled={isLoading}
                                        className="pr-10"
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
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        disabled={isLoading}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">
                                            {showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isLoading ? "Đang xử lý..." : "Tạo tài khoản"}
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Đã có tài khoản?{" "}
                        <Link href="/auth/login" className="underline underline-offset-4">
                            Đăng nhập
                        </Link>
                    </div>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                Bằng việc tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách quyền riêng tư</a> của chúng tôi.
            </div>
        </div>
    )
}