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

    const allowPaths = ['/'];
    const disallowPaths = ['/api/', '/_next/', '/auth/', '/preview/', '/onboarding/', '/verify-pin/'];

    if (isRoot || subdomain === 'cms') {
        disallowPaths.push('/cms/');
    }

    return {
        rules: [
            {
                userAgent: '*',
                allow: allowPaths,
                disallow: disallowPaths,
            },
            {
                userAgent: 'CocCocBot-Web',
                allow: ['/'],
            },
        ],
        sitemap: [
            `${domain}/sitemap.xml`,
            `${domain}/sitemap-images.xml`,
        ],
        host: domain,
    };
}
