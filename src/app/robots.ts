import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { resolveSiteContextFromHeaders } from '@/lib/site-context';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers();
    const siteContext = resolveSiteContextFromHeaders(headersList);
    const domain = siteContext.baseUrl;

    const hostname = siteContext.hostname;
    const isLocal = siteContext.host.includes('localhost') || siteContext.hostname.endsWith('.local');
    const rootDomain = isLocal ? 'erg.edu.local' : 'erg.edu.vn';
    const isRoot = hostname === rootDomain || hostname === 'localhost' || hostname === `www.${rootDomain}`;
    const subdomain = isRoot ? '' : hostname.replace(`.${rootDomain}`, '');

    const sitemap = [`${domain}/sitemap.xml`, `${domain}/sitemap-images.xml`];

    // Host quản trị: chặn toàn bộ.
    if (subdomain === 'cms' || siteContext.isAdmin) {
        return { rules: [{ userAgent: '*', disallow: ['/'] }] };
    }

    const disallowPaths = [
        '/cms', '/api/', '/auth/', '/preview/', '/onboarding/', '/verify-pin/',
        '/tuyen-dung/track/', '/tuyen-dung/theo-doi',
    ];

    return {
        rules: [
            {
                userAgent: '*',
                allow: ['/'],
                disallow: disallowPaths,
            },
            {
                userAgent: 'CocCocBot-Web',
                allow: ['/'],
                disallow: disallowPaths,
            },
        ],
        sitemap,
        host: domain,
    };
}
