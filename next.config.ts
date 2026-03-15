import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import NextBundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
    output: 'standalone',

    // Cấu hình Headers cho Production
    allowedDevOrigins: ['erg.edu.local', '*.erg.edu.local', 'erg.edu.vn', '*.erg.edu.vn'],
    async headers() {
        const isDev = process.env.NODE_ENV === 'development';
        const cspHeader = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""};
            style-src 'self' 'unsafe-inline';
            img-src 'self' blob: data: https:;
            font-src 'self' data: https:;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            frame-ancestors 'none';
            connect-src 'self' https: ws: wss:;
        `.replace(/\s{2,}/g, ' ').trim();

        return [
            // === Security & CORS Headers ===
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: process.env.NEXT_PUBLIC_DOMAIN || 'https://erg.edu.vn',
                    },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    { key: 'Content-Security-Policy', value: cspHeader },
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
        minimumCacheTTL: 60 * 60 * 24 * 365, // 1 năm (thay vì 60 giây)
        unoptimized: false,
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        remotePatterns: [
            { protocol: 'https', hostname: 'storage.googleapis.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: '*.googleusercontent.com' },
            { protocol: 'https', hostname: 'media.erg.edu.vn' },
            { protocol: 'https', hostname: 'images.unsplash.com' },
            { protocol: 'https', hostname: 'moet.gov.vn' },
            { protocol: 'https', hostname: '*.cdninstagram.com' },
            { protocol: 'https', hostname: 'randomuser.me' },
        ],
    },
}

export default withBundleAnalyzer(withNextIntl(nextConfig))
