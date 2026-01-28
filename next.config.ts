import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',

    // Proxy API calls to backend (Bypass AdBlock bằng Same-Origin Request)
    async rewrites() {
        // Lấy BACKEND_URL từ environment variable
        const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

        return [
            {
                // Quy tắc riêng cho analytics để tránh lỗi 500 do Header
                source: '/api/insight/:path*',
                destination: `${backendUrl}/api/insight/:path*`,
            },
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
                        value: '*', // Allow all origins to resolve CORS issues, or set to specific domain
                    },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                ],
            },
        ]
    },

    devIndicators: false,

    // Tối ưu bundle size cho các thư viện nặng (Barrel imports)
    experimental: {
        optimizePackageImports: [
            'recharts',
            'lucide-react',
            '@tiptap/react',
            'lodash',
            'framer-motion'
        ],
    },

    images: {
        minimumCacheTTL: 60,
        unoptimized: true,
    }

}
export default nextConfig
