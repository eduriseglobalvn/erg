// next.config.ts
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: 'local-origin.dev, *.local-origin.dev',
                    },
                ],
            },
        ]
    },
    devIndicators: false,
}

export default nextConfig
