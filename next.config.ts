import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',

    // Proxy API calls to backend (Bypass AdBlock bằng Same-Origin Request)
    async rewrites() {
        // Lấy BACKEND_URL từ environment variable
        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        return [
            // 1. Rule RIÊNG cho Insight/Analytics (Backend CÓ dùng /api prefix)
            // Frontend: /api/insight/overview -> Backend: http://localhost:3000/api/insight/overview
            {
                source: '/api/insight/:path*',
                destination: `${backendUrl}/api/insight/:path*`,
            },

            // 2. Rule CHUNG cho các API khác (Auth, Users... - Backend KHÔNG dùng /api prefix)
            // Frontend: /api/auth/login -> Backend: http://localhost:3000/auth/login
            {
                source: '/api/:path*',
                destination: `${backendUrl}/:path*`,
            },
        ];
    },

    // Cấu hình Headers cho Production
    allowedDevOrigins: ['erg.edu.local', '*.erg.edu.local', 'erg.edu.vn', '*.erg.edu.vn'],
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        // LƯU Ý: Prod không cho phép liệt kê nhiều domain bằng dấu phẩy.
                        // Nếu dùng nhiều domain, bạn nên dùng Middleware (xem mục 2).
                        value: 'https://erg.edu.local,https://erg.edu.vn',
                    },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ]
    },

    devIndicators: false,
    images: {
        minimumCacheTTL: 60,
        unoptimized: true,
    }

}
export default nextConfig
