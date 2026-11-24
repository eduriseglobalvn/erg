import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { resolveSiteContext, resolveSiteContextFromHeaders } from '@/lib/site-context';
import { getPreferredBackendBaseUrl } from '@/lib/backend-url';
import { TRAINING_FIELDS } from '@/constants/training-fields';

export const dynamic = 'force-dynamic';

type SitemapEntry = MetadataRoute.Sitemap[number];
type ChangeFrequency = NonNullable<SitemapEntry['changeFrequency']>;
type StaticSitemapRoute = {
    path: string;
    priority: number;
    changefreq: string;
    images?: string[];
};
type BackendSitemapImage = {
    loc?: string;
};
type BackendSitemapItem = {
    loc?: string;
    lastmod?: string | Date;
    changefreq?: string;
    priority?: number;
    images?: BackendSitemapImage[];
};

const CHANGE_FREQUENCIES = new Set<ChangeFrequency>([
    'always',
    'hourly',
    'daily',
    'weekly',
    'monthly',
    'yearly',
    'never',
]);

function normalizeChangeFrequency(value?: string): ChangeFrequency {
    return CHANGE_FREQUENCIES.has(value as ChangeFrequency)
        ? value as ChangeFrequency
        : 'weekly';
}

// ─── Static pages config ───────────────────────────────────────────────────
// Toàn bộ trang tĩnh của từng subdomain — KHÔNG phụ thuộc BE.
// BE chỉ cần cho bài viết / tin tức động.
const PAGES_CONFIG = {
    main: [
        { path: '', priority: 1, changefreq: 'daily' },
        { path: '/linh-vuc-dao-tao', priority: 0.9, changefreq: 'weekly', images: ['/util/ic3.jpg'] },
        ...TRAINING_FIELDS.map((field) => ({
            path: field.link,
            priority: 0.82,
            changefreq: 'weekly',
            images: [field.image],
        })),
        { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
        { path: '/tim-kiem', priority: 0.65, changefreq: 'weekly' },
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
        { path: '/gioi-thieu', priority: 0.75, changefreq: 'monthly' },
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
        { path: '/tim-kiem', priority: 0.65, changefreq: 'weekly' },
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
        { path: '/tim-kiem', priority: 0.65, changefreq: 'weekly' },
        { path: '/khoa-hoc', priority: 0.9, changefreq: 'weekly' },
        { path: '/khoa-hoc/hoc-cung-ai', priority: 0.8, changefreq: 'weekly' },
        { path: '/doi-ngu-giao-vien', priority: 0.7, changefreq: 'monthly' },
        { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
    ],
    congdanso: [
        { path: '', priority: 1, changefreq: 'daily' },
        { path: '/tin-tuc', priority: 0.8, changefreq: 'hourly' },
        { path: '/tim-kiem', priority: 0.65, changefreq: 'weekly' },
        { path: '/lo-trinh', priority: 0.7, changefreq: 'monthly' },
        { path: '/lien-he', priority: 0.7, changefreq: 'monthly' },
    ],
    dientoandammay: [
        { path: '', priority: 1, changefreq: 'daily' },
    ],
} satisfies Record<string, StaticSitemapRoute[]>;

// Slot không dành cho index: portal học tập, diễn đàn, CMS.
const NON_INDEXED_SITES = new Set(['elearning', 'forum', 'cms', 'lms']);

// ─── Helper ────────────────────────────────────────────────────────────────
function normalizeSitemapImage(domain: string, image: string) {
    const normalizedImage = image.startsWith('http') ? image : `${domain}${image.startsWith('/') ? image : `/${image}`}`;
    return normalizedImage.replace(/&(?!amp;)/g, '&amp;');
}

// Khớp canonical của generateCanonical: trang chủ có "/", các path khác không có "/" cuối.
function toPublicUrl(domain: string, path: string) {
    const normalized = path.replace(/\/+$/, '');
    if (!normalized) return `${domain}/`;
    return `${domain}${normalized.startsWith('/') ? normalized : `/${normalized}`}`;
}

function buildStaticEntries(host: string, buildDate?: Date): MetadataRoute.Sitemap {
    const siteContext = resolveSiteContext(host);
    if (NON_INDEXED_SITES.has(siteContext.siteKey)) return [];

    const isLocal = siteContext.protocol === 'http';
    const domain = siteContext.baseUrl;
    const port = host.includes(':') ? `:${host.split(':')[1]}` : '';
    const localRootHost = host.includes('localhost') ? 'localhost' : siteContext.rootDomain;

    const toEntry = (route: StaticSitemapRoute): SitemapEntry => ({
        url: toPublicUrl(domain, route.path),
        ...(buildDate && { lastModified: buildDate }),
        changeFrequency: normalizeChangeFrequency(route.changefreq),
        priority: route.priority,
        images: route.images?.map((image) => normalizeSitemapImage(domain, image)),
    });

    if (siteContext.isRoot) {
        const entries: MetadataRoute.Sitemap = PAGES_CONFIG.main.map(toEntry);

        Object.keys(PAGES_CONFIG)
            .filter(k => k !== 'main')
            .forEach(subKey => {
                const subHost = isLocal
                    ? `${subKey}.${localRootHost}${port}`
                    : `${subKey}.${siteContext.rootDomain}`;
                entries.push({
                    url: `${siteContext.protocol}://${subHost}/`,
                    ...(buildDate && { lastModified: buildDate }),
                    changeFrequency: 'daily',
                    priority: 0.9,
                });
            });
        return entries;
    }

    const subRoutes: StaticSitemapRoute[] =
        PAGES_CONFIG[siteContext.siteKey as keyof typeof PAGES_CONFIG] ||
        [{ path: '', priority: 1, changefreq: 'daily' }];
    return subRoutes.map(toEntry);
}

// ─── Main export ───────────────────────────────────────────────────────────
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const apiUrl = getPreferredBackendBaseUrl();
    // Chỉ dùng BUILD_DATE thật; không có thì bỏ lastmod thay vì ghi "bây giờ" cho mọi URL.
    const buildDate = process.env.BUILD_DATE ? new Date(process.env.BUILD_DATE) : undefined;

    let host = resolveSiteContext('').host;
    try {
        const headersList = await headers();
        host = resolveSiteContextFromHeaders(headersList).host;
    } catch { /* fallback đã set trên */ }

    const siteContext = resolveSiteContext(host);
    const domain = siteContext.baseUrl;

    // 1. Luôn build static entries trước — không cần BE. Không bao giờ thêm URL giả.
    const staticEntries = buildStaticEntries(host, buildDate);
    if (!staticEntries.length) return staticEntries;

    // 2. Chỉ gọi BE để lấy bài viết / tin tức động (cache 1 giờ theo host)
    try {
        const sitemapQuery = new URLSearchParams({ domain: host });
        const response = await fetch(`${apiUrl}/api/sitemap/data?${sitemapQuery.toString()}`, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(5000), // timeout 5s, không chờ BE mãi
        });

        if (!response.ok) {
            console.error(`[Sitemap] BE returned ${response.status} for ${host}`);
            return staticEntries;
        }

        const json = await response.json() as { data?: { urls?: BackendSitemapItem[] } };
        const dynamicUrls = json.data?.urls || [];

        const existingUrls = new Set(staticEntries.map(e => e.url));
        const finalEntries: MetadataRoute.Sitemap = [...staticEntries];

        for (const item of dynamicUrls) {
            if (!item?.loc) continue;

            let path = item.loc;
            if (item.loc.startsWith('http')) {
                const parsed = new URL(item.loc);
                // URL khác host không hợp lệ trong sitemap của host này
                if (parsed.origin !== new URL(domain).origin) continue;
                path = parsed.pathname + parsed.search;
            }
            const loc = toPublicUrl(domain, path);

            if (existingUrls.has(loc)) continue;

            let priority = item.priority;
            if (!priority) {
                priority = path.includes('/tin-tuc') ? 0.6 : 0.5;
            }

            const lastModified = item.lastmod && !Number.isNaN(new Date(item.lastmod).getTime())
                ? item.lastmod
                : undefined;

            finalEntries.push({
                url: loc,
                ...(lastModified && { lastModified }),
                changeFrequency: normalizeChangeFrequency(item.changefreq),
                priority,
                images: item.images?.flatMap((img) => img.loc ? [normalizeSitemapImage(domain, img.loc)] : []),
            });
            existingUrls.add(loc);
        }

        return finalEntries;
    } catch (error) {
        // BE không khả dụng — chỉ trả static routes
        console.error(`[Sitemap] BE unavailable for ${host}:`, (error as Error).message);
        return staticEntries;
    }
}
