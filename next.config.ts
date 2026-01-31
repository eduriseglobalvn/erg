import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',

    // Proxy API calls to backend - DISABLED, using Route Handler instead
    // async rewrites() {
    //     const backendUrl = String(process.env.BACKEND_URL || 'http://localhost:3003');
    //     console.log('[Next.js Rewrites] Backend URL:', backendUrl);
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: `${backendUrl}/api/:path*`,
    //         },
    //     ];
    // },

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
