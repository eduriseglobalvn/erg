import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3003';

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
        const path = pathSegments?.join('/') || '';
        const url = new URL(request.url);
        const backendUrl = `${BACKEND_URL}/api/${path}${url.search}`;

        // Removed production logs (B-L5)

        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('connection');

        // [SECURE TOKENS] Inject access/refresh tokens from cookies
        const cookieAccessToken = request.cookies.get('accessToken')?.value;
        const cookieRefreshToken = request.cookies.get('refreshToken')?.value;

        // Automatically add Authorization header if not present and we have accessToken in cookie
        if (cookieAccessToken && !headers.has('Authorization')) {
            headers.set('Authorization', `Bearer ${cookieAccessToken}`);
        }

        let bodyToForward = undefined;
        let isRefreshRequest = path === 'auth/refresh';

        if (request.method !== 'GET' && request.method !== 'HEAD') {
            const rawBody = await request.arrayBuffer();

            if (isRefreshRequest && rawBody.byteLength > 0) {
                try {
                    const decodedStr = new TextDecoder().decode(rawBody);
                    const bodyObj = JSON.parse(decodedStr);
                    const cookieRefreshToken = request.cookies.get('refreshToken')?.value;

                    if (cookieRefreshToken) {
                        bodyObj.refreshToken = cookieRefreshToken;
                        bodyToForward = JSON.stringify(bodyObj);
                        headers.set('Content-Type', 'application/json');
                    } else {
                        bodyToForward = rawBody;
                    }
                } catch (e) {
                    bodyToForward = rawBody;
                }
            } else if (isRefreshRequest) {
                if (cookieRefreshToken) {
                    bodyToForward = JSON.stringify({ refreshToken: cookieRefreshToken });
                    headers.set('Content-Type', 'application/json');
                }
            } else {
                bodyToForward = rawBody;
            }
        }

        const response = await fetch(backendUrl, {
            method: request.method,
            headers: headers,
            body: bodyToForward,
        });

        // Removed production logs (B-L5)

        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('transfer-encoding');

        let responseBody = await response.text();

        // [SECURE TOKENS] Intercept login/refresh to set HttpOnly cookie
        if (response.ok && (path === 'auth/login' || path === 'auth/refresh')) {
            try {
                const data = JSON.parse(responseBody);
                if (data.refreshToken || (data.data && data.data.refreshToken)) {
                    const tokenToSet = data.refreshToken || data.data.refreshToken;
                    const accessTokenToSet = data.accessToken || data?.data?.accessToken;

                    if (tokenToSet) {
                        // Set RefreshToken HttpOnly cookie
                        responseHeaders.append(
                            'Set-Cookie',
                            `refreshToken=${tokenToSet}; Path=/api; HttpOnly; SameSite=Lax; Max-Age=2592000` // 30 days
                        );
                    }

                    if (accessTokenToSet) {
                        // Set AccessToken HttpOnly cookie
                        responseHeaders.append(
                            'Set-Cookie',
                            `accessToken=${accessTokenToSet}; Path=/api; HttpOnly; SameSite=Lax; Max-Age=86400` // 1 day
                        );
                        // Also set a non-HttpOnly flag for client-side routing checks
                        responseHeaders.append(
                            'Set-Cookie',
                            `isLoggedIn=true; Path=/; SameSite=Lax; Max-Age=2592000` // 30 days
                        );
                    }

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
        if (response.ok && path === 'auth/logout') {
            responseHeaders.append(
                'Set-Cookie',
                `refreshToken=; Path=/api; HttpOnly; SameSite=Lax; Max-Age=0`
            );
            responseHeaders.append(
                'Set-Cookie',
                `accessToken=; Path=/api; HttpOnly; SameSite=Lax; Max-Age=0`
            );
            responseHeaders.append(
                'Set-Cookie',
                `isLoggedIn=; Path=/; SameSite=Lax; Max-Age=0`
            );
        }

        if (!response.ok) {
            console.error('[API Proxy] Backend error:', responseBody);
        }

        return new NextResponse(responseBody, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });
    } catch (error: any) {
        console.error('[API Proxy Error]', error);
        return NextResponse.json(
            { error: 'Proxy error', message: error.message },
            { status: 500 }
        );
    }
}
