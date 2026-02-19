import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',


    // Cấu hình Headers cho Production
    allowedDevOrigins: ['erg.edu.local', '*.erg.edu.local', 'erg.edu.vn', '*.erg.edu.vn'],
    async headers() {
        return [
            // === CORS Headers ===
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
            // === Cache Headers cho static assets (1 năm, immutable) ===
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            // === Cache Headers cho public media (ảnh, fonts) ===
            {
                source: '/images/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=86400, stale-while-revalidate=604800',
                    },
                ],
            },
        ];
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
        unoptimized: false, // Enable optimization
        formats: ['image/avif', 'image/webp'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },

}
export default nextConfig
