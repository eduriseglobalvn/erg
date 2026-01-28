import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
    // Chỉ can thiệp vào các request gọi tới plugin analytics/insight
    if (request.nextUrl.pathname.startsWith('/api/insight')) {
        console.log('[Proxy] Handling analytics request:', request.nextUrl.pathname)
        const requestHeaders = new Headers(request.headers)

        // Xóa header Origin và Referer vì BE trên Hugging Face bị crash khi nhận domain local (erg.edu.local)
        // BE sẽ coi đây là một request trực tiếp (giống như gọi curl) và trả về 201 Success
        requestHeaders.delete('origin')
        requestHeaders.delete('referer')

        // Đảm bảo Host header khớp với destination (Hugging Face yêu cầu)
        const backendUrl = new URL(process.env.BACKEND_URL || 'https://erg2025-erg-be.hf.space')
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

// Chỉ chạy middleware cho các route API
export const config = {
    matcher: [
        '/api/insight/:path*',
        // Thêm các route khác nếu cần
    ],
}
