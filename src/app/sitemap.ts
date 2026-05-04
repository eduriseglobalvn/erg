import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { resolveSiteContext, resolveSiteContextFromHeaders } from '@/lib/site-context';
import { getPreferredBackendBaseUrl } from '@/lib/backend-url';
import { TRAINING_FIELDS } from '@/constants/training-fields';

export const dynamic = 'force-dynamic';

// ─── Static pages config ───────────────────────────────────────────────────
// Toàn bộ trang tĩnh của từng subdomain — KHÔNG phụ thuộc BE.
// BE chỉ cần cho bài viết / tin tức động.
const PAGES_CONFIG = {
    main: [
        { path: '', priority: 1, changefreq: 'daily' },
        { path: '/linh-vuc-dao-tao', priority: 0.9, changefreq: 'weekly' },
        ...TRAINING_FIELDS.map((field) => ({
            path: field.link,
            priority: 0.82,
            changefreq: 'weekly'
        })),
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
        { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
        { path: '/khoa-hoc', priority: 0.9, changefreq: 'weekly' },
        { path: '/doi-ngu-giao-vien', priority: 0.7, changefreq: 'monthly' },
        { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
    ],
    congdanso: [
        { path: '', priority: 1, changefreq: 'daily' },
        { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
        { path: '/lo-trinh', priority: 0.7, changefreq: 'monthly' },
        { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
    ],
    dientoandammay: [
        { path: '', priority: 1, changefreq: 'daily' },
    ],
    elearning: [
        { path: '', priority: 1, changefreq: 'weekly' },
        { path: '/level/secondary/gs6-level-1', priority: 0.9, changefreq: 'weekly' },
        { path: '/level/secondary/gs6-level-2', priority: 0.9, changefreq: 'weekly' },
        { path: '/level/secondary/gs6-level-3', priority: 0.9, changefreq: 'weekly' },
    ],
};

// ─── Helper ────────────────────────────────────────────────────────────────
function buildStaticEntries(host: string, deployDate: Date): MetadataRoute.Sitemap {
    const siteContext = resolveSiteContext(host);
    const isLocal = siteContext.protocol === 'http';
    const domain = siteContext.baseUrl;
    const port = host.includes(':') ? `:${host.split(':')[1]}` : '';
    const localRootHost = host.includes('localhost') ? 'localhost' : siteContext.rootDomain;

    const entries: MetadataRoute.Sitemap = [];

    if (siteContext.isRoot) {
        PAGES_CONFIG.main.forEach(route => {
            entries.push({
                url: `${domain}${route.path}`,
                lastModified: deployDate,
                changeFrequency: route.changefreq as any,
                priority: route.priority,
            });
        });

        Object.keys(PAGES_CONFIG)
            .filter(k => k !== 'main')
            .forEach(subKey => {
                const subHost = isLocal
                    ? `${subKey}.${localRootHost}${port}`
                    : `${subKey}.${siteContext.rootDomain}`;
                entries.push({
                    url: `${siteContext.protocol}://${subHost}`,
                    lastModified: deployDate,
                    changeFrequency: 'daily',
                    priority: 0.9,
                });
            });
    } else {
        const subRoutes =
            PAGES_CONFIG[siteContext.siteKey as keyof typeof PAGES_CONFIG] ||
            [{ path: '', priority: 1, changefreq: 'daily' }];

        subRoutes.forEach(route => {
            entries.push({
                url: `${domain}${route.path}`,
                lastModified: deployDate,
                changeFrequency: route.changefreq as any,
                priority: route.priority,
            });
        });
    }

    return entries;
}

// ─── Main export ───────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const apiUrl = getPreferredBackendBaseUrl();
    const deployDate = new Date(process.env.BUILD_DATE || new Date().toISOString());

    let host = resolveSiteContext('').host;
    try {
        const headersList = await headers();
        host = resolveSiteContextFromHeaders(headersList).host;
    } catch { /* fallback đã set trên */ }

    if (process.env.NODE_ENV === 'development') {
        console.log(`[Sitemap] Building for host: ${host}`);
    }

    // 1. Luôn build static entries trước — không cần BE
    const staticEntries = buildStaticEntries(host, deployDate);

    // 2. Chỉ gọi BE để lấy bài viết / tin tức động
    try {
        const sitemapQuery = new URLSearchParams({ domain: host });
        const response = await fetch(`${apiUrl}/api/sitemap/data?${sitemapQuery.toString()}`, {
            cache: 'no-store',
            signal: AbortSignal.timeout(5000), // timeout 5s, không chờ BE mãi
        });

        if (!response.ok) {
            console.error(`[Sitemap] BE returned ${response.status} for ${host}`);
            return staticEntries;
        }

        const json = await response.json();
        const dynamicUrls: any[] = json.data?.urls || [];

        if (!dynamicUrls.length) return staticEntries;

        const siteContext = resolveSiteContext(host);
        const domain = siteContext.baseUrl;
        const existingUrls = new Set(staticEntries.map(e => e.url));
        const finalEntries: MetadataRoute.Sitemap = [...staticEntries];

        for (const item of dynamicUrls) {
            if (!item?.loc) continue;
            const loc = item.loc.startsWith('http')
                ? item.loc
                : `${domain}${item.loc.startsWith('/') ? item.loc : `/${item.loc}`}`;

            // Bỏ qua URL đã có trong static entries
            if (existingUrls.has(loc)) continue;

            const urlPath = item.loc.startsWith('http')
                ? new URL(item.loc).pathname
                : item.loc;

            let priority = item.priority;
            if (!priority) {
                if (urlPath === '/' || urlPath === '') priority = 1.0;
                else if (urlPath.includes('/tin-tuc')) priority = 0.6;
                else priority = 0.5;
            }

            finalEntries.push({
                url: loc,
                lastModified: item.lastmod || new Date(),
                changeFrequency: item.changefreq || 'weekly',
                priority,
                images: item.images?.map((img: any) => ({
                    url: img.loc,
                    title: img.title,
                    caption: img.caption,
                })),
            });
            existingUrls.add(loc);
        }

        return finalEntries;
    } catch (error) {
        // BE không khả dụng — trả về static đầy đủ, Google vẫn index được tất cả trang
        console.error(`[Sitemap] BE unavailable for ${host}:`, (error as Error).message);
        return staticEntries;
    }
}
