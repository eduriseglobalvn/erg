import { AuthCenterLayout } from "@/components/auth/auth-center-layout"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
    return (
        <AuthCenterLayout>
            <LoginForm />
        </AuthCenterLayout>
    )
}