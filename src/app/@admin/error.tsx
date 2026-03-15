"use client" // Error boundaries must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/admin/ui/button"

export default function AdminErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Admin Boundary caught error:", error)
    }, [error])

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center p-8 text-center bg-gray-50/50 dark:bg-gray-950/50">
            <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                Đã có lỗi xảy ra
            </h2>
            <p className="mb-4 text-muted-foreground mt-2 max-w-[500px]">
                {error.message || "Chúng tôi đã ghi nhận sự cố trên màn hình quản trị này."}
            </p>
            <div className="flex gap-4">
                <Button
                    onClick={() => reset()}
                    variant="default"
                >
                    Thử lại
                </Button>
                <Button
                    onClick={() => window.location.href = "/"}
                    variant="outline"
                >
                    Về trang chủ
                </Button>
            </div>
        </div>
    )
}
