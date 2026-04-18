/**
 * Phase 4.5: SSE Proxy Route
 *
 * GET /api/crawler/stream
 *
 * Bridges the Next.js frontend (EventSource) to the NestJS SSE backend.
 * The generic /api/[...path] proxy doesn't support streaming responses,
 * so this dedicated route forwards the SSE stream byte-for-byte.
 *
 * Auth: reads accessToken from HttpOnly cookie and injects as Bearer header.
 */

import { fetchWithBackendFallback } from '@/lib/backend-url';

export const dynamic = 'force-dynamic'; // never cache — this is a live stream

export async function GET(request: Request) {
    // Extract the cookie header from the incoming request
    const cookieHeader = request.headers.get('cookie') ?? '';

    // Parse accessToken from cookies
    const cookies = Object.fromEntries(
        cookieHeader.split(';').map(c => {
            const [k, ...v] = c.trim().split('=');
            return [k, v.join('=')];
        }),
    );
    const accessToken = cookies['accessToken'];

    const headers: Record<string, string> = {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    try {
        const response = await fetchWithBackendFallback('/api/crawler/stream', {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            return new Response(`event: error\ndata: ${JSON.stringify({ message: 'SSE connection failed' })}\n\n`, {
                status: response.status,
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                },
            });
        }

        // Stream the SSE response back to the client
        const stream = response.body;
        if (!stream) {
            return new Response(`event: error\ndata: ${JSON.stringify({ message: 'No stream from backend' })}\n\n`, {
                status: 502,
                headers: {
                    'Content-Type': 'text/event-stream',
                },
            });
        }

        // Transform stream: forward all chunks from NestJS directly
        const transformStream = new ReadableStream({
            async start(controller) {
                const reader = stream.getReader();
                const encoder = new TextEncoder();

                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        controller.enqueue(value);
                    }
                } catch (err) {
                    // Stream was interrupted (client disconnected)
                    console.warn('[SSE Proxy] Stream ended:', err);
                } finally {
                    controller.close();
                }
            },
        });

        return new Response(transformStream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache, no-transform',
                'Connection': 'keep-alive',
                'X-Accel-Buffering': 'no',
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err: any) {
        console.error('[SSE Proxy] Backend connection error:', err);
        return new Response(
            `event: error\ndata: ${JSON.stringify({ message: 'Failed to connect to SSE backend' })}\n\n`,
            {
                status: 503,
                headers: {
                    'Content-Type': 'text/event-stream',
                },
            },
        );
    }
}
