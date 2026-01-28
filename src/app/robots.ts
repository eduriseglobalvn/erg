import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://erg.edu.vn';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/api/', '/_next/'],
        },
        sitemap: `${domain}/sitemap.xml`,
    };
}
