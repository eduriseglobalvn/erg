import { AuthCenterLayout } from "@/components/auth/auth-center-layout"
import { OTPForm } from "@/components/auth/otp-form"

export default function VerifyPinPage() {
    return (
        <AuthCenterLayout>
            <OTPForm />
        </AuthCenterLayout>
    )
}
