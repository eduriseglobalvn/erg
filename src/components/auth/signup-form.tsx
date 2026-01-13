"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import Link from "next/link"

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
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
                    <form>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="fullname">Họ và tên</Label>
                                <Input id="fullname" type="text" placeholder="Nguyễn Văn A" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <Input id="password" type="password" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
                                <Input id="confirm-password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">Tạo tài khoản</Button>
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