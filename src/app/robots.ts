import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
    const headersList = await headers();
    const host = headersList.get('host') || 'erg.edu.vn';
    const protocol = (host.includes('localhost') || host.includes('.local')) ? 'http' : 'https';
    const domain = `${protocol}://${host}`;

    // 1. Phân tích Hostname & Subdomain
    const hostname = host.split(':')[0];
    const isLocal = host.includes('localhost') || host.includes('.local');
    const rootDomain = isLocal ? 'erg.edu.local' : 'erg.edu.vn';
    const isRoot = hostname === rootDomain || hostname === 'localhost' || hostname === `www.${rootDomain}`;
    // Tìm subdomain hiện tại (nếu không phải root)
    const subdomain = isRoot ? '' : hostname.replace(`.${rootDomain}`, '');

    // 2. Định nghĩa Rules theo Subdomain
    let allowPaths = ['/'];
    let disallowPaths = ['/api/', '/_next/', '/auth/', '/preview/', '/onboarding/', '/verify-pin/'];

    // Nếu RootDomain/Main thì ẩn admin
    if (isRoot || subdomain === 'admin') {
        disallowPaths.push('/admin/');
    }

    return {
        rules: [
            {
                userAgent: '*',
                allow: allowPaths,
                disallow: disallowPaths,
            },
            {
                userAgent: 'CocCocBot-Web', // Không block trình duyệt Cốc Cốc
                allow: ['/']
            }
        ],
        sitemap: [
            `${domain}/sitemap.xml`,
            `${domain}/sitemap-images.xml`
        ],
        host: domain
    };
}
