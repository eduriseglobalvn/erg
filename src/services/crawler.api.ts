import { httpClient } from "./http-client";

// --- TYPES ---

export interface RssSource {
    id: string;
    name: string;
    url: string;
    targetCategoryId: string | number; // ID chuyên mục từ MySQL
    categoryName?: string; // Tên chuyên mục hiển thị
    cronExpression: string; // Thay cho cron
    isActive: boolean;
    autoPublish: boolean;
    lastRunAt?: string;
    createdAt?: string;
}

export interface ScraperConfig {
    id: string;
    domain: string;
    type: 'STATIC' | 'DYNAMIC';
    selectorConfig: {
        titleSelector?: string;
        contentSelector?: string;
        thumbnailSelector?: string;
        excludeSelectors?: string[];
    };
    createdAt?: string;
}

export interface CrawlHistoryItem {
    id: string;
    url: string;
    status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REJECTED';
    errorMessage?: string;
    crawledAt: string;
    // Phase 1.4 fields:
    qualityScore?: number;
    qualityReason?: string;
    sourceType?: 'rss' | 'topic' | 'manual';
    sourceName?: string;
    // Phase 2.1 fields:
    duplicateOf?: string | null;
    dedupReason?: string | null;
}

export interface CrawlHistoryResponse {
    items: CrawlHistoryItem[];
    total: number;
    page: number;
    limit: number;
}

export interface CrawlerStats {
    totalRss: number;
    totalConfigs: number;
    totalHistory: number;
    successCrawl: number;
    failedCrawl: number;
    totalPosts: number;
    totalCategories: number;
}

export interface PeekItem {
    title: string;
    link: string;
    thumbnail?: string | null; // <-- New field
    pubDate?: string;
    isCrawled: boolean;
    status?: 'SUCCESS' | 'FAILED';
}

export interface PeekResponse {
    feedName: string;      // Spec says feedName
    feedUrl?: string;
    items: PeekItem[];
}

export interface RssPreviewRequest {
    url: string;
}

export interface RssPreviewResponse {
    title: string;         // Spec says title
    description?: string;
    items: PeekItem[];
}

export interface CreateSelectiveRequest {
    feed: {
        name: string;
        url: string;
        targetCategoryId: string | number;
        isActive: boolean;
    };
    selectedLinks: string[];
}

export interface AiQuotaResponse {
    totalDaily: number;
    usedToday: number;
    remaining: number;
    percentageUsed: number;
    status: 'OK' | 'WARNING' | 'CRITICAL';
    keys: Array<{ label: string; status: string; todayUsage: number; maxDaily: number }>;
}

export interface QualityStats {
    totalToday: number;
    passedCount: number;
    failedCount: number;
    passRate: number;
    topRejectReasons: Array<{ reason: string; count: number }>;
}

// ─── Phase 2.1: Content Dedup ─────────────────────────────────────────────────

export interface DedupStats {
    totalFingerprints: number;
    duplicatesDetectedToday: number;
    dedupRate: number;
}

// ─── Phase 4.3: Content Blacklist ─────────────────────────────────────────────

export interface ContentBlacklistItem {
    id: string;
    type: 'domain' | 'keyword' | 'pattern';
    value: string;
    reason?: string;
    createdBy?: string;
    isActive: boolean;
    expiresAt?: string;
    createdAt?: string;
}

// ─── Phase 4.2: Sitemap Support ───────────────────────────────────────────────

export interface ParsedSitemapUrl {
    url: string;
    lastmod?: string;
    priority?: number;
    changefreq?: string;
}

export interface SitemapDiscoverResponse {
    sitemaps: string[];
}

export interface SitemapParseResponse {
    urls: ParsedSitemapUrl[];
    total: number;
}

// ─── Phase 4.6: Batch Selector Tester ────────────────────────────────────────

export interface BatchTestResult {
    url: string;
    status: 'SUCCESS' | 'FAILED';
    title?: string;
    contentLength?: number;
    error?: string;
}

export interface SelectorSuggestion {
    suggestedTitleSelector: string;
    suggestedContentSelector: string;
    suggestedThumbnailSelector: string;
    suggestedAuthorSelector?: string;
    suggestedDateSelector?: string;
    confidence: number;
    pageType: 'news' | 'blog' | 'forum' | 'ecommerce' | 'unknown';
    cms: 'wordpress' | 'ghost' | 'custom' | 'unknown';
    reasoning: string;
}

export interface BaseResponse<T> {
    statusCode: number;
    message: string;
    data: T;
}

// --- API SERVICE ---

export const crawlerApi = {
    // 1. Dashboard & Thống kê
    getStats: () => {
        return httpClient<BaseResponse<CrawlerStats>>('/crawler/stats').then(res => res.data);
    },

    getActivePipelines: () => {
        return httpClient<BaseResponse<any[]>>('/crawler/active-pipelines').then(res => res.data);
    },

    getHistory: (page: number = 1, limit: number = 20) => {
        return httpClient<BaseResponse<CrawlHistoryResponse>>(`/crawler/history?page=${page}&limit=${limit}`).then(res => res.data);
    },

    // 2. Quản lý Nguồn tin (RSS)
    getRssSources: () => {
        return httpClient<BaseResponse<RssSource[]>>('/crawler/rss').then(res => res.data);
    },

    createRssSource: (data: Partial<RssSource>) => {
        return httpClient<BaseResponse<RssSource>>('/crawler/rss', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => res.data);
    },

    updateRssSource: (id: string, data: Partial<RssSource>) => {
        return httpClient<BaseResponse<RssSource>>(`/crawler/rss/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }).then(res => res.data);
    },

    deleteRssSource: (id: string) => {
        return httpClient<BaseResponse<any>>(`/crawler/rss/${id}`, {
            method: 'DELETE',
        }).then(res => res.data);
    },

    // 3. Cào tin có chọn lọc (Selective Crawling)
    previewRss: (url: string) => {
        return httpClient<BaseResponse<RssPreviewResponse>>('/crawler/rss/preview', {
            method: 'POST',
            body: JSON.stringify({ url }),
        }).then(res => res.data);
    },

    createSelectiveRss: (data: CreateSelectiveRequest) => {
        return httpClient<BaseResponse<any>>('/crawler/rss/create-selective', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => res.data);
    },

    peekRss: (rssId: string) => {
        return httpClient<BaseResponse<PeekResponse>>(`/crawler/rss/peek/${rssId}`).then(res => res.data);
    },

    triggerUrl: (url: string, type: 'STATIC' | 'DYNAMIC' = 'STATIC', targetCategoryId?: string | number) => {
        return httpClient<BaseResponse<{ message: string }>>('/crawler/url/run', {
            method: 'POST',
            body: JSON.stringify({ url, type, targetCategoryId }),
        }).then(res => res.data);
    },

    // 4. Kích hoạt cào toàn bộ
    triggerRss: (id: string) => {
        return httpClient<BaseResponse<any>>('/crawler/rss/trigger', {
            method: 'POST',
            body: JSON.stringify({ id }), // Backend now supports 'id' or 'rssId'
        }).then(res => res.data);
    },

    syncRss: (id: string) => {
        return httpClient<BaseResponse<any>>(`/crawler/rss/sync/${id}`, {
            method: 'POST',
        }).then(res => res.data);
    },

    // 5. Cấu hình Scraper
    getConfigs: () => {
        return httpClient<BaseResponse<ScraperConfig[]>>('/crawler/configs').then(res => res.data);
    },

    createConfig: (data: Partial<ScraperConfig>) => {
        return httpClient<BaseResponse<ScraperConfig>>('/crawler/configs', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => res.data);
    },

    updateConfig: (id: string, data: Partial<ScraperConfig>) => {
        return httpClient<BaseResponse<ScraperConfig>>(`/crawler/configs/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }).then(res => res.data);
    },

    deleteConfig: (id: string) => {
        return httpClient<BaseResponse<any>>(`/crawler/configs/${id}`, {
            method: 'DELETE',
        }).then(res => res.data);
    },

    // 6. AI Quota & Quality Gate
    getAiQuota: () => {
        return httpClient<BaseResponse<AiQuotaResponse>>('/crawler/ai-quota').then(res => res.data);
    },

    getQualityStats: () => {
        return httpClient<BaseResponse<QualityStats>>('/crawler/quality-stats').then(res => res.data);
    },

    // Phase 2.1: Content Dedup
    getDedupStats: () => {
        return httpClient<BaseResponse<DedupStats>>('/crawler/dedup-stats').then(res => res.data);
    },

    // Phase 4.3: Content Blacklist
    getBlacklist: (type?: string) => {
        const qs = type ? `?type=${type}` : '';
        return httpClient<BaseResponse<ContentBlacklistItem[]>>(`/crawler/blacklist${qs}`).then(res => res.data);
    },

    createBlacklist: (data: {
        type: string;
        value: string;
        reason?: string;
        createdBy?: string;
        expiresAt?: string;
    }) => {
        return httpClient<BaseResponse<ContentBlacklistItem>>('/crawler/blacklist', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(res => res.data);
    },

    updateBlacklist: (id: string, data: {
        reason?: string;
        isActive?: boolean;
        expiresAt?: string;
    }) => {
        return httpClient<BaseResponse<ContentBlacklistItem>>(`/crawler/blacklist/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        }).then(res => res.data);
    },

    deleteBlacklist: (id: string) => {
        return httpClient<BaseResponse<{ success: boolean }>>(`/crawler/blacklist/${id}`, {
            method: 'DELETE',
        }).then(res => res.data);
    },

    // Phase 4.2: Sitemap Support
    discoverSitemaps: (domain: string) => {
        return httpClient<BaseResponse<SitemapDiscoverResponse>>(
            `/crawler/sitemap/discover?domain=${encodeURIComponent(domain)}`,
        ).then(res => res.data);
    },

    parseSitemap: (url: string) => {
        return httpClient<BaseResponse<SitemapParseResponse>>('/crawler/sitemap/parse', {
            method: 'POST',
            body: JSON.stringify({ url }),
        }).then(res => res.data);
    },

    // Phase 4.6: Batch Selector Tester
    testBatchSelectors: (urls: string[], type: 'STATIC' | 'DYNAMIC' = 'STATIC') => {
        return httpClient<BaseResponse<BatchTestResult[]>>('/crawler/configs/test-batch', {
            method: 'POST',
            body: JSON.stringify({ urls, type }),
        }).then(res => res.data);
    },

    analyzeSmartSelectors: (url: string) => {
        return httpClient<BaseResponse<SelectorSuggestion>>('/crawler/smart-selector/analyze', {
            method: 'POST',
            body: JSON.stringify({ url }),
        }).then(res => res.data);
    },
};
