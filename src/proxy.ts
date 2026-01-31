import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    // Can thiệp vào tất cả các request gọi tới /api/*
    if (request.nextUrl.pathname.startsWith('/api/')) {
        console.log('[Proxy] Handling API request:', request.nextUrl.pathname)
        const requestHeaders = new Headers(request.headers)

        // Xóa header Origin và Referer vì BE trên Hugging Face/Vercel bi crash khi nhận domain local (erg.edu.local)
        // BE sẽ coi đây là một request trực tiếp (giống như gọi curl) và trả về Success
        requestHeaders.delete('origin')
        requestHeaders.delete('referer')

        // Đảm bảo Host header khớp với destination (Tránh lỗi 403/500 trên một số Cloud Provider)
        const backendUrl = new URL(process.env.BACKEND_URL || 'http://localhost:3003')
        requestHeaders.set('host', backendUrl.host)

        const response = NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
        return response
    }

    return NextResponse.next()
}

// Chạy proxy cho tất cả các route API
export const config = {
    matcher: [
        '/api/:path*',
    ],
}
