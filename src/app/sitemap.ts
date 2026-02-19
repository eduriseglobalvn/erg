import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const apiUrl = process.env.BACKEND_URL || 'http://localhost:3003';
    // const domain = process.env.NEXT_PUBLIC_DOMAIN || 'https://erg.edu.vn'; // OLD static domain

    try {
        const headersList = await headers();
        const host = headersList.get('host') || 'erg.edu.vn';
        // Xử lý cả port (localhost:3000) và protocol (https)
        const protocol = (host.includes('localhost') || host.includes('.local')) ? 'http' : 'https';
        const domain = `${protocol}://${host}`;

        if (process.env.NODE_ENV === 'development') {
            console.log(`[${new Date().toISOString()}] [Sitemap] Fetching for domain: ${domain}`);
        }


        // Fetch sitemap data from Backend specific to this domain
        const response = await fetch(`${apiUrl}/api/sitemap/data?domain=${host}`, {
            cache: 'no-store',
        });

        if (!response.ok) {
            console.error('Failed to fetch sitemap data:', response.status);
            return [];
        }

        const json = await response.json();
        const urls = json.data?.urls || [];

        // 1. Phân tích Hostname & Subdomain
        const hostname = host.split(':')[0];
        const isLocal = host.includes('localhost') || host.includes('.local');
        const rootDomain = isLocal ? 'erg.edu.local' : 'erg.edu.vn';

        // Root là khi không có subdomain hoặc là localhost/www
        const isRoot = hostname === rootDomain || hostname === 'localhost' || hostname === `www.${rootDomain}`;

        // Tìm subdomain hiện tại (nếu không phải root)
        const subdomain = isRoot ? '' : hostname.replace(`.${rootDomain}`, '');

        // 2. Định nghĩa toàn bộ trang tĩnh theo từng Subdomain/Main
        const PAGES_CONFIG = {
            main: [
                { path: '', priority: 1, changefreq: 'daily' },
                { path: '/linh-vuc-dao-tao', priority: 0.9, changefreq: 'weekly' },
                { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
                { path: '/tuyen-dung', priority: 0.8, changefreq: 'daily' },
                { path: '/gia-tri-cot-loi', priority: 0.7, changefreq: 'monthly' },
                { path: '/tam-nhin-su-menh', priority: 0.7, changefreq: 'monthly' },
                { path: '/cau-chuyen-cua-erg', priority: 0.7, changefreq: 'monthly' },
                { path: '/doi-ngu-lanh-dao', priority: 0.7, changefreq: 'monthly' },
                { path: '/doi-tac', priority: 0.6, changefreq: 'monthly' },
                { path: '/co-hoi-nghe-nghiep', priority: 0.6, changefreq: 'monthly' },
                { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
            ],
            tuyendung: [
                { path: '', priority: 1, changefreq: 'daily' },
                { path: '/tuyen-dung', priority: 0.9, changefreq: 'daily' },
                { path: '/van-hoa', priority: 0.7, changefreq: 'monthly' },
                { path: '/chinh-sach', priority: 0.7, changefreq: 'monthly' },
                { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
            ],
            tinhocquocte: [
                { path: '', priority: 1, changefreq: 'daily' },
                { path: '/khoa-hoc', priority: 0.9, changefreq: 'weekly' },
                { path: '/khoa-hoc/mos', priority: 0.9, changefreq: 'weekly' },
                { path: '/khoa-hoc/ic3-gs6', priority: 0.9, changefreq: 'weekly' },
                { path: '/khoa-hoc/ic3-spark-gs6', priority: 0.9, changefreq: 'weekly' },
                { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
                { path: '/gioi-thieu', priority: 0.7, changefreq: 'monthly' },
                { path: '/lo-trinh', priority: 0.7, changefreq: 'monthly' },
                { path: '/doi-ngu-giao-vien', priority: 0.7, changefreq: 'monthly' },
                { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
            ],
            tinhocquocgia: [
                { path: '', priority: 1, changefreq: 'daily' },
                { path: '/khoa-hoc', priority: 0.9, changefreq: 'weekly' },
                { path: '/khoa-hoc/cntt-co-ban', priority: 0.9, changefreq: 'weekly' },
                { path: '/khoa-hoc/cntt-nang-cao', priority: 0.9, changefreq: 'weekly' },
                { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
                { path: '/lo-trinh', priority: 0.7, changefreq: 'monthly' },
                { path: '/doi-ngu-giao-vien', priority: 0.7, changefreq: 'monthly' },
                { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
            ],
            tinhocthieunhi: [
                { path: '', priority: 1, changefreq: 'daily' },
                { path: '/khoa-hoc', priority: 0.9, changefreq: 'weekly' },
                { path: '/khoa-hoc/lap-trinh-scratch', priority: 0.9, changefreq: 'weekly' },
                { path: '/khoa-hoc/lap-trinh-python-thieu-nhi', priority: 0.9, changefreq: 'weekly' },
                { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
                { path: '/doi-ngu-giao-vien', priority: 0.7, changefreq: 'monthly' },
                { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
            ],
            ai: [
                { path: '', priority: 1, changefreq: 'daily' },
            ],
            congdanso: [
                { path: '', priority: 1, changefreq: 'daily' },
                { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
                { path: '/lo-trinh', priority: 0.7, changefreq: 'monthly' },
                { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
            ],
            dientoandammay: [
                { path: '', priority: 1, changefreq: 'daily' },
            ]
        };

        const sitemapEntries: MetadataRoute.Sitemap = [];

        // 3. Xử lý logic Root Domain (Gộp tất cả entry points của subdomains)
        if (isRoot) {
            // Thêm các trang tĩnh của @main
            PAGES_CONFIG.main.forEach(route => {
                sitemapEntries.push({
                    url: `${domain}${route.path}`,
                    lastModified: new Date(),
                    changeFrequency: route.changefreq as any,
                    priority: route.priority
                });
            });

            // Thêm entry points cho các subdomains khác
            Object.keys(PAGES_CONFIG).filter(k => k !== 'main').forEach(subKey => {
                const subHost = isLocal ? `${subKey}.${rootDomain}:3000` : `${subKey}.${rootDomain}`;
                sitemapEntries.push({
                    url: `${protocol}://${subHost}`,
                    lastModified: new Date(),
                    changeFrequency: 'daily',
                    priority: 0.9
                });
            });
        } else {
            // 4. Xử lý logic Subdomain cụ thể
            const subRoutes = PAGES_CONFIG[subdomain as keyof typeof PAGES_CONFIG] || [{ path: '', priority: 1, changefreq: 'daily' }];
            subRoutes.forEach(route => {
                sitemapEntries.push({
                    url: `${domain}${route.path}`,
                    lastModified: new Date(),
                    changeFrequency: route.changefreq as any,
                    priority: route.priority
                });
            });
        }

        // Nếu BE không trả về URLs (như local đang bị), trả về sitemapEntries đã quét được
        if (!urls || urls.length === 0) {
            return sitemapEntries;
        }

        // 5. Kết hợp với dữ liệu động từ Backend
        const dynamicEntries = urls.map((item: any) => {
            const loc = item.loc.startsWith('http') ? item.loc : `${domain}${item.loc.startsWith('/') ? item.loc : `/${item.loc}`}`;
            const urlObj = item.loc.startsWith('http') ? new URL(item.loc) : null;
            const path = urlObj ? urlObj.pathname : (item.loc.startsWith('/') ? item.loc : `/${item.loc}`);

            // Heuristic priorities if not provided by BE
            let priority = item.priority;
            if (!priority) {
                if (path === '/' || path === '') priority = 1.0;
                else if (path.includes('/linh-vuc-dao-tao')) priority = 0.8;
                else if (path.includes('/tin-tuc')) priority = 0.6;
                else priority = 0.5;
            }

            return {
                url: loc,
                lastModified: item.lastmod || new Date(),
                changeFrequency: item.changefreq || (path === '/' ? 'daily' : 'weekly'),
                priority: priority,
                // [NEW] Image Sitemap Support
                images: item.images?.map((img: any) => ({
                    url: img.loc,
                    title: img.title,
                    caption: img.caption
                }))
            };
        });

        // Hợp nhất (Merge) sitemapEntries (subdomains + primary sections) với dynamicEntries
        // Đảm bảo không bị trùng lặp URL
        const existingUrls = new Set(sitemapEntries.map(e => e.url));
        const finalEntries: MetadataRoute.Sitemap = [...sitemapEntries];

        dynamicEntries.forEach((entry: any) => {
            if (!existingUrls.has(entry.url)) {
                finalEntries.push(entry);
                existingUrls.add(entry.url);
            }
        });

        return finalEntries;

    } catch (error) {
        console.error('Sitemap generation error:', error);
        return [];
    }
}
