import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import NextBundleAnalyzer from '@next/bundle-analyzer'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')
const withBundleAnalyzer = NextBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

const isVercel = process.env.VERCEL === '1'
const localBackendConnectSrc = [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'http://erg.edu.local:8080',
    'http://admin.erg.edu.local:8080',
    'http://elearning.erg.edu.local:8080',
]

const configuredApiOrigin = (() => {
    try {
        return process.env.NEXT_PUBLIC_API_URL
            ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
            : ''
    } catch {
        return ''
    }
})()

const nextConfig: NextConfig = {
    ...(isVercel ? {} : { output: 'standalone' as const }),

    typescript: {
        ignoreBuildErrors: isVercel,
    },

    devIndicators: false,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },

    experimental: {
        ...(!isVercel
            ? {
                optimizePackageImports: [
                    'lucide-react',
                    'framer-motion',
                    '@radix-ui/react-icons',
                    'lodash',
                    'date-fns',
                    'recharts',
                    'sonner',
                    'clsx',
                    'tailwind-merge',
                    'react-dom',
                    'next-intl',
                    '@tanstack/react-query',
                ],
            }
            : {}),
        serverActions: {
            bodySizeLimit: '2mb',
        },
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
            { protocol: 'https', hostname: 'cdn.giaoducthoidai.vn' },
            { protocol: 'https', hostname: 'giaoducthoidai.vn' },
            { protocol: 'https', hostname: 'giaoduc.edu.vn' },
            { protocol: 'https', hostname: '*.cdninstagram.com' },
            { protocol: 'https', hostname: 'randomuser.me' },
        ],
    },

    // Cấu hình Headers cho Production
    allowedDevOrigins: ['erg.edu.local', '*.erg.edu.local', 'erg.edu.vn', '*.erg.edu.vn'],
    async headers() {
        const isDev = process.env.NODE_ENV === 'development'
        const directApiConnectSrc = [
            configuredApiOrigin,
            ...(isDev ? localBackendConnectSrc : []),
        ].filter(Boolean).join(' ')

        const cspHeader = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://www.googletagmanager.com ${isDev ? "'unsafe-eval'" : ''};
            style-src 'self' 'unsafe-inline';
            img-src 'self' blob: data: https:;
            font-src 'self' data: https:;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            frame-src 'self' https://www.google.com https://maps.google.com;
            frame-ancestors 'self';
            connect-src 'self' ${directApiConnectSrc} https://www.google-analytics.com https://www.googletagmanager.com https: ws: wss:;
        `.replace(/\s{2,}/g, ' ').trim()

        const mediaCacheHeaders = !isDev
            ? [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]
            : []

        return [
            // === Security & CORS Headers ===
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: process.env.NEXT_PUBLIC_DOMAIN || 'https://erg.edu.vn' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                    { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                    { key: 'Content-Security-Policy', value: cspHeader },
                ],
            },
            // === Cache Headers cho public media (chỉ production) ===
            ...(mediaCacheHeaders.length > 0
                ? [{ source: '/images/:path*', headers: mediaCacheHeaders }]
                : []),
        ]
    },
}

export default withBundleAnalyzer(withNextIntl(nextConfig))
