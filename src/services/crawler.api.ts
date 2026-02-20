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
    status: 'SUCCESS' | 'FAILED' | 'PENDING';
    errorMessage?: string;
    crawledAt: string;
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
    }
};
