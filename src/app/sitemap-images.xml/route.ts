import { NextRequest, NextResponse } from 'next/server';
import { getPreferredBackendBaseUrl } from '@/lib/backend-url';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const apiUrl = getPreferredBackendBaseUrl();

    try {
        const response = await fetch(`${apiUrl}/api/sitemap/images.xml`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            return new NextResponse('Error fetching image sitemap', { status: response.status });
        }

        const xml = await response.text();

        return new NextResponse(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
            },
        });
    } catch (error) {
        console.error('Image sitemap proxy error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
