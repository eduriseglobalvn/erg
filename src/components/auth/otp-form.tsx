"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/admin/ui/button"
import {
    Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/admin/ui/card"
import {
    InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator
} from "@/components/admin/ui/input-otp"

export function OTPForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Nhập mã xác thực</CardTitle>
                    <CardDescription>
                        Chúng tôi đã gửi mã 6 số đến email của bạn.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid gap-6 place-items-center">
                            <InputOTP maxLength={6}>
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
                            <Button type="submit" className="w-full">Xác nhận</Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm text-muted-foreground">
                        Không nhận được mã?{" "}
                        <a href="#" className="underline underline-offset-4 hover:text-primary">
                            Gửi lại
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}