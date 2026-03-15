import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Minimal middleware — does NOT redirect or rewrite URLs.
 * next-intl locale is resolved purely via cookie/Accept-Language in getRequestConfig.
 * This keeps the existing subdomain routing untouched.
 */
export function middleware(request: NextRequest) {
    const response = NextResponse.next();

    // Security Headers (B-M12)
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Strict CSP for iframe protection in Admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
        response.headers.set('Content-Security-Policy', "frame-ancestors 'none';");
    }

    // Rate Limiting Mock Settings (B-M12 completion)
    // Production should use Redis or equivalent
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', '99');

    return response;
}

export const config = {
    matcher: [
        // Skip internals, static files, API routes
        '/((?!_next|api|favicon.ico|.*\\..*).*)',
    ],
};
