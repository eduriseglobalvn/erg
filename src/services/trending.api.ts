import { httpClient } from './http-client';

export interface TrendingTopic {
    _id: string;
    keyword: string;
    trendScore: number;
    source: 'google_trends' | 'news_api' | 'manual';
    searchVolume?: number;
    velocity?: number;
    discoveredAt: string;
    lastCheckedAt?: string;
    lastCrawledAt?: string;
    status: 'active' | 'crawling' | 'paused' | 'expired';
    priority: number;
    crawlCount: number;
    urlCount: number;
    successCount: number;
    failCount: number;
    autoCrawlEnabled?: boolean;
    scoreBreakdown?: {
        frequency: number;
        velocity: number;
        recency: number;
        confidence: number;
    };
}

export interface TrendingKeyword {
    _id: string;
    keyword: string;
    status: 'watching' | 'paused' | 'crawling';
    createdAt: string;
}

export interface TrendingStats {
    totalTopics: number;
    activeTopics: number;
    avgScore: number;
    topKeyword: string;
    discoveredToday: number;
}

export interface TopicsResponse {
    data: TrendingTopic[];
    total: number;
}

function unwrap<T>(res: any): T {
    return (res?.data ?? res) as T;
}

export const trendingApi = {
    getTopics(limit = 20, page = 1): Promise<TopicsResponse> {
        return httpClient(`/trending/topics?limit=${limit}&page=${page}`).then((res: any) => unwrap<TopicsResponse>(res));
    },

    getTopic(id: string): Promise<TrendingTopic> {
        return httpClient(`/trending/topics/${id}`).then((res: any) => unwrap<TrendingTopic>(res));
    },

    triggerDiscover(): Promise<{ message: string; topics: TrendingTopic[] }> {
        return httpClient('/trending/discover', {
            method: 'POST',
        }).then((res: any) => unwrap<{ message: string; topics: TrendingTopic[] }>(res));
    },

    crawlTopic(id: string, options?: { limit?: number; targetCategoryId?: string }): Promise<{
        topicId: string;
        keyword: string;
        discoveredUrls: number;
        queued: number;
        skipped: number;
    }> {
        return httpClient(`/trending/topics/${id}/crawl`, {
            method: 'POST',
            body: JSON.stringify(options || {}),
        }).then((res: any) => unwrap(res));
    },

    updatePriority(id: string, priority: number): Promise<{ success: boolean }> {
        return httpClient(`/trending/topics/${id}/priority`, {
            method: 'PATCH',
            body: JSON.stringify({ priority }),
        }).then((res: any) => unwrap<{ success: boolean }>(res));
    },

    toggleAutoCrawl(id: string, enabled: boolean): Promise<{ success: boolean }> {
        return httpClient(`/trending/topics/${id}/auto-crawl`, {
            method: 'PATCH',
            body: JSON.stringify({ enabled }),
        }).then((res: any) => unwrap<{ success: boolean }>(res));
    },

    deleteTopic(id: string): Promise<{ success: boolean }> {
        return httpClient(`/trending/topics/${id}`, {
            method: 'DELETE',
        }).then((res: any) => unwrap<{ success: boolean }>(res));
    },

    getStats(): Promise<TrendingStats> {
        return httpClient('/trending/stats').then((res: any) => unwrap<TrendingStats>(res));
    },

    getKeywords(): Promise<TrendingKeyword[]> {
        return httpClient('/trending/keywords').then((res: any) => unwrap<TrendingKeyword[]>(res));
    },

    addKeyword(keyword: string, userId?: string): Promise<TrendingKeyword> {
        return httpClient('/trending/keywords', {
            method: 'POST',
            body: JSON.stringify({ keyword, userId }),
        }).then((res: any) => unwrap<TrendingKeyword>(res));
    },

    deleteKeyword(id: string): Promise<{ success: boolean }> {
        return httpClient(`/trending/keywords/${id}`, {
            method: 'DELETE',
        }).then((res: any) => unwrap<{ success: boolean }>(res));
    },
};
