import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers();
    const host = headersList.get('host') || 'erg.edu.vn';
    const protocol = (host.includes('localhost') || host.includes('.local')) ? 'http' : 'https';
    const domain = `${protocol}://${host}`;

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/_next/'],
        },
        sitemap: [
            `${domain}/sitemap.xml`,
            `${domain}/sitemap-images.xml`
        ],
    };
}
