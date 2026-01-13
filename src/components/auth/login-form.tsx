"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { Separator } from "@/components/admin/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

// SVG Icons cho Apple và Google
const AppleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.24.72-.62 1.73-1.53 2.79zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.06 2.27-1.69 4.2-3.74 4.25z"/></svg>)
const GoogleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.16-7.27 1.95 0 3.73.71 5.05 1.88l1.94-2.1C17.69 3.26 15.34 2 12.16 2 6.61 2 2 6.61 2 12s4.61 10 10.16 10c6.83 0 10.64-5.78 10.19-10.9z"/></svg>)

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Giả lập login thành công
        toast.success("Đăng nhập thành công")
        router.push("/")
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Chào mừng trở lại</CardTitle>
                    <CardDescription>
                        Đăng nhập bằng tài khoản Apple hoặc Google của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full flex items-center gap-2">
                                    <AppleIcon /> Đăng nhập với Apple
                                </Button>
                                <Button variant="outline" className="w-full flex items-center gap-2">
                                    <GoogleIcon /> Đăng nhập với Google
                                </Button>
                            </div>
                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Hoặc tiếp tục với
                </span>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Link href="/auth/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <Input id="password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">Đăng nhập</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                Bằng việc tiếp tục, bạn đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách quyền riêng tư</a> của chúng tôi.
            </div>
        </div>
    )
}