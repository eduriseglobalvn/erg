"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { signIn } from "next-auth/react"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { useLoginMutation } from "@/hooks/use-login"
import { isEmailNotVerifiedError } from "@/services/http-client"
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

const AppleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.24.72-.62 1.73-1.53 2.79zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.06 2.27-1.69 4.2-3.74 4.25z" />
    </svg>
)

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
        <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.16-7.27 1.95 0 3.73.71 5.05 1.88l1.94-2.1C17.69 3.26 15.34 2 12.16 2 6.61 2 2 6.61 2 12s4.61 10 10.16 10c6.83 0 10.64-5.78 10.19-10.9z" />
    </svg>
)

interface LoginFormProps extends React.ComponentPropsWithoutRef<"div"> {
    embedded?: boolean
    onSwitchToSignup?: () => void
    googleCallbackUrl?: string
    title?: string
    description?: string
}

type LoginFormContentProps = LoginFormProps & {
    reason?: string | null
}

function LoginFormContent({
    className,
    embedded = false,
    onSwitchToSignup,
    googleCallbackUrl = "/auth/google/callback",
    title = "Chào mừng trở lại",
    description = "Đăng nhập để quản lý hệ thống",
    reason = null,
    ...props
}: LoginFormContentProps) {
    const router = useRouter()
    const loginMutation = useLoginMutation()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
    const [dismissedReason, setDismissedReason] = React.useState<string | null>(null)

    const showReasonBanner = reason && dismissedReason !== reason

    const reasonMessage = React.useMemo(() => {
        if (reason === "password_changed") {
            return { type: "success" as const, text: "Mật khẩu đã được thay đổi thành công. Vui lòng đăng nhập lại." }
        }
        if (reason === "session_expired") {
            return { type: "warning" as const, text: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." }
        }
        return null
    }, [reason])

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

        loginMutation.mutate(
            { email, password, rememberMe },
            {
                onError: (error: any) => {
                    if (isEmailNotVerifiedError(error)) {
                        router.push(`/auth/otp?email=${encodeURIComponent(email)}&mode=activation`)
                    }
                }
            }
        )
    }

    const handleGoogleLogin = async () => {
        setIsGoogleSubmitting(true)

        try {
            const googleStatusResponse = await fetch("/api/auth/google/status", {
                method: "GET",
                credentials: "include",
                cache: "no-store",
            })
            const googleStatus = await googleStatusResponse.json().catch(() => ({}))

            if (!googleStatusResponse.ok || !googleStatus?.enabled) {
                throw new Error(
                    googleStatus?.message || "Đăng nhập Google chưa được cấu hình trên hệ thống."
                )
            }

            let callbackUrl = googleCallbackUrl
            if (typeof window !== "undefined") {
                const callbackTarget = new URL(googleCallbackUrl, window.location.origin)

                if (!callbackTarget.searchParams.has("returnTo")) {
                    callbackTarget.searchParams.set(
                        "returnTo",
                        `${window.location.pathname}${window.location.search}${window.location.hash}`
                    )
                }

                callbackUrl = callbackTarget.toString()
            }

            await signIn("google", {
                callbackUrl,
            })
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Không thể bắt đầu đăng nhập Google"
            toast.error(message)
        } finally {
            setIsGoogleSubmitting(false)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>

                    {showReasonBanner && reasonMessage && (
                        <div
                            className={cn(
                                "mt-2 mx-auto max-w-sm rounded-lg px-4 py-2.5 text-sm text-center",
                                reasonMessage.type === "success"
                                    ? "border border-green-200 bg-green-50 text-green-800"
                                    : "border border-amber-200 bg-amber-50 text-amber-800"
                            )}
                        >
                            {reasonMessage.text}
                            <button
                                type="button"
                                onClick={() => setDismissedReason(reason)}
                                className="ml-2 font-semibold underline underline-offset-2"
                            >
                                Ẩn
                            </button>
                        </div>
                    )}
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} method="POST" action="">
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full flex items-center gap-2"
                                    disabled={loginMutation.isPending}
                                >
                                    <AppleIcon /> Đăng nhập với Apple
                                </Button>
                                <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full flex items-center gap-2"
                                    disabled={loginMutation.isPending || isGoogleSubmitting}
                                    onClick={() => void handleGoogleLogin()}
                                >
                                    {isGoogleSubmitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" /> Đang chuyển sang Google
                                        </>
                                    ) : (
                                        <>
                                            <GoogleIcon /> Đăng nhập với Google
                                        </>
                                    )}
                                </Button>
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Hoặc tiếp tục với
                                </span>
                            </div>

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

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked: any) => setRememberMe(checked as boolean)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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

                    <div className="mt-4 text-center text-sm">
                        Chưa có tài khoản?{" "}
                        {embedded && onSwitchToSignup ? (
                            <button
                                type="button"
                                onClick={onSwitchToSignup}
                                className="font-medium underline underline-offset-4 hover:text-primary"
                            >
                                Đăng ký ngay
                            </button>
                        ) : (
                            <Link href="/auth/signup" className="font-medium underline underline-offset-4 hover:text-primary">
                                Đăng ký ngay
                            </Link>
                        )}
                    </div>
                </CardContent>
            </Card>

            {!embedded && (
                <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
                    Bằng việc tiếp tục, bạn đồng ý với <Link href="#">Điều khoản dịch vụ</Link> và <Link href="#">Chính sách quyền riêng tư</Link> của chúng tôi.
                </div>
            )}
        </div>
    )
}

function LoginFormWithSearchParams(props: LoginFormProps) {
    const searchParams = useSearchParams()
    const reason = searchParams.get("reason")

    return <LoginFormContent {...props} reason={reason} />
}

export function LoginForm(props: LoginFormProps) {
    if (props.embedded) {
        return <LoginFormContent {...props} reason={null} />
    }

    return <LoginFormWithSearchParams {...props} />
}
