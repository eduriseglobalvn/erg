import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://erg.edu.vn';

    try {
        console.log(`[${new Date().toISOString()}] [Sitemap] Fetching from: ${apiUrl}/sitemap/data`);
        // Fetch sitemap data from Backend
        const response = await fetch(`${apiUrl}/sitemap/data`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to fetch sitemap data:', response.status);
            return [];
        }

        const json = await response.json();

        // Ensure json.data.urls exists and is an array
        const urls = json.data?.urls;

        if (!urls || !Array.isArray(urls)) {
            // Fallback minimal sitemap
            return [
                {
                    url: domain,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 1,
                },
                {
                    url: `${domain}/tin-tuc`,
                    lastModified: new Date(),
                    changeFrequency: 'hourly',
                    priority: 0.8,
                }
            ];
        }

        // Map Backend data to Next.js Sitemap format
        return urls.map((item: any) => ({
            // Nếu loc đã là URL tuyệt đối (bắt đầu bằng http), dùng luôn. Ngược lại ghép với domain.
            url: item.loc.startsWith('http') ? item.loc : `${domain}${item.loc.startsWith('/') ? item.loc : `/${item.loc}`}`,
            lastModified: item.lastmod || new Date(),
            changeFrequency: item.changefreq || 'daily',
            priority: item.priority || 0.5,
        }));

    } catch (error) {
        console.error('Sitemap generation error:', error);
        return [
            {
                url: domain,
                lastModified: new Date(),
            }
        ];
    }
}
