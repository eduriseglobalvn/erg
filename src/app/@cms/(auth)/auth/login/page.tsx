import { Suspense } from "react"
import { AuthCenterLayout } from "@/components/auth/auth-center-layout"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <AuthCenterLayout>
            {/*
                [MỚI] Suspense boundary required vì LoginForm dùng useSearchParams().
                Dự phòng (fallback) hiển thị form login không có banner để tránh flash.
            */}
            <Suspense fallback={null}>
                <LoginForm />
            </Suspense>
        </AuthCenterLayout>
    )
}