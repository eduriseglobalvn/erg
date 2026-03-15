'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html lang="vi">
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-slate-800 p-4 font-sans">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Lỗi Hệ Thống Nghiêm Trọng</h2>
                        <p className="text-gray-500 mb-6 text-sm">{error.message || 'Lỗi trang không phản hồi. Vui lòng thử lại hoặc liên hệ quản trị viên.'}</p>
                        <button
                            onClick={() => reset()}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors"
                        >
                            Tải lại trang
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
