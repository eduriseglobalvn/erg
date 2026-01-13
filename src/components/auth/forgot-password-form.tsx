"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import Link from "next/link"

export function ForgotPasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Quên mật khẩu?</CardTitle>
                    <CardDescription>
                        Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Địa chỉ Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Gửi hướng dẫn
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