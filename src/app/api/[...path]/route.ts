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

        console.log('[API Proxy]', request.method, backendUrl);

        const headers = new Headers(request.headers);
        headers.delete('host');
        headers.delete('connection');

        const body = request.method !== 'GET' && request.method !== 'HEAD'
            ? await request.text()
            : undefined;

        const response = await fetch(backendUrl, {
            method: request.method,
            headers: headers,
            body: body,
        });

        console.log('[API Proxy] Backend response:', response.status, response.statusText);

        const responseHeaders = new Headers(response.headers);
        responseHeaders.delete('transfer-encoding');

        const responseBody = await response.text();

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
