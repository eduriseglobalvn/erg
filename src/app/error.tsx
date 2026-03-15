"use client"

import { useEffect } from "react"
import { AlertCircle } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error Boundary caught:", error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center bg-white dark:bg-zinc-950 rounded-xl shadow-sm border m-6 lg:m-24 max-w-2xl mx-auto">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-full mb-6">
                <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-4">Đã xảy ra lỗi không mong muốn!</h2>

            <p className="text-muted-foreground mb-8 text-lg">
                Hệ thống vừa gặp sự cố trong quá trình xử lý yêu cầu của bạn. Thông báo lỗi đã được ghi nhận tự động.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={() => reset()}
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Thử lại ngay
                </button>
                <a
                    href="/"
                    className="px-6 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-md hover:bg-secondary/80 transition-colors border"
                >
                    Về trang chủ
                </a>
            </div>

            {process.env.NODE_ENV === "development" && (
                <div className="mt-12 p-4 bg-muted/50 rounded-md text-left w-full overflow-auto max-h-[300px]">
                    <p className="text-xs font-bold text-red-500 mb-2">Thông tin kỹ thuật (chỉ hiện ở dev mode):</p>
                    <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">{error.message}</pre>
                </div>
            )}
        </div>
    )
}
