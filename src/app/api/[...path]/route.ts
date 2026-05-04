import { NextRequest, NextResponse } from 'next/server';
import { fetchWithBackendFallback } from '@/lib/backend-url';
import { appendAuthCookies, appendLogoutCookies } from '@/lib/auth-cookies';

const ACCESS_COOKIE_NAMES = ['erg_access_token', 'accessToken'];
const REFRESH_COOKIE_NAMES = ['erg_refresh_token', 'refreshToken'];
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const TRUSTED_REQUEST_HEADERS = [
    'accept',
    'accept-language',
    'authorization',
    'content-type',
    'user-agent',
    'x-tenant-id',
    'x-request-id',
    'x-trace-id',
] as const;

function firstCookie(request: NextRequest, names: string[]) {
    for (const name of names) {
        const value = request.cookies.get(name)?.value;
        if (value) return value;
    }
    return undefined;
}

function hasAuthCookie(request: NextRequest) {
    return Boolean(
        firstCookie(request, ACCESS_COOKIE_NAMES) ||
        firstCookie(request, REFRESH_COOKIE_NAMES)
    );
}

function isSameOrigin(value: string, requestOrigin: string) {
    try {
        return new URL(value).origin === requestOrigin;
    } catch {
        return false;
    }
}

function validateMutationOrigin(request: NextRequest) {
    if (!MUTATING_METHODS.has(request.method)) {
        return null;
    }

    const requestOrigin = new URL(request.url).origin;
    const origin = request.headers.get('origin');
    if (origin) {
        return origin === requestOrigin ? null : 'Cross-origin mutation requests are not allowed';
    }

    const referer = request.headers.get('referer');
    if (referer) {
        return isSameOrigin(referer, requestOrigin) ? null : 'Cross-origin mutation requests are not allowed';
    }

    const secFetchSite = request.headers.get('sec-fetch-site');
    if (secFetchSite) {
        return secFetchSite === 'same-origin' || secFetchSite === 'none'
            ? null
            : 'Cross-site mutation requests are not allowed';
    }

    return hasAuthCookie(request)
        ? 'Missing Origin/Referer for authenticated mutation request'
        : null;
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const params = await context.params;
    return proxyRequest(request, params.path);
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const params = await context.params;
    return proxyRequest(request, params.path);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const params = await context.params;
    return proxyRequest(request, params.path);
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const params = await context.params;
    return proxyRequest(request, params.path);
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const params = await context.params;
    return proxyRequest(request, params.path);
}

async function proxyRequest(request: NextRequest, pathSegments: string[]) {
    try {
        const mutationOriginError = validateMutationOrigin(request);
        if (mutationOriginError) {
            return NextResponse.json(
                { error: 'Forbidden', message: mutationOriginError },
                { status: 403 }
            );
        }

        const path = pathSegments?.join('/') || '';
        const url = new URL(request.url);
        const backendPath = `/api/${path}${url.search}`;

        // Removed production logs (B-L5)

        const headers = new Headers();
        TRUSTED_REQUEST_HEADERS.forEach((name) => {
            const value = request.headers.get(name);
            if (value) headers.set(name, value);
        });

        // [SECURE TOKENS] Inject access/refresh tokens from cookies
        const cookieAccessToken = firstCookie(request, ACCESS_COOKIE_NAMES);
        const cookieRefreshToken = firstCookie(request, REFRESH_COOKIE_NAMES);

        // Automatically add Authorization header if not present and we have accessToken in cookie
        if (cookieAccessToken && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${cookieAccessToken}`);
        }

        let bodyToForward: BodyInit | undefined = undefined;
        const isRefreshRequest = path === 'auth/refresh';

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const rawBody = await request.arrayBuffer();
            const requestContentType = request.headers.get('content-type') || '';
            const bodyIsText =
                requestContentType.includes('application/json') ||
                requestContentType.startsWith('text/');
            const rawText = rawBody.byteLength > 0 && bodyIsText
                ? new TextDecoder().decode(rawBody)
                : '';

            if (isRefreshRequest && rawBody.byteLength > 0) {
                try {
                    const bodyObj = JSON.parse(rawText || '{}');
                    const cookieRefreshToken = firstCookie(request, REFRESH_COOKIE_NAMES);

                    if (cookieRefreshToken) {
                        bodyObj.refreshToken = cookieRefreshToken;
                        bodyToForward = JSON.stringify(bodyObj);
                        headers.set('Content-Type', 'application/json');
                    } else {
                        bodyToForward = bodyIsText ? rawText : new Uint8Array(rawBody);
                    }
                } catch (e) {
                    bodyToForward = bodyIsText ? rawText : new Uint8Array(rawBody);
                }
            } else if (isRefreshRequest) {
                if (cookieRefreshToken) {
                    bodyToForward = JSON.stringify({ refreshToken: cookieRefreshToken });
                    headers.set('Content-Type', 'application/json');
                }
            } else {
                bodyToForward = bodyIsText ? rawText : new Uint8Array(rawBody);
            }
        }

        const response = await fetchWithBackendFallback(backendPath, {
            method: request.method,
            headers: headers,
            body: bodyToForward,
        });

        // Removed production logs (B-L5)

        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('transfer-encoding');
        responseHeaders.delete('content-length');
        responseHeaders.delete('content-encoding'); 

        let responseBody = await response.text();

        // [SECURE TOKENS] Intercept login/refresh to set HttpOnly cookie
        if (response.ok && (path === 'auth/login' || path === 'auth/refresh')) {
            try {
                const data = JSON.parse(responseBody);
                if (data.refreshToken || (data.data && data.data.refreshToken)) {
                    const tokenToSet = data.refreshToken || data.data.refreshToken;
                    const accessTokenToSet = data.accessToken || data?.data?.accessToken;
                    const userPayload = data.user || data.data?.user;

                    appendAuthCookies(responseHeaders, {
                        refreshToken: tokenToSet,
                        accessToken: accessTokenToSet,
                        userId: userPayload?.id,
                        provider: userPayload?.provider,
                        accountType: userPayload?.accountType,
                    });

                    // Remove tokens from payload sent to client for extra security
                    if (data.refreshToken) delete data.refreshToken;
                    if (data.data && data.data.refreshToken) delete data.data.refreshToken;
                    if (data.accessToken) delete data.accessToken;
                    if (data.data && data.data.accessToken) delete data.data.accessToken;

                    responseBody = JSON.stringify(data);
                }
            } catch (e) {
                console.error('[API Proxy] Error parsing auth response', e);
            }
        }

        // [SECURE TOKENS] Intercept logout to clear cookie
        if (path === 'auth/logout') {
            appendLogoutCookies(responseHeaders);
            return new NextResponse(
                responseBody || JSON.stringify({ success: true, message: 'Logged out' }),
                {
                    status: 200,
                    headers: responseHeaders,
                }
            );
        }

        if (!response.ok) {
            if (process.env.NODE_ENV === 'production') {
                console.error('[API Proxy] Backend error:', response.status, backendPath);
            } else {
                console.error('[API Proxy] Backend error:', responseBody);
            }
        }

        return new NextResponse(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error('[API Proxy Error]', error);

        if (pathSegments?.join('/') === 'auth/logout') {
            const headers = new Headers();
            appendLogoutCookies(headers);
            return new NextResponse(
                JSON.stringify({
                    success: true,
                    message: 'Logged out locally while backend is unavailable',
                }),
                {
                    status: 200,
                    headers,
                }
            );
        }

        return NextResponse.json(
            { error: 'Service Unavailable', message: 'Dịch vụ đang tạm thời không khả dụng. Vui lòng thử lại sau.' },
            { status: 503 }
        );
    }
}
