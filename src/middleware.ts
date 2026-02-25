import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Minimal middleware — does NOT redirect or rewrite URLs.
 * next-intl locale is resolved purely via cookie/Accept-Language in getRequestConfig.
 * This keeps the existing subdomain routing untouched.
 */
export function middleware(request: NextRequest) {
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip internals, static files, API routes
        '/((?!_next|api|favicon.ico|.*\\..*).*)',
    ],
};
