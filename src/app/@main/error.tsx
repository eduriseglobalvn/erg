'use client' // Error components must be Client Components

import { useEffect } from 'react'
import { Button } from '@/components/admin/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Public Route Error Boundary caught:", error)
    }, [error])

    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Đã xảy ra lỗi không mong muốn!</h2>
            <p className="text-gray-600 max-w-md mb-8">
                Chúng tôi rất tiếc vì sự cố này. Đội ngũ kỹ thuật đã được thông báo và đang xử lý.
            </p>
            <Button
                onClick={() => reset()}
                className="bg-[#00008b] hover:bg-blue-800"
            >
                Thử lại
            </Button>
        </div>
    )
}
