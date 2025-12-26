import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    output: 'standalone',
    // 2. Cấu hình Headers cho Production
    allowedDevOrigins : ['erg.edu.local', '*.erg.edu.local'],
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        // LƯU Ý: Prod không cho phép liệt kê nhiều domain bằng dấu phẩy.
                        // Nếu dùng nhiều domain, bạn nên dùng Middleware (xem mục 2).
                        value: 'https://erg.edu.local',
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
        unoptimized : true,
    }

}
export default nextConfig
