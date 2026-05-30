import Image from "next/image"
import { GalleryVerticalEnd } from "lucide-react" // Thay bằng icon của bạn

interface AuthCenterLayoutProps {
    children: React.ReactNode
    title?: string
    description?: string
}

export function AuthCenterLayout({ children, title, description }: AuthCenterLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                {/* Logo ở phía trên cùng */}
                <div className="flex items-center justify-center gap-2 self-center font-medium">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    ERG CMS Portal
                </div>

                {/* Nội dung Form sẽ nằm trong này */}
                {children}
            </div>
        </div>
    )
}
