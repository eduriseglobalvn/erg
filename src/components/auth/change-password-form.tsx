"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import { Input } from "@/components/admin/ui/input"
import { Label } from "@/components/admin/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ChangePasswordForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        toast.success("Mật khẩu đã được thay đổi thành công!")
        router.push("/auth/login")
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Đặt lại mật khẩu</CardTitle>
                    <CardDescription>
                        Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">Mật khẩu mới</Label>
                                <Input id="new-password" type="password" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                                <Input id="confirm-password" type="password" required />
                            </div>
                            <Button type="submit" className="w-full">
                                Cập nhật mật khẩu
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}