import { AuthCenterLayout } from "@/components/auth/auth-center-layout"
import { SignupForm } from "@/components/auth/signup-form"

export default function SignupPage() {
    return (
        <AuthCenterLayout>
            <SignupForm />
        </AuthCenterLayout>
    )
}